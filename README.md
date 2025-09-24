# Sentinel-1 SAR Land and Water Change Detection

## Project Overview
This project is a Google Earth Engine application that leverages Sentinel-1 Synthetic Aperture Radar (SAR) data to detect changes in urban and water areas over two user-defined time periods. The application features a modular design with an interactive map interface, allowing users to select years and a common month, draw a rectangular Area of Interest (AOI), and analyze changes in urban and water bodies using SAR backscatter thresholds. Results include calculated areas of new and lost regions, visualized on the map.

## Features
- **Interactive Map Interface**: Users can draw a rectangular AOI to define the analysis region.
- **Time Period Selection**: Select two different years and a common month for temporal comparison via the UI.
- **SAR Data Processing**: Utilizes Sentinel-1 SAR data (`COPERNICUS/S1_GRD`) to detect changes.
- **Change Detection**:
  - Identifies new and lost urban areas using a backscatter threshold (-3 dB).
  - Identifies new and lost water bodies using a threshold (-13 dB) with a MODIS water mask.
- **Area Calculation**: Computes the AOI area and changes in urban and water regions in square kilometers.
- **Visualization**: Displays original SAR images, urban and water areas, and change detection layers.

## Repository Structure
- `functions/`
  - `dataCollection.js`: Handles data retrieval and filtering from Sentinel-1 and MODIS datasets.
  - `drawingTools.js`: Manages the drawing tools for defining the AOI on the map.
- `ui/`
  - `uiComponents.js`: Defines UI elements like dropdowns and buttons for user input.
  - `uiLayout.js`: Organizes the layout and positioning of UI panels on the map.
- `visualization/`
  - `colorPalettes.js`: Contains color schemes for visualizing different layers (e.g., urban, water).
  - `mapLayers.js`: Manages the addition and styling of map layers for visualization.
- `main.js`: The main script integrating all modules, orchestrating the application workflow.

## Prerequisites
- A Google Earth Engine account (sign up at [code.earthengine.google.com](https://code.earthengine.google.com)).
- Basic familiarity with JavaScript and Google Earth Engine's API.

## How to Use
1. **Access Google Earth Engine**:
   - Log in to the Google Earth Engine Code Editor.
2. **Upload the Code**:
   - Upload the entire project folder or copy the contents of each file into corresponding scripts in the GEE Code Editor.
3. **Run the Script**:
   - Execute `main.js` to initialize the map and UI panel.
4. **Select Time Periods**:
   - Choose two years and a common month from the dropdown menus in the top-right panel.
   - Note: Data availability starts from September 2016 for Sentinel-1 SAR.
5. **Draw AOI**:
   - Click the "Run" button to enable the rectangle drawing tool.
   - Draw a rectangular AOI on the map to define the analysis region.
6. **View Results**:
   - The map will display original SAR images, water areas, and change detection layers (new/lost urban and water areas).
   - The top-left panel shows the AOI area and calculated areas for new/lost urban and water regions.
7. **Clear Map**:
   - Use the "Clear geometry" button to reset the map and start a new analysis.

## Data Sources
- **Sentinel-1 SAR**: `COPERNICUS/S1_GRD` ImageCollection for VV polarization data.
- **MODIS Land Cover**: `MODIS/006/MCD12Q1` for water body masking (LC_Type1, value 17).

## Notes
- The analysis is limited to Sentinel-1 data availability (starting from September 2016).
- Ensure the selected AOI is not too large to avoid exceeding the `maxPixels` limit in area calculations.
- The script uses predefined thresholds (-3 dB for urban, -13 dB for water) which may need adjustment based on specific use cases.

## Limitations
- The MODIS water mask may not capture all water bodies accurately, especially small or temporary features.
- Change detection relies on simple thresholding, which may require refinement for complex landscapes.
- The script assumes valid time periods with available Sentinel-1 data.

## Future Improvements
- Add support for additional SAR polarizations (e.g., VH) for enhanced detection.
- Implement advanced classification methods for improved accuracy.
- Allow user customization of backscatter thresholds via the UI.

## License
This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Acknowledgments
- Google Earth Engine team for providing the platform and data access.
- European Space Agency (ESA) for Sentinel-1 SAR data.
- NASA for MODIS Land Cover data.