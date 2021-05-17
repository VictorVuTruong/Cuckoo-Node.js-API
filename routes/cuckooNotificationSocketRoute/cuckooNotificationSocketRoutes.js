// Import express for the route
const express = require("express");

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

// The route for updating notification socket
router
    .route("/updateNotificationSocket")
    .patch(notificationSocketController.updateNotificationSocket)

// The route for checking and creating notification socket
router
    .route("/checkAndCreateNotificationSocket")
    .post(notificationSocketController.checkAndCreateNotificationSocket)

// Export the module
module.exports = router;