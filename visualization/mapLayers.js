var colorPalettes = require('users/shivampachpute2004/SIH24_Man-made_Change_Detection:SIH24_1563/visualization/colorPalettes');

// Visualize results on the map
function visualizeResults(result, aoi) {
    // Visualization code using the result object and adding layers to the map
    Map.addLayer(result.newUrbanAreas, {palette: colorPalettes.urbanNew}, 'New Urban Areas');
    Map.addLayer(result.lostUrbanAreas, {palette: colorPalettes.urbanLost}, 'Lost Urban Areas');
    // Add other layers as necessary
}

exports.visualizeResults = visualizeResults;
