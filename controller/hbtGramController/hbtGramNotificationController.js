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

  // Reference the database to get notifications for the user
  const noticationsForUser = await HBTGramNotificationModel.find({
    forUser: userId,
    orderInCollection: {
      $lt: currentLocationInList,
    },
  })
    .sort({ $natural: -1 })
    .limit(10);

  // Return response to the client
  // also return new current location in list
  response.status(200).json({
    status: "Done",
    data: noticationsForUser,
    newCurrentLocationInList:
      noticationsForUser[noticationsForUser.length - 1].orderInCollection,
  });
});
