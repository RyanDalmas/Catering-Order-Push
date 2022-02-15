function checkForEmails() {
  const Orders = _getEmailOrders();

  Logger.log("Emails Found: " + Orders.length);

  Orders.forEach(Order => SendOrder(Order));
}

/*
  Data =
    StoreNumber
    Delivery
    GuestName
    GuestCount
    PaperGoods
    Items
    Extras
    Total
  }
  */
function SendOrder(Order) {
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
    Order['DeliveryEstimate'], //Delivery Time
    "?", //Catering Director Present?
    "?", //Leaders Responsible
    Order['PaperGoods'] ? "Paper Goods For " + Order['GuestCount'] + "\n" + Order['Extras'] + "\n" + Order['SpecialInstructions'] : Order['Extras'] + "\n" + Order['SpecialInstructions'] //Additional Info
  ]

  if (Order['IsCanceled']) {
    CancelOrder(BuildArray);
  }
  else {
    var RyBotMessage = "";

    RyBotMessage += "*CFAHome told me about this order, so I added it:*: \n";
    RyBotMessage += "> Guest: " + Order['GuestName'] + "\n"
    RyBotMessage += "> Due-Date: " + Order['DueDate'] + "\n";
    RyBotMessage += "> Due-Time: " + Order['DueTime'] + "\n\n";
    RyBotMessage += "_You may need to review this order._";

    postToSlack(RyBotMessage);

    processResponse(BuildArray);
  }
}

function _getEmailOrders() {
  const EMAIL_THREADS = GmailApp.search('label:Unprocessed label:Catering');

  const LABELS_Unprocessed = GmailApp.getUserLabelByName("Unprocessed");
  const LABELS_Processed = GmailApp.getUserLabelByName("Processed");

  const Messages = [];

  EMAIL_THREADS.forEach(element => element.getMessages().forEach(message => Messages.push(message)));


  var Orders = [];

  Messages.forEach(element => {
    if (element.isUnread()) {
      Logger.log(element.getPlainBody());
      Orders.push(ParseNewOrder(element.getPlainBody()));
      element.markRead();
      element.getThread().removeLabel(LABELS_Unprocessed);
      element.getThread().addLabel(LABELS_Processed);
    }
  });

  return Orders;
}

function _findIncludes(Array, Marker) {
  for (var Counter = 0; Counter < Array.length; Counter++) {
    if (Array[Counter].indexOf(Marker) != -1) return Counter;
  }
  return -1;
}

function _reverse(Input) {
  return Input.split("").reverse().join("");
}

function ParseNewOrder(GMessage) {
  const MessageLines = GMessage.split("\n");

  const Line_StoreNumber = MessageLines[1];

  const DeliveryTimeIndex = _findIncludes(MessageLines, "*Delivery Time*");
  const DeliveryAddressIndex = _findIncludes(MessageLines, "*Delivery Address*");
  const PickupTimeIndex = _findIncludes(MessageLines, "*Pickup Time*");

  const CustomerInfoIndex = _findIncludes(MessageLines, "*Customer Information*");
  const GuestCountIndex = _findIncludes(MessageLines, "*Guest Count:*");
  const PaperGoodsIndex = _findIncludes(MessageLines, "*Paper Goods:*");
  const OrderStartIndex = _findIncludes(MessageLines, "*Item Name*");
  const SpecialInstructionsIndex = _findIncludes(MessageLines, "*Special Instructions*");
  const SubtotalIndex = _findIncludes(MessageLines, "Subtotal");
  const FinalTotalIndex = _findIncludes(MessageLines, "Total");

  const isDelivery = (Line_StoreNumber.indexOf("Pickup") == -1);

  const isCanceledEmail = (Line_StoreNumber.toLowerCase().indexOf("cancel") != -1 || Line_StoreNumber.toLowerCase().indexOf("cancell") != -1);

  var GuestInformation = "";
  for (var Counter = CustomerInfoIndex; Counter < GuestCountIndex; Counter++)
    GuestInformation += MessageLines[Counter] + "\n";

  var SpecialInstructions = "";
  for (var Counter = SpecialInstructionsIndex + 1; Counter < OrderStartIndex; Counter++)
    SpecialInstructions += MessageLines[Counter] + "\n";

  var DeliveryAddress = "";
  for (var Counter = DeliveryAddressIndex + 1; Counter < CustomerInfoIndex; Counter++)
    DeliveryAddress += MessageLines[Counter] + " ";

  DeliveryAddress.replace("\n", "").trim();

  var DueDate;
  var DueTime;

  var PreparedBy;

  var EstimateDriveTime;

  if (isDelivery) {
    const DeliveryTimeArray = MessageLines[DeliveryTimeIndex + 1].split(" ");

    DueDate = DeliveryTimeArray[1];
    DueTime = DeliveryTimeArray[3];
    try {
      EstimateDriveTime = GOOGLEMAPS_DURATION_IN_TRAFFIC("1700 E Colorado Blvd Pasadena CA 91106", DeliveryAddress, "driving", new Date(DeliveryTimeArray.slice(0, DeliveryTimeArray.length - 2))); //_getStoreAddress()
    }
    catch (e) {
      Logger.log("Error finding Route from: \n Store Address: " + "?" + "\n To: " + DeliveryAddress + "\n\n" + e);
      EstimateDriveTime = "Not Available";
    }

    if (EstimateDriveTime == "Not Available" || EstimateDriveTime == null) {
      PreparedBy = "?";
    }
    else {
      PreparedBy = new Date();

      const DueDateArray = DueDate.split("/");
      const DueTimeArray = DueTime.split(":");

      PreparedBy.setMonth(parseInt(DueDateArray[0]) - 1);
      PreparedBy.setDate(parseInt(DueDateArray[1]));
      PreparedBy.setFullYear(parseInt(DueDateArray[2]));

      PreparedBy.setHours(parseInt(DueTimeArray[0]));
      PreparedBy.setMinutes(parseInt(DueTimeArray[1]));

      PreparedBy.setMilliseconds(0);
      PreparedBy.setSeconds(0);

      PreparedBy.setMilliseconds(PreparedBy.getMilliseconds() - ((EstimateDriveTime + _getDeliveryBuffer()) * 60000));
    }
  }
  else {
    const PickupTimeArray = MessageLines[PickupTimeIndex + 1].split(" ");

    DueDate = PickupTimeArray[1];
    DueTime = PickupTimeArray[3];

    PreparedBy = new Date();

    const DueDateArray = DueDate.split("/");
    const DueTimeArray = DueTime.split(":");

    PreparedBy.setMonth(parseInt(DueDateArray[0]) - 1);
    PreparedBy.setDate(parseInt(DueDateArray[1]));
    PreparedBy.setFullYear(parseInt(DueDateArray[2]));

    PreparedBy.setHours(parseInt(DueTimeArray[0]));
    PreparedBy.setMinutes(parseInt(DueTimeArray[1]));

    PreparedBy.setMilliseconds(0);

    PreparedBy.setSeconds(0);
  }

  var Items = [];

  var Extras = [];

  for (var Counter = (OrderStartIndex + 1); Counter < SubtotalIndex; Counter++) {

    const CurrentItem = MessageLines[Counter].trim();

    const asItems = CurrentItem.split(" ");

    // Logger.log(asItems);

    if (CurrentItem.indexOf("Add") != -1) {
      if (asItems[asItems.length - 1].indexOf("$") != -1) {
        Extras.push(asItems[asItems.length - 2] + " " + asItems.slice(1, asItems.length - 2).join(" "));
        // QuantityIndex + Slice(After 'Add',Before QuantityIndex).join()
      }
      else {
        Extras.push(asItems[asItems.length - 1] + " " + asItems.slice(1, asItems.length - 1).join(" "));
        // QuantityIndex + Slice(After 'Add',Before QuantityIndex).join()
      }
    }
    else {
      if (asItems[asItems.length - 1].indexOf("$") != -1) {
        Items.push(asItems[asItems.length - 2] + " " + asItems.slice(0, asItems.length - 2).join(" "));
        // QuantityIndex + Slice(0,Before QuantityIndex).join()
      }
      else {
        Items.push(asItems[asItems.length - 1] + " " + asItems.slice(0, asItems.length - 1).join(" "));
        // QuantityIndex + Slice(0,Before QuantityIndex).join()
      }
    }

  }

  const Data = {
    StoreNumber: Line_StoreNumber.substring(Line_StoreNumber.indexOf("for") + 4, Line_StoreNumber.length - 2),

    IsDelivery: (isDelivery),

    IsCanceled: (isCanceledEmail),

    GuestName: MessageLines[CustomerInfoIndex + 1].indexOf("Chick-fil-A") == -1 ? MessageLines[CustomerInfoIndex + 1] : MessageLines[CustomerInfoIndex + 2].trim(),

    GuestCount: MessageLines[GuestCountIndex].substring(MessageLines[GuestCountIndex].indexOf(":*") + 2).trim(),

    GuestInformation: GuestInformation,

    DueDate: DueDate,

    DueTime: DueTime,

    PreparedBy: PreparedBy,

    DeliveryEstimate: EstimateDriveTime,

    SpecialInstructions: (SpecialInstructionsIndex != -1) ? SpecialInstructions : "",

    PaperGoods: (MessageLines[PaperGoodsIndex] != null ? MessageLines[PaperGoodsIndex].indexOf("Yes") != -1 : "Unknown"),

    Items: Items,

    Extras: Extras,

    Total: MessageLines[FinalTotalIndex].substring(6).trim() //Skipping 'Total'
  }


  Logger.log(Data);
  return Data;
}
