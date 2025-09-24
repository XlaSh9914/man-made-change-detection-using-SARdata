// Creates and returns the layout for the input panel
function createLayout(yearSelect1, yearSelect2, monthSelect, sizeLabel1, sizeLabel2, runButton, clearButton) {
    return ui.Panel({
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
            runButton,
            clearButton
        ],
        layout: ui.Panel.Layout.flow('vertical'),
        style: {position: 'top-right', width: '300px'}
    });
}

exports.createLayout = createLayout;
