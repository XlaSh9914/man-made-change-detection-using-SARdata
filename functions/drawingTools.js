// Enable the drawing tool
function enableDrawingTool(onAOIDrawnCallback, dates) {
    var drawingTools = Map.drawingTools();
    drawingTools.setShown(true);
    drawingTools.setShape('rectangle');

    drawingTools.onDraw(function(geometry) {
        onAOIDrawnCallback(geometry, dates);
        drawingTools.clear();
    });
}

// Clear the drawing layers
function clear() {
    var drawingTools = Map.drawingTools();
    drawingTools.layers().forEach(function(layer) {
        drawingTools.layers().remove(layer);
    });
}

exports.enableDrawingTool = enableDrawingTool;
exports.clear = clear;
