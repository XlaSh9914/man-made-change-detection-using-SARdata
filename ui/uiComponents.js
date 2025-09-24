var layout = require('users/shivampachpute2004/SIH24_Man-made_Change_Detection:SIH24_1563/ui/layout');

// Create and return the UI panel
function createUI(updateCollectionCallback, clearMapCallback) {
    var yearSelect1 = createYearDropdown();
    var yearSelect2 = createYearDropdown();
    var monthSelect = createMonthDropdown();
    var sizeLabel1 = createSizeLabel();
    var sizeLabel2 = createSizeLabel();
    var runButton = createRunButton(updateCollectionCallback);
    var clearButton = createClearButton(clearMapCallback);

    return layout.createLayout(yearSelect1, yearSelect2, monthSelect, sizeLabel1, sizeLabel2, runButton, clearButton);
}

// Export UI elements for access
exports.createUI = createUI;
exports.yearSelect1 = createYearDropdown();
exports.yearSelect2 = createYearDropdown();
exports.monthSelect = createMonthDropdown();
exports.sizeLabel1 = createSizeLabel();
exports.sizeLabel2 = createSizeLabel();

function createYearDropdown() {
    return ui.Select({
        items: ['2015', '2016', '2017', '2018', '2019', '2020', '2021', '2022', '2023', '2024'],
        placeholder: 'Select Year'
    });
}

function createMonthDropdown() {
    return ui.Select({
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
}

function createSizeLabel() {
    return ui.Label('Filtered Collection Size: ...');
}

function createRunButton(callback) {
    return ui.Button('Run', callback);
}

function createClearButton(callback) {
    return ui.Button('Clear geometry', callback);
}
