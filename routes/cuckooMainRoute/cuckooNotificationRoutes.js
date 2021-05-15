// Import express for the route
const express = require("express");

// Import the authenticationController
const authenticationController = require(`${__dirname}/../../controller/authenticationController`);

// Import the Firebase authentication controller
const firebaseAuthenticationController = require(`${__dirname}/../../controller/firebaseAuthenticationController`);

// Create new router for the post comment photo
const router = express.Router();

// Import the cuckooNotificationController module
const cuckooNotificationController = require(`${__dirname}/../../controller/cuckooController/cuckooNotificationController`);

// Use this middleware to protect any routes beyond this point
router.use(firebaseAuthenticationController.protect);

// The routes for getting and creating notifications
router
  .route("/")
  .get(cuckooNotificationController.getAllNotifications)
  .post(cuckooNotificationController.createNewNotification);

// The route for getting notifications for the user
router
  .route("/getNotificationsForUser")
  .get(cuckooNotificationController.getNoticationsForUser);

// The route for getting order in collection of latest notification in collection
router
  .route("/getOrderInCollectionOfLatestNotification")
  .get(cuckooNotificationController.getOrderInCollectionOfLatestNotification);

// The route for sending notification
router
  .route("/sendNotification")
  .post(cuckooNotificationController.sendNotification);

// The route for sending notification to user with specified user id
router
  .route("/sendNotificationToUserBasedOnUserId")
  .post(cuckooNotificationController.sendNotificationToUserWithSpecifiedUserId)

// The route for sending data notification to user with specified user id
router
  .route("/sendDataNotificationToUserBasedOnUserId")
  .post(cuckooNotificationController.sendDataNotificationToUserWithSpecifiedUserId)

// The route for getting notification socket of user
router
  .route("/getNotificationSocket")
  .get(cuckooNotificationController.getNotificationSocketOfUser)

// Export the module
module.exports = router;
