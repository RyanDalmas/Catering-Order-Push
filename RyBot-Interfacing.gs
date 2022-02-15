function postToSlack(SlackMessage, Blocks) {
  
  const Response = JSON.stringify(RyBot.postToSlack(_getSlackBotToken(), _getSlackCateringChannel(), SlackMessage, null, Blocks));
  
  if(!Response['ok']) {
    if(true ||_getConsoleSwitchStatus()) {
      RyLog("Error with Request: " + Response['error'] + "\n\n" + SlackMessage); 
    }
  }
  
}
