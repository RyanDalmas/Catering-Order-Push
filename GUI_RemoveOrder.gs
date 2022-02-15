function GUI_RemoveOrders() {

  const DEBUG = _getConsoleSwitchStatus();

  if (DEBUG) {
    var LogTime = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), "hh:mm a");
    RLog("Ran GUI_RemoveOrders at " + LogTime);
  }

  var LogMessage = "Remove_Orders: \n";

  try {
    var GUI = SpreadsheetApp.getActive().getSheetByName(SHEETNAME_GUISHEET);
  }
  catch (e) {
    throw new Error("Front-End sheet name changed from: " + SHEETNAME_GUISHEET);
  }

  var Index = 4;

  var Index2 = Index + 2;

  const KEYWORD = GUI_ENDMARKER;

  for (var Counter = 1; Counter <= GUI.getLastRow(); Counter++) {
    const KeyWordSearch = GUI.getRange(GUI_SEARCHCOLUMN + "" + Counter);

    if (KeyWordSearch.getValue() == KEYWORD) Index2 = Counter;
  }

  LogMessage += "Index2 Located at: " + Index2 + "\n";


  var Orders = GUI.getRange("B" + Index + ":" + "D" + Index2).getValues();

  var Now = new Date();

  var Count = 0;
  
  const COLOR_RED = _getColor("Red");
  const COLOR_DARKRED = _getColor("Dark Red");

  for (var OrderCounter = 0; OrderCounter < (Index2 - Index) && OrderCounter <= GUI.getLastRow(); OrderCounter++) {
    if (DEBUG) {
      RLog("Row: " + (OrderCounter + Index));
    RLog("DueDate: " + GUI.getRange("B" + (OrderCounter + Index)).getBackground() + "|" + _getColor("Red"));
    RLog("Due At: " + GUI.getRange("D" + (OrderCounter + Index)).getBackground() + "|" + _getColor("Dark Red"));
  }
    
    if ((GUI.getRange("B" + (OrderCounter + Index)).getBackground() == COLOR_RED || GUI.getRange("B" + (OrderCounter + Index)).getBackground() == COLOR_DARKRED)
      && GUI.getRange("D" + (OrderCounter + Index)).getBackground() == COLOR_DARKRED) {

      GUI.deleteRow(OrderCounter + Index);
      OrderCounter--;
      Count++;
    }
  }

  LogMessage += "OrdersRemoved: " + Count;

  if(DEBUG) RLog(LogMessage);

}

