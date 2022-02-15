const SAME_DAY_BLOCK = {
	"blocks": [
		{
			"type": "section",
			"text": {
				"type": "mrkdwn",
				"text": "*New Same-Day Catering Order:* " //<!channel> 
			}
		},
		{
			"type": "section",
			"fields": [
				{
					"type": "mrkdwn",
					"text": "*Order:*\n"
				},
				{
					"type": "mrkdwn",
					"text": "*Start At:* [TIME1]\n*Due At:* [TIME2]\n \n *Accountable:* [LEADER]"
				}
			]
		}
	]
};

function test() {
  checkSameDay("12/3/2021", "12:00AM", "12:59AM", "1 Large Nugget Tray\n1 Medium Strip Tray\n1 Gallon Lemonade", "Ryan Dalmas, This is a test");
}

function checkSameDay(r_OrderDueDate, r_OrderDueTime, r_StartTime, r_ItemsOrdered, r_LeaderResponsible) {
  var TodayDate = new Date();

  var Today = Utilities.formatDate(TodayDate, Session.getScriptTimeZone(), "MM/dd/yyyy");

  var OrderDate = new Date(r_OrderDueDate);

  if (OrderDate.getMonth() == TodayDate.getMonth() && OrderDate.getDay() == TodayDate.getDay() && OrderDate.getFullYear() == TodayDate.getFullYear()) {
    var SlackMessage = "<!channel> *New Same-Day Catering Order:* " + Today + ":" + "\n\n";

    var DueAt = Utilities.formatDate(new Date(r_OrderDueTime), Session.getScriptTimeZone(), "hh:mm a");
    var StartTime = Utilities.formatDate(new Date(r_StartTime), Session.getScriptTimeZone(), "hh:mm a");

    var BlockQ = ">";
    var Bold = "*";
    var NewLine = "\n";

    var OrderInfo = r_ItemsOrdered.replace(/\n/g, "\n" + BlockQ); //regex replaceAll

    var LeaderString = parseLeaders(r_LeaderResponsible);

    SlackMessage += "_Catering_ _Order_" + ":\n";
    //SlackMessage += "Guest-Name: " + Orders[Counter][0] + "\n";
    //SlackMessage += "Order: " + "\n";
    SlackMessage += BlockQ + OrderInfo + "\n";
    SlackMessage += Bold + "Prepared-By:" + Bold + " " + DueAt + " (Start-At: " + StartTime + ")" + "\n";
    SlackMessage += (r_LeaderResponsible != "") ? "Accountable: " + LeaderString : "";

    SlackMessage += "\n\n";

    SlackMessage += "Have a good day!";

    var TempBlocks = SAME_DAY_BLOCK;

    TempBlocks['blocks'][0]['text']['text'] += Today;
     TempBlocks['blocks'][1]['fields'][0]['text'] += OrderInfo;
    TempBlocks['blocks'][1]['fields'][1]['text'].replace("[TIME1]",StartTime).replace("[TIME2]",DueAt).replace("[LEADER]",LeaderString);

    postToSlack(SlackMessage,TempBlocks);
  }
}

