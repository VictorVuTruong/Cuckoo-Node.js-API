const { request, response } = require("express");

// Import the HBTGramNotificationModel
const HBTGramNotificationModel = require(`${__dirname}/../../model/hbtGramModel/hbtGramNotificationModel`);

// Import the handler factory
const factory = require(`${__dirname}/../handlerFactory`);

// Import the catchAsync
const catchAsync = require(`${__dirname}/../../utils/catchAsync`);

// The function to get all notications
exports.getAllNotifications = factory.getAllDocuments(HBTGramNotificationModel);

// The functionn to create new notification
exports.createNewNotification = factory.createDocument(
  HBTGramNotificationModel
);

// The function to get notications for user
exports.getNoticationsForUser = catchAsync(async (request, response, next) => {
  // Get user id of the user to get notications for
  const userId = request.query.userId;

  // Get current location in list od the user
  const currentLocationInList = request.query.currentLocationInList;

  // If current location in list is 0, don't do anything, just return a response with an empty array
  if (currentLocationInList == 0) {
    response.status(200).json({
      status: "Done",
      data: [],
      newCurrentLocationInList: 0,
    });

    // Get out of the function
    return;
  }

  // Reference the database to get notifications for the user
  const noticationsForUser = await HBTGramNotificationModel.find({
    forUser: userId,
    orderInCollection: {
      $lte: currentLocationInList,
    },
  })
    .sort({ $natural: -1 })
    .limit(10);

  var newOrderInCollection = 0;
  // If there is only one notification in the array, let 0 be new order in collection
  if (noticationsForUser.length != 1) {
    // Get order in collection for the next load (new order in collection)
    newOrderInCollection =
      noticationsForUser[noticationsForUser.length - 1].orderInCollection;
  } else {
    newOrderInCollection = 0;
  }

  // If there is only 1 element in the array, don't pop it
  if (noticationsForUser.length != 1) {
    // Pop last element out of the array
    noticationsForUser.pop();
  }

  // Return response to the client
  // also return new current location in list
  response.status(200).json({
    status: "Done",
    data: noticationsForUser,
    newCurrentLocationInList: newOrderInCollection,
  });
});

// The function to get order in collection of latest notification in collection
exports.getOrderInCollectionOfLatestNotification = catchAsync(
  async (request, response, next) => {
    // Reference the database to get latest notification
    const latestNotification = await HBTGramNotificationModel.find()
      .sort({ $natural: -1 })
      .limit(1);

    // Return response to the client
    response.status(200).json({
      status: "Done",
      data: latestNotification[0].orderInCollection,
    });
  }
);
