function _getColor(InputString) {

  const ConfigSheet = SpreadsheetApp.getActive().getSheetByName(SHEETNAME_CONFIG);

  const KEYWORD = InputString;

  for(var Counter = 1; Counter <= ConfigSheet.getLastRow(); Counter++) {
    const KeyWordSearch = ConfigSheet.getRange(ConfigSearchColumn + "" + Counter);

    if(KeyWordSearch.getValue() == KEYWORD) return KeyWordSearch.offset(0,1).getBackground();
  }

  throw new Error(KEYWORD + " not found.");
}

function _getConsoleSwitchStatus() {
  const ConfigSheet = SpreadsheetApp.getActive().getSheetByName(SHEETNAME_CONFIG);

  const KEYWORD = ConsoleMarker;

  for(var Counter = 1; Counter <= ConfigSheet.getLastRow(); Counter++) {
    const KeyWordSearch = ConfigSheet.getRange(ConfigSearchColumn + "" + Counter);

    if(KeyWordSearch.getValue() == KEYWORD) return (KeyWordSearch.offset(0,1).getValue() == true);
  }

  throw new Error(KEYWORD + " not found.");
}

function _getSlackBotToken() {
  const ConfigSheet = SpreadsheetApp.getActive().getSheetByName(SHEETNAME_CONFIG);

  const KEYWORD = SlackBotTokenMarker;

  for(var Counter = 1; Counter <= ConfigSheet.getLastRow(); Counter++) {
    const KeyWordSearch = ConfigSheet.getRange(ConfigSearchColumn + "" + Counter);

    if(KeyWordSearch.getValue() == KEYWORD) return KeyWordSearch.offset(0,1).getValue();
  }

  throw new Error(KEYWORD + " not found.");
}

function _getSlackCateringChannel() {
  const ConfigSheet = SpreadsheetApp.getActive().getSheetByName(SHEETNAME_CONFIG);

  const KEYWORD = SlackCateringChannelMarker;

  for(var Counter = 1; Counter <= ConfigSheet.getLastRow(); Counter++) {
    const KeyWordSearch = ConfigSheet.getRange(ConfigSearchColumn + "" + Counter);

    if(KeyWordSearch.getValue() == KEYWORD) return KeyWordSearch.offset(0,1).getValue();
  }

  throw new Error(KEYWORD + " not found.");
}

function _getStoreAddress() {
  const ConfigSheet = SpreadsheetApp.getActive().getSheetByName(SHEETNAME_CONFIG);

  const KEYWORD = StoreAddressMarker;

  for(var Counter = 1; Counter <= ConfigSheet.getLastRow(); Counter++) {
    const KeyWordSearch = ConfigSheet.getRange(ConfigSearchColumn + "" + Counter);

    if(KeyWordSearch.getValue() == KEYWORD) return KeyWordSearch.offset(0,1).getValue();
  }

  throw new Error(KEYWORD + " not found.");
}

function _getSundayMessage() {
  const ConfigSheet = SpreadsheetApp.getActive().getSheetByName(SHEETNAME_CONFIG);

  const KEYWORD = SundayMessageMarker;

  for(var Counter = 1; Counter <= ConfigSheet.getLastRow(); Counter++) {
    const KeyWordSearch = ConfigSheet.getRange(ConfigSearchColumn + "" + Counter);

    if(KeyWordSearch.getValue() == KEYWORD) return KeyWordSearch.offset(0,1).getValue();
  }

  throw new Error(KEYWORD + " not found.");
}

function _getDeliveryBuffer() {
  const ConfigSheet = SpreadsheetApp.getActive().getSheetByName(SHEETNAME_CONFIG);

  const KEYWORD = DeliveryBufferMarker;

  for(var Counter = 1; Counter <= ConfigSheet.getLastRow(); Counter++) {
    const KeyWordSearch = ConfigSheet.getRange(ConfigSearchColumn + "" + Counter);

    if(KeyWordSearch.getValue() == KEYWORD) return KeyWordSearch.offset(0,1).getValue();
  }

  throw new Error(KEYWORD + " not found.");
}


