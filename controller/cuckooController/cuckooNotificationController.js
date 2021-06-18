const { request, response } = require("express");

// Firebase admin SDK
var admin = require("firebase-admin");

// Import the cuckooNotificationModel
const cuckooNotificationModel = require(`${__dirname}/../../model/cuckooModel/cuckooNotificationModel`);

// Import the notification socket model
const notificationSocketModel = require(`${__dirname}/../../model/notificationSocketModel/notificationSocketModel`);

// Import the user model
const userModel = require(`${__dirname}/../../model/userModel/userModel`)

// Import the handler factory
const factory = require(`${__dirname}/../handlerFactory`);

// Import the catchAsync
const catchAsync = require(`${__dirname}/../../utils/catchAsync`);

// The function to get all notications
exports.getAllNotifications = factory.getAllDocuments(cuckooNotificationModel);

// The functionn to create new notification
exports.createNewNotification = factory.createDocument(cuckooNotificationModel);

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
  const noticationsForUser = await cuckooNotificationModel
    .find({
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
    const latestNotification = await cuckooNotificationModel
      .find()
      .sort({ $natural: -1 })
      .limit(1);

    // Return response to the client
    response.status(200).json({
      status: "Done",
      data: latestNotification[0].orderInCollection,
    });
  }
);

// The function to delete notifications belong to the post
exports.deleteNotificationOfPost = catchAsync(async (postId) => {
  // Delete notifications of post
  await cuckooNotificationModel.deleteMany({
    postId: postId,
  });
});

// The function to send notification
exports.sendNotification = catchAsync(async (request, response, next) => {
  const messageToken = request.query.messageToken;

  // Create the notification
  var message = {
    notification: {
      title: "title",
      body: "body",
    },
    token: messageToken,
  };

  // Send the notification
  admin
    .messaging()
    .send(message)
    .then((responseInner) => {
      console.log("Message sent", responseInner);
    })
    .catch((error) => {
      console.log("Something went wrong", error);
    });
});

// The function to get notification socket of user with specified user id
exports.getNotificationSocketOfUser = catchAsync(async (request, response, next) => {
  // Get user id of the user
  const userId = request.query.userId

  // Reference the database to get notification socket of user with specified user id
  const notificationSockets = await notificationSocketModel.find({
    user: userId
  })

  // Return array of notification sockets of user with specified user id
  response.status(200).json({
    notificationSockets: notificationSockets
  })
})

// The function to send notification to user with specified user id
exports.sendNotificationToUserWithSpecifiedUserId = catchAsync(async (request, response, next) => {
  // User id of the user
  let userId

  // Notification content
  let notificationContent

  // Notification title
  let notificationTitle

  // User id of the notification sender
  let notificationSender

  // Check and see if request.query is null or not
  // it it is not, get info from the request.query
  if (request.query.userId != undefined) {

    // Get user id of the user
    userId = request.query.userId

    // Get notification content
    notificationContent = request.query.notificationContent

    // Get notification title
    notificationTitle = request.query.notificationTitle

    // Get notification sender
    notificationSender = request.query.notificationSender
  } // Otherwise, get it from the request.body
  else {
    // Get user id of the user
    userId = request.body.userId

    // Get notification content
    notificationContent = request.body.notificationContent

    // Get notification title
    notificationTitle = request.body.notificationTitle

    // Get notification sender
    notificationSender = request.body.notificationSender
  }

  // Reference the database to get notification socket of user with specified user id
  const notificationSockets = await notificationSocketModel.find({
    user: userId
  })
  
  // Loop through list of notification sockets to extract their notification socket id
  // and send notification
  for (i = 0; i < notificationSockets.length; i++) {
    // Get notification socket id
    const notificationSocketId = notificationSockets[i].socketId

    // The notification object to be sent
    let message

    // If title of the notification is message, let the receiver know that there is new message
    if (notificationTitle == "message") {      
      // Reference the database to get info of sender
      const messageSenderUserObject = await userModel.findOne({
        _id: notificationSender
      })

      // Create the notification
      message = {
        notification: {
          title: `${messageSenderUserObject.fullName} sent you a message`,
          body: notificationContent,
        },
        token: notificationSocketId,
      };
    } else if (notificationTitle == "like") {
      // Reference the database to get info of the sender
      const likeSenderUserObject = await userModel.findOne({
        _id: notificationSender
      })
      
      // Create the notification
      message = {
        notification: {
          title: `${likeSenderUserObject.fullName} liked your post`,
          body: notificationContent,
        },
        token: notificationSocketId,
      };
    } else if (notificationTitle == "comment") {
      // Reference the database to get info of the sender
      const commentSenderUserObject = await userModel.findOne({
        _id: notificationSender
      })

      // Create the notification
      message = {
        notification: {
          title: `${commentSenderUserObject.fullName} commented on your post`,
          body: notificationContent
        },
        token: notificationSocketId
      }
    } else {
      // Create the notification
      message = {
        notification: {
          title: notificationTitle,
          body: notificationContent
        },
        token: notificationSocketId
      }
    }

    // Send the notification
    admin
      .messaging()
      .send(message)
      .then((responseInner) => {
        console.log("Message sent", responseInner);
      })
      .catch((error) => {
        console.log("Something went wrong", error);

        response.status(500).json({
          status: "STFU"
        })
      });
  }

  response.status(200).json({
    status: "Done"
  })
})

// The function to send data notification to user with specified user id
exports.sendDataNotificationToUserWithSpecifiedUserId = catchAsync(async (request, response, next) => {
  // Get user id of the user
  const userId = request.query.userId

  // Get notification content
  const notificationContent = request.query.notificationContent

  // Get notification title
  const notificationTitle = request.query.notificationTitle

  // Reference the database to get notification socket of user with specified user id
  const notificationSockets = await notificationSocketModel.find({
    user: userId
  })

  // Loop through list of notification sockets to extract their notification socket id
  // and send notification
  notificationSockets.forEach(notificationSocket => {
    // Get notification socket id
    const notificationSocketId = notificationSocket.socketId

    // Create the notification
    var message = {
      data: {
        title: notificationTitle,
        body: notificationContent,
      },
      token: notificationSocketId,
    };

    // Send the notification
    admin
      .messaging()
      .send(message)
      .then((responseInner) => {
        console.log("Message sent", responseInner);
      })
      .catch((error) => {
        console.log("Something went wrong", error);

        response.status(500).json({
          status: "STFU"
        })
      });
  })

  response.status(200).json({
    status: "Done"
  })
})