/*
 var BuildArray = [
      new Date(), //Timestamp
      ANSWER_NewOrder,//OrderType
      Order['GuestName'], //GuestName
      Order['DueDate'], //OrderDueDate
      Order['DueTime'], //OrderDueTime
      "?", //StartTime
      Order['Items'], //ItemsOrdered
      Order['Total'], //FinalOrderCost
      Order['Delivery'] ? "Delivery" : "Pickup", //ReceiveType
      Order['DeliveryEstimate'], , //Delivery Time
      "?", //Catering Director Present?
      "?", //Leaders Responsible
      Order['PaperGoods'] ? "Paper Goods For " + Order['GuestCount'] + "\n" + Order['Extras'] + "\n" + Order['SpecialInstructions'] : Order['Extras'] + "\n" + Order['SpecialInstructions'] //Additional Info
    ]
*/

function CancelOrder(CurrentRow) {
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

  var GUISheet = SpreadsheetApp.getActive().getSheetByName(SHEETNAME_GUISHEET);

  var MarkerLocation = -1;

  for(var Counter = STARTING_ROW; Counter <= GUISheet.getLastRow(); Counter++) {
    if(GUISheet.getRange("A" + Counter).getValue() == GUI_ENDMARKER) {
      MarkerLocation = Counter;
      break;
    }
  }

  if(MarkerLocation == -1) throw new Error("Couldn't find INDEX1 Marker in Column A.");

  var OrderFound = false;
  var OrderIndex = -1;

  for(var Counter = STARTING_ROW; Counter < MarkerLocation; Counter++) {

    if(GUISheet.getRange("A" + Counter).getValue() == r_GuestName && new Date(GUISheet.getRange("B" + Counter).getValue()).getMonth() == new Date(r_OrderDueDate).getMonth() && new Date(GUISheet.getRange("B" + Counter).getValue()).getDate() == new Date(r_OrderDueDate).getDate() && new Date(GUISheet.getRange("B" + Counter).getValue()).getFullYear() == new Date(r_OrderDueDate).getFullYear()) {
      OrderFound = true;
      OrderIndex = Counter;
    }

  }


  var RyBotMessage = "";

  if(OrderFound) {
    GUISheet.deleteRow(OrderIndex);

    RyBotMessage += "*CFAHome told me this order is canceled*, so I removed it from the TV*: \n";
    RyBotMessage += "> Guest: " + r_GuestName + "\n"
    RyBotMessage += "> Due-Date: " + r_OrderDueDate + "\n";
    RyBotMessage += "> Due-Time: " + r_OrderDueTime + "\n\n";
    RyBotMessage += "_no further action is required_";
  }
  else {
    RyBotMessage += "*CFAHome told me this order is canceled, but I couldn't remove it from the TV*: \n";
    RyBotMessage += "> Guest: " + r_GuestName + "\n"
    RyBotMessage += "> Due-Date: " + r_OrderDueDate + "\n";
    RyBotMessage += "> Due-Time: " + r_OrderDueTime + "\n\n";
    RyBotMessage += "_please make sure this order is removed_";
  }

  postToSlack(RyBotMessage);
}