var DynamicColumn = 0;

var _TimeStamp = DynamicColumn++;
var _OrderType = DynamicColumn++;
var _GuestName = DynamicColumn++;
var _OrderDueDate = DynamicColumn++;
var _OrderDueTime = DynamicColumn++;
var _StartTime = DynamicColumn++;
var _ItemsOrdered = DynamicColumn++;
var _FinalOrderCost = DynamicColumn++;
var _ReceiveType = DynamicColumn++;
var _DeliveryTime = DynamicColumn++;
var _CDPresent = DynamicColumn++;
var _LeaderResponsible = DynamicColumn++;
var _AdditionalInfo = DynamicColumn++;

var _OO_GuestName = DynamicColumn++;
var _OO_OrderDueDate = DynamicColumn++;
var _OO_ItemsOrdered = DynamicColumn++;
var _OO_FinalOrderCost = DynamicColumn++;
var _OO_ReceiveType = DynamicColumn++;
var _OO_LeadersResponsible = DynamicColumn++;
var _OO_AdditionalInfo = DynamicColumn++;

var ProcessIndicator = _OO_AdditionalInfo + 2;
var ProcessorChar = 'V';

function processResponse(CurrentRow, i = null, NumberOfResponsesProcessed) {
  var r_TimeStamp = CurrentRow[_TimeStamp];
  var r_OrderType = CurrentRow[_OrderType];
  var r_GuestName = CurrentRow[_GuestName];
  var r_OrderDueDate = CurrentRow[_OrderDueDate];
  var r_OrderDueTime = CurrentRow[_OrderDueTime];
  var r_StartTime = CurrentRow[_StartTime];
  var r_ItemsOrdered = CurrentRow[_ItemsOrdered];
  var r_FinalOrderCost = CurrentRow[_FinalOrderCost];
  var r_ReceiveType = CurrentRow[_ReceiveType];
  var r_DeliveryTime = CurrentRow[_DeliveryTime];
  var r_CDPresent = CurrentRow[_CDPresent];
  var r_LeaderResponsible = CurrentRow[_LeaderResponsible];
  var r_AdditionalInfo = CurrentRow[_AdditionalInfo];

  var MasterS = SpreadsheetApp.getActive().getSheetByName(SHEETNAME_MASTERSHEET);

  var RowInsertPosition = 4;

  SpreadsheetApp.flush();

  MasterS.insertRowBefore(RowInsertPosition);

  if (r_DeliveryTime == "") r_DeliveryTime = "N/A";

  var Start = Utilities.formatDate(new Date(r_StartTime), Session.getScriptTimeZone(), "hh:mm a");

  MasterS.getRange("A" + RowInsertPosition).setValue("TRUE"); // Guest Name
  MasterS.getRange("B" + RowInsertPosition).setValue("");

  if (r_OrderType == ANSWER_NewOrder) {
    MasterS.getRange("C" + RowInsertPosition).setValue(r_GuestName); // Guest Name
    MasterS.getRange("D" + RowInsertPosition).setValue(r_OrderDueDate); // Order Due Date
    MasterS.getRange("E" + RowInsertPosition).setValue(r_OrderDueTime); // Order Due Time
    MasterS.getRange("F" + RowInsertPosition).setValue((r_StartTime != "?") ? Start : "?"); // Order Due Time
    MasterS.getRange("G" + RowInsertPosition).setValue(r_ItemsOrdered); // Items Ordered
    MasterS.getRange("H" + RowInsertPosition).setValue(r_FinalOrderCost); // Final Order Cost
    MasterS.getRange("I" + RowInsertPosition).setValue(r_ReceiveType); // Order Type
    MasterS.getRange("J" + RowInsertPosition).setValue(r_CDPresent); // Catering Director Present
    MasterS.getRange("K" + RowInsertPosition).setValue(r_LeaderResponsible); // Leaders Responsible
    MasterS.getRange("L" + RowInsertPosition).setValue(r_AdditionalInfo); // Additional Order Info
  }
  else if (r_OrderType == ANSWER_OldOrder) {
    var r__OO_GuestName = CurrentRow[_OO_GuestName];
    var r__OO_OrderDueDate = CurrentRow[_OO_OrderDueDate];
    var r__OO_ItemsOrdered = CurrentRow[_OO_ItemsOrdered];
    var r__OO_FinalOrderCost = CurrentRow[_OO_FinalOrderCost];
    var r__OO_ReceiveType = CurrentRow[_OO_ReceiveType];
    var r__OO_LeadersResponsible = CurrentRow[_OO_LeadersResponsible];
    var r__OO_AdditionalInfo = CurrentRow[_OO_AdditionalInfo];

    MasterS.getRange("C" + RowInsertPosition).setValue(r__OO_GuestName); // Guest Name
    MasterS.getRange("D" + RowInsertPosition).setValue(r__OO_OrderDueDate); // Order Due Date
    MasterS.getRange("G" + RowInsertPosition).setValue(r__OO_ItemsOrdered); // Items Ordered
    MasterS.getRange("H" + RowInsertPosition).setValue(r__OO_FinalOrderCost); // Final Order Cost
    MasterS.getRange("I" + RowInsertPosition).setValue(r__OO_ReceiveType); // Order Type
    MasterS.getRange("K" + RowInsertPosition).setValue(r__OO_LeadersResponsible); // Leaders Responsible
    MasterS.getRange("L" + RowInsertPosition).setValue(r__OO_AdditionalInfo); // Additional Order Info
  }

  if (r_OrderType == ANSWER_NewOrder) GUI_AddOrder(CurrentRow);

  if(i != null) finishProcessing_(CurrentRow, i);
}

function checkIfProcessed_(row) {
  if (row[ProcessIndicator] == 'Yes') {
    return true;
  }
  return false;
}

function finishProcessing_(row, e) {
  try {
    SpreadsheetApp.getActive().getSheetByName(SHEETNAME_GOOGLEFORMSHEET).getRange(ProcessorChar + (1 + e)).setValue('Yes');
  } catch (e) { throw new Error("Error: Response sheet name was changed. Please contact Ryan. Please don't change the sheet names."); }
}
