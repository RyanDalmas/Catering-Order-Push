function RLog(info) {
  RyLog(info);
}

function RyLog(info) {
  try {
    var Sheet = SpreadsheetApp.getActive().getSheetByName(SHEETNAME_CONSOLE);
  }
  catch(e) {
    throw new Error("Console sheet name changed from: " + SHEETNAME_CONSOLE);
  }

  Sheet.insertRowBefore(1);

  Sheet.getRange("A1").setValue(info);
}
