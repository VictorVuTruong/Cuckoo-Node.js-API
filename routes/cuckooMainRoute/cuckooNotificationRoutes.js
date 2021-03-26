// Import express for the route
const express = require("express");

// Import the authenticationController
const authenticationController = require(`${__dirname}/../../controller/authenticationController`);

// Create new router for the post comment photo
const router = express.Router();

// Import the cuckooNotificationController module
const cuckooNotificationController = require(`${__dirname}/../../controller/cuckooController/cuckooNotificationController`);

// Use this middleware to protect any routes beyond this point
router.use(authenticationController.protect);

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

// Export the module
module.exports = router;
