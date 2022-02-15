function dupeCheck(Sheet, Row, RowStart = -1, RowsToCheck = 1, Except = [1]) {

  const DEBUG = _getConsoleSwitchStatus();

  try {
    var Values = Sheet.getDataRange().getValues();
  }
  catch(e) { throw new Error("Dupe check failed for: " + Row); }

  if(RowStart == -1) RowStart = Values.length;

  var MatchesCount = 0;

  for(var Counter = RowStart-1; Counter >= RowStart - (RowsToCheck+1) && Counter > 0; Counter--) {

    if(_getConsoleSwitchStatus()) RyLog(Counter);
    
    var CheckingRow = Values[Counter];

    var Matches = true;

    for(var Counter2 = 0; Counter2 < CheckingRow.length; Counter2++) {
      if(DEBUG) 
       RyLog("============> Begin Index " + Counter2);
      
      var Exception = false;
      
      if(Except[Counter2] != null) {
        if(DEBUG) Logger.log("Exception Detected: " + Except[Counter2]);
        Exception = (Except[Counter2] == 1) ? true : false;
        if(DEBUG) Logger.log("Exception Parsed As : " + Exception);
      }

      if(Exception) {
        if(DEBUG) RyLog("Exception Issued for row: " + Counter2);
        continue;
      }

      if(DEBUG) RyLog(CheckingRow[Counter2] + " != " + Row[Counter2] + " parsed as: " + (CheckingRow[Counter2] != Row[Counter2]));

      if(CheckingRow[Counter2].toString() != Row[Counter2].toString()) Matches = false;

      if(DEBUG) RyLog("============> End Index ");

    }

    if(Matches) MatchesCount++;
  }

  if(DEBUG) RyLog("Matches Found: " + MatchesCount);
  return (MatchesCount);
}

function testDupeCheck() {

  var Sheet = SpreadsheetApp.getActive().getSheetByName("Catering Order-Push Responses");

  var Values = Sheet.getDataRange().getValues();

  Logger.log("Checking For Dupes: ");

  var Result = dupeCheck(Sheet,Values[Values.length-2],10,[1]);

  Logger.log(Result);
}

function testArray() {

  var Test = [1];

  Logger.log(Test[1]);
}