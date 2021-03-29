// Import express for the route
const express = require("express");

// Import the authenticationController
const authenticationController = require(`${__dirname}/../../controller/authenticationController`);

// Create new router for the post photo
const router = express.Router();

// Import the notificationSocketController module
const notificationSocketController = require(`${__dirname}/../../controller/cuckooNotificationSocketController/cuckooNotificationSocketController`);

// The route for getting and creating notification socket
router
    .route("/")
    .get(notificationSocketController.getAllNotificationSocket)
    .post(notificationSocketController.createNewNotificationSocket)

// The route for deleting notification socket
router
    .route("/deleteNotificationSocket")
    .delete(notificationSocketController.deleteNotificationSocket)

// Export the module
module.exports = router;