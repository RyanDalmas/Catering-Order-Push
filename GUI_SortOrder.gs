function SortOrdersByDate() {

  try {
    var GUI = SpreadsheetApp.getActive().getSheetByName(SHEETNAME_GUISHEET);
  } 
  catch (e) { 
    throw new Error("Front-End sheet name changed from: " + SHEETNAME_GUISHEET);
     }

  var Index = 4;

  var Index2 = 6;

  const KEYWORD = GUI_ENDMARKER;

  for (var Counter = 1; Counter <= GUI.getLastRow(); Counter++) {
    const KeyWordSearch = GUI.getRange(GUI_SEARCHCOLUMN + "" + Counter);

    if (KeyWordSearch.getValue() == KEYWORD) Index2 = Counter;
  }

  GUI.getRange("A" + Index + ":" + "G" + Index2).sort([{ column: 2, ascending: true }, { column: 4, ascending: true }]);
}
