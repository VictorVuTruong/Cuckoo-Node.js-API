// Import express for the route
const express = require("express");

// Import the authenticationController
const authenticationController = require(`${__dirname}/../../controller/authenticationController`);

// Create new router for the hbt gram post comment photo
const router = express.Router();

// Import the hbtGramNotificationController module
const hbtGramNotificationController = require(`${__dirname}/../../controller/hbtGramController/hbtGramNotificationController`);

// Use this middleware to protect any routes beyond this point
router.use(authenticationController.protect);

// The routes for getting and creating notifications
router
  .route("/")
  .get(hbtGramNotificationController.getAllNotifications)
  .post(hbtGramNotificationController.createNewNotification);

// The route for getting notifications for the user
router
  .route("/getNotificationsForUser")
  .get(hbtGramNotificationController.getNoticationsForUser);

// Export the module
module.exports = router;
