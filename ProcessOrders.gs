function checkForResponses() {

  if(_getConsoleSwitchStatus()) {
    const LogTime = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), "hh:mm a");
    RLog("Ran checkForResponses at " + LogTime);
  }

  var NumberOfResponsesProcessed = 0;

  var Sheet = SpreadsheetApp.getActive().getSheetByName(SHEETNAME_GOOGLEFORMSHEET);

  try {
    var Rows = Sheet.getDataRange().getValues();
  } 
  catch (e) { 
    throw new Error("Google Form sheet name changed from: " + SHEETNAME_GOOGLEFORMSHEET); 
  }
  
  // Start at 1 to skip Google Form Sheet Header
  for (var Counter = 1; Counter < Rows.length; Counter++) {

    var CurrentRow = Rows[Counter];

    if (CurrentRow[0] != null && CurrentRow[0] != "" && !checkIfProcessed_(CurrentRow)) {

      var DupeCount = dupeCheck(Sheet, CurrentRow, Counter, 10, [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1]);

      if (DupeCount == 0) {
        processResponse(CurrentRow, Counter, NumberOfResponsesProcessed);
        NumberOfResponsesProcessed++;
      }
      else {
        var SlackMessage = "Duplicate Order Detected: Not added to Catering TV \n";

        SlackMessage += "> Guest-Name: " + CurrentRow[2] + "\n";
        SlackMessage += "> Duplicates Found: " + DupeCount;

        postToSlack(SlackMessage);
        finishProcessing_(CurrentRow, Counter);
        NumberOfResponsesProcessed++;
      }
    }
  }

}