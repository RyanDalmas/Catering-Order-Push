function parseLeaders(__LeaderArray) {
  var LeaderArray = __LeaderArray.replace(/\s/g, "").split(",");

  var LeaderString = "";

  for (var Counter = 0; Counter < LeaderArray.length; Counter++) {
    if (LeaderString != "") LeaderString += ", ";
    try {
      LeaderString += "<@" + RyBot.getUserByName(RyBot.getToken("CFAPasadena"), LeaderArray[Counter], null)['id'] + ">";
    } catch (e) {
      LeaderString += LeaderArray[Counter];
    }
  }

  return LeaderString;
}
