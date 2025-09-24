var imageCollection = ee.ImageCollection("COPERNICUS/S1_GRD");

// Add drawing tools to the map
var drawingTools = Map.drawingTools();

// Clear the map and previous drawings
clearMap();
  
// Create dropdown for years
var yearSelect1 = ui.Select({
  items: ['2015', '2016', '2017', '2018', '2019', '2020', '2021', '2022', '2023', '2024'],
  placeholder: 'Select Year 1'
});
var yearSelect2 = ui.Select({
  items: ['2015', '2016', '2017', '2018', '2019', '2020', '2021', '2022', '2023', '2024'],
  placeholder: 'Select Year 2'
});

// Create a dropdown for selecting the month
var monthSelect = ui.Select({
  items: [
    {label: 'January', value: '01-31'},
    {label: 'February', value: '02-28'},
    {label: 'March', value: '03-31'},
    {label: 'April', value: '04-30'},
    {label: 'May', value: '05-31'},
    {label: 'June', value: '06-30'},
    {label: 'July', value: '07-31'},
    {label: 'August', value: '08-31'},
    {label: 'September', value: '09-30'},
    {label: 'October', value: '10-31'},
    {label: 'November', value: '11-30'},
    {label: 'December', value: '12-31'}
  ],
  placeholder: 'Select Month',
});

// Create a label to display the filtered collection size
var sizeLabel1 = ui.Label('Filtered Collection 1 Size: ...');
var sizeLabel2 = ui.Label('Filtered Collection 2 Size: ...');

// Create a panel for user inputs
var inputPanel = ui.Panel({
  widgets: [
    ui.Label('Select Two Time Periods:'),
    ui.Label('Period 1:'),
    yearSelect1,
    sizeLabel1,
    ui.Label('Period 2:'),
    yearSelect2,
    sizeLabel2,
    ui.Label('Common Month:'),
    monthSelect,
    ui.Button('Run', AOIDraw),
    ui.Button('Clear geometry', clearMap)
  ],
  layout: ui.Panel.Layout.flow('vertical'),
  style: {position: 'top-right', width: 700}
});

// Add the input panel to the map
Map.add(inputPanel);

function AOIDraw(){
  // Listen for rectangle drawing completion
  print('AOIDraw Called');
  
  // Add drawing tools to the map
  drawingTools.setShown(true);
  drawingTools.setShape('rectangle');
  
  drawingTools.onDraw(function(geometry) {
    updateCollection(geometry);
    drawingTools.clear();  // Clear the drawing tool after the AOI is defined
  });  
}

    
// Function to handle the date submission
function updateCollection(aoi) {
  print("Calling updateCollection");
  
  var year1 = yearSelect1.getValue();
  var year2 = yearSelect2.getValue();
  var month = monthSelect.getValue().slice(0,2);
  var monthEnd = monthSelect.getValue();
  
  if (year1 && year2 && month) {
    // Construct start and end dates
    var startDate1 = year1 + '-' + month + '-01';
    var endDate1 = year1 + '-' + monthEnd;
    var startDate2 = year2 + '-' + month + '-01';
    var endDate2 = year2 + '-' + monthEnd;
    
    print(startDate1, endDate1);
    
    var filteredCollection1 = ee.ImageCollection('COPERNICUS/S1_GRD')
    .filterBounds(aoi)
    .filterDate(startDate1, endDate1)
    .select('VV');
    
    var filteredCollection2 = ee.ImageCollection('COPERNICUS/S1_GRD')
    .filterBounds(aoi)
    .filterDate(startDate2, endDate2)
    .select('VV');
    
    // Get the size of the filtered collection
    var size1 = filteredCollection1.size();
    var size2 = filteredCollection2.size();
    print('Filtered Collection 1:', filteredCollection1);
    print('Filtered Collection 2:', filteredCollection2);

    // Update the label with the filtered collection size
    sizeLabel1.setValue('Filtered Collection Size: ' + size1.getInfo());
    sizeLabel2.setValue('Filtered Collection Size: ' + size2.getInfo());
    
    print('Filtered Collection Size 1:', size1);
    print('Filtered Collection Size 2:', size2);
    print('Selected Dates:', startDate1, 'to', endDate1, 'and', startDate2, 'to', endDate2);}

    if(size1.getInfo()!==0 && size2.getInfo()!==0){
      // Clear the map and previous drawings
      // clearMap();
      print("Calling onAOIDrawn",size1,size2,size1!==0 && size2!==0);
      
      onAOIDrawn(aoi, filteredCollection1, filteredCollection2);
    }
    else {
      print("Error: Choose from September of 2016")
    }
}

// Function to clear all previous geometries and layers
function clearMap() {
  //Map.clear();  // Clear all layers on the map
  drawingTools.layers().forEach(function(layer) {
    drawingTools.layers().remove(layer);  // Remove all drawing tool layers
  });
}

// Function to handle when the user completes the drawing
function onAOIDrawn(aoi, foundCollection1, foundCollection2) {
  
  // Calculate the area of the AOI in square kilometers
  var areaSqKm = aoi.area({maxError: 1}).divide(1e6);  // Specify maxError as 1, Convert from square meters to square kilometers

  // Print the AOI area
  print('The area of the AOI is: ', areaSqKm, ' square kilometers');
  
  var areaLabel = ui.Label('Area of AOI: ' + areaSqKm.getInfo().toFixed(2) + ' sq. km');

  // Create a panel and set its layout to the left side
  var areaPanel = ui.Panel({
    widgets: [areaLabel],
    style: {position: 'top-left'}
  });
  
  // Add the panel to the map
  Map.add(areaPanel);
    
  print('Filtered Collection 1:', foundCollection1);
  print('Filtered Collection 2:', foundCollection2);
  
  // Get the median VV images for each period
  var image1 = foundCollection1.first().clip(aoi);  // old image
  var image2 = foundCollection2.first().clip(aoi);  // new image
  
  print(image1, image2);
  
  // Define thresholds for urban areas and water bodies
  var brightThreshold = -3; // Threshold for urban areas (in dB)
  var waterThreshold = -13;  // Lower threshold for water body changes (in dB)

  // Extract bright areas (urban) for both periods
  var urbanParts1 = image1.gt(brightThreshold).multiply(1).clip(aoi);  // Urban areas for 2017
  var urbanParts2 = image2.gt(brightThreshold).multiply(1).clip(aoi);  // Urban areas for 2024
  
  // Load MODIS water mask (use MODIS Land Cover dataset)
  var landCover = ee.Image('MODIS/006/MCD12Q1/2020_01_01').select('LC_Type1');
  var waterMask = landCover.eq(17);  // 17 is the code for Water Bodies
  
  // Extract water changes using the lower threshold
  var waterParts1 = image1.gt(waterThreshold).multiply(1).updateMask(waterMask).clip(aoi);  // Water areas for 2017
  var waterParts2 = image2.gt(waterThreshold).multiply(1).updateMask(waterMask).clip(aoi);  // Water areas for 2024
  
  // Calculate urban changes: areas that became brighter (new urban areas) and areas that dimmed
  var newUrbanAreas = urbanParts2.and(urbanParts1.not()).selfMask();  // New urban areas
  var lostUrbanAreas = urbanParts1.and(urbanParts2.not()).selfMask();  // Lost urban areas
  
  // Calculate water changes: areas that became brighter (new water areas) and areas that dimmed
  var newWaterAreas = waterParts2.and(waterParts1.not()).selfMask();  // New water areas in 2024
  var lostWaterAreas = waterParts1.and(waterParts2.not()).selfMask();  // Lost water areas
  
  function calculateArea(maskedImage) {
    var pixelArea = ee.Image.pixelArea();  // Create an image where each pixel is its area in square meters
    var maskedArea = maskedImage.multiply(pixelArea).reduceRegion({
      reducer: ee.Reducer.sum(),
      geometry: aoi,
      scale: 20,  // Adjust this to the appropriate scale for Sentinel-1 data (10-30 meters)
      maxPixels: 1e9
    });
    print('Print the maskedArea to debug');
    
    // Print the maskedArea to debug
    print('Masked Area:', maskedArea);
    
    // Check if 'area' is defined in the result
    var area = maskedArea.get('VV');
    print('area: ', ee.Number(area).divide(1e6));
    
    return ee.Number(area).divide(1e6);   // Convert square meters to square kilometers
  }

  
  // Calculate the area of new and lost urban areas in square kilometers
  var newUrbanAreaSqKm = calculateArea(newUrbanAreas);
  var lostUrbanAreaSqKm = calculateArea(lostUrbanAreas);
  
  // Calculate the area of new and lost water areas in square kilometers
  var newWaterAreaSqKm = calculateArea(newWaterAreas);
  var lostWaterAreaSqKm = calculateArea(lostWaterAreas);
  
  // Helper function to display the calculated area or show 'N/A' if undefined
  function displayArea(value, label, widgetIndex) {
    var formattedLabel;
    value.evaluate(function(val) {
      if (val !== null && val !== undefined) {
        formattedLabel = ui.Label(label + ': ' + val.toFixed(2) + ' sq. km');
        processedAreaPanel.widgets().set(widgetIndex, formattedLabel);  // Update panel with new value
      } else {
        formattedLabel = ui.Label(label + ': N/A');
        processedAreaPanel.widgets().set(widgetIndex, formattedLabel);  // Update panel with 'N/A'
      }
    });
  }
  
  // Display the calculated areas in the UI panel
  displayArea(newUrbanAreaSqKm, 'New Urban Area', 0);
  displayArea(lostUrbanAreaSqKm, 'Lost Urban Area', 1);
  displayArea(newWaterAreaSqKm, 'New Water Area', 2);
  displayArea(lostWaterAreaSqKm, 'Lost Water Area', 3);
  
  // Create a panel and set its layout to the left side of the screen
  var processedAreaPanel = ui.Panel({
    widgets: [
      ui.Label('New Urban Area: ...'),
      ui.Label('Lost Urban Area: ...'),
      ui.Label('New Water Area: ...'),
      ui.Label('Lost Water Area: ...')
    ],
    style: {position: 'top-left'}
  });
  
  // Add the panel to the map
  Map.add(processedAreaPanel);
  
  // Visualization parameters
  var vhVisParams = {min: -25, max: 0};                 // For the original VH images
  var urbanVisParams = {palette: ['cyan']};             // For the urban parts (cyan color)
  var waterVisParams = {palette: ['blue']};             // For the water parts (blue color)
  var urbanChangeVisParams = {palette: ['green', 'red']}; // Green for new, red for lost urban areas
  var waterChangeVisParams = {palette: ['lightblue', 'purple']};  // Light blue for new, purple for lost water
  
  // Add layers to the map for the original VH data
  Map.addLayer(image1, vhVisParams, 'Original VH Image Period 1');
  Map.addLayer(image2, vhVisParams, 'Original VH Image Period 2');
  
  // Add layers to the map for urban areas
  // Map.addLayer(urbanParts1, urbanVisParams, 'Urban Areas (2017)');
  // Map.addLayer(urbanParts2, urbanVisParams, 'Urban Areas (2024)');
  
  // Add layers to the map for water areas
  Map.addLayer(waterParts1, waterVisParams, 'Water Areas (2017)',false);
  Map.addLayer(waterParts2, waterVisParams, 'Water Areas (2024)',false);
  
  // Add difference layers for urban areas: Green for new urban areas, Red for lost urban areas
  Map.addLayer(newUrbanAreas, {palette: ['blue']}, 'New Urban Areas');
  Map.addLayer(lostUrbanAreas, {palette: ['red']}, 'Lost Urban Areas',false);
  
  // Add difference layers for water areas: Light Blue for new water, Purple for lost water
  Map.addLayer(newWaterAreas, {palette: ['lightblue']}, 'New Water Areas');
  Map.addLayer(lostWaterAreas, {palette: ['pink']}, 'Lost Water Areas',false);
}
print('Please draw a rectangle on the map to define the area of interest (AOI).');