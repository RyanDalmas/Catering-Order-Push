function GUI_AddOrder(row) {

  const DEBUG = _getConsoleSwitchStatus();

  if (DEBUG) {
    var LogTime = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), "hh:mm a");
    RLog(" * Ran GUI_AddOrder at " + LogTime);
  }

  try {
    var GUI = SpreadsheetApp.getActive().getSheetByName(SHEETNAME_GUISHEET);
  }
  catch (e) {
    throw new Error("Front-End sheet name changed from: " + SHEETNAME_GUISHEET);
  }

  var RowInsertPosition = 4;

  GUI.insertRowBefore(RowInsertPosition);

  var r_GuestName = row[_GuestName];
  var r_OrderType = row[_OrderType];
  var r_OrderDueDate = row[_OrderDueDate];
  var r_OrderDueTime = row[_OrderDueTime];
  var r_CDPresent = row[_CDPresent];
  var r_ItemsOrdered = row[_ItemsOrdered];
  var r_StartTime = row[_StartTime];
  var r_ReceiveType = row[_ReceiveType];
  var r_DeliveryTime = row[_DeliveryTime];
  var r_LeaderResponsible = row[_LeaderResponsible];
  var r_AdditionalInfo = row[_AdditionalInfo];

  if ((new Date(r_OrderDueDate).getMonth() < new Date().getMonth()) || (new Date(r_OrderDueDate).getMonth() == new Date().getMonth() && new Date(r_OrderDueDate).getDay() < new Date().getDay())) {
    var OopsMessage = "I detected an issue with this *new* order. Please check the info below: \n";
    OopsMessage += "> Guest: " + r_GuestName + "\n";
    OopsMessage += "> Due Date: " + Utilities.formatDate(new Date(r_OrderDueDate), Session.getScriptTimeZone(), "MM/dd/yyyy") + "\n";
    OopsMessage += "> Today's Date: " + Utilities.formatDate(new Date(), Session.getScriptTimeZone(), "MM/dd/yyyy") + "\n";
    OopsMessage += "_you may have to resubmit this order_";
    postToSlack(OopsMessage);

    if(DEBUG) RyLog("Order Due Date Issue Detected.");
  }

  var Start = Utilities.formatDate(new Date(r_StartTime), Session.getScriptTimeZone(), "hh:mm a");

  r_ItemsOrdered = r_ItemsOrdered.toString().replace(/,/g, '\n');
  r_ItemsOrdered += "\n" + "Type: " + r_ReceiveType;
  if (r_ReceiveType == "Delivery") r_ItemsOrdered += " (" + r_DeliveryTime + " minutes)";

  if (r_AdditionalInfo != "") r_ItemsOrdered += "\n" + "Ad-Info: " + r_AdditionalInfo;

  GUI.getRange("A" + RowInsertPosition).setValue(r_GuestName); // Order Due Date
  GUI.getRange("B" + RowInsertPosition).setValue(r_OrderDueDate); // Order Due Date
  GUI.getRange("C" + RowInsertPosition).setValue((r_StartTime != "?") ? Start : "?"); // Start Time
  GUI.getRange("D" + RowInsertPosition).setValue(r_OrderDueTime); // Order due time
  GUI.getRange("E" + RowInsertPosition).setValue(r_ItemsOrdered); // Items Ordered
  GUI.getRange("F" + RowInsertPosition).setValue(r_CDPresent); // Catering Director Present
  GUI.getRange("G" + RowInsertPosition).setValue(r_LeaderResponsible); // Catering Director Present

  SortOrdersByDate();

  checkSameDay(r_OrderDueDate, r_OrderDueTime, r_StartTime, r_ItemsOrdered, r_LeaderResponsible);
}
