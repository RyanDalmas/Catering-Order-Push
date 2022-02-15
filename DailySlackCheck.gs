function dailySlackCheck() {

  try {
    var GUI = SpreadsheetApp.getActive().getSheetByName(SHEETNAME_GUISHEET);
  }
  catch (e) {
    throw new Error("Front-End sheet name changed from: " + SHEETNAME_GUISHEET);
  }

  var Index = 4;

  var Index2 = 6;

  const KEYWORD = GUI_ENDMARKER;

  for(var Counter = 1; Counter <= GUI.getLastRow(); Counter++) {
    const KeyWordSearch = GUI.getRange(GUI_SEARCHCOLUMN + "" + Counter);

    if(KeyWordSearch.getValue() == KEYWORD) Index2 = Counter;
  }

  var Orders = GUI.getRange("B" + Index + ":" + "H" + Index2).getValues();

  var TodayDate = new Date();

  var Today_Formatted = Utilities.formatDate(TodayDate, Session.getScriptTimeZone(), "MM/dd/yyyy");

  var SlackMessage = "<!channel> *Good Morning!* Here are your existing catering orders for " + Today_Formatted + ":" + "\n\n";

  var OrderFound = false;
  var OrderCount = 1;

  for (var Counter = 0; Counter < Orders.length; Counter++) {
    var OrderDate = new Date(Orders[Counter][1]);

    if (OrderDate.getMonth() == TodayDate.getMonth() && OrderDate.getDate() == TodayDate.getDate() && OrderDate.getFullYear() == TodayDate.getFullYear()) {
      OrderFound = true;

      var StartTime = Utilities.formatDate(Orders[Counter][2], Session.getScriptTimeZone(), "hh:mm a");
      var DueAt = Utilities.formatDate(Orders[Counter][3], Session.getScriptTimeZone(), "hh:mm a");

      var BlockQ = ">";
      var Bold = "*";
      var NewLine = "\n";

      var OrderInfo = Orders[Counter][4].replace(/\n/g, "\n" + BlockQ); //regex replaceAll

      var LeaderString = parseLeaders(Orders[Counter][6]);

      SlackMessage += "_Catering_ _Order_ #" + OrderCount++ + ":\n";
      //SlackMessage += "Guest-Name: " + Orders[Counter][0] + "\n";
      //SlackMessage += "Order: " + "\n";
      SlackMessage += BlockQ + OrderInfo + "\n";
      SlackMessage += Bold + "Prepared-By:" + Bold + " " + DueAt + " (Start-At: " + StartTime + ")" + "\n";
      SlackMessage += (Orders[Counter][6] != "") ? "Accountable: " + LeaderString : "";

      SlackMessage += "\n\n";
    }
  }

  SlackMessage += "These are all the orders currently on the catering TV. Have a good day!";

  if (TodayDate.getDay() == 0) SlackMessage = _getSundayMessage();
  else if (!OrderFound) {
    SlackMessage = "*Good Morning!* I could not find any existing catering orders for " + Today_Formatted + ".\n Have a good day!";
  }

  postToSlack(SlackMessage);
}
