function onOpen() {
  var ui = SpreadsheetApp.getUi();
  
  ui.createMenu('🐔 Catering System')
  .addSubMenu(ui.createMenu('Catering Front-End (TV)')
              .addItem('Process New Form Orders', 'CATERINGSYSTEM_CheckForOrders')
              .addItem('Remove Old Orders', 'CATERINGSYSTEM_RemoveOldOrders')
              .addSeparator()
              .addItem('Check For Emails', 'CATERINGSYSTEM_CheckForEmails')
              .addSeparator()
              .addItem('Sort Current Orders', 'CATERINGSYSTEM_SortOrders')
              .addItem('Force Daily Slack Check', 'CATERINGSYSTEM_DailySlackCheck'))
  .addToUi();
}