// Import express for the route
const express = require("express");

// Import the Firebase authentication controller
const firebaseAuthenticationController = require(`${__dirname}/../../controller/firebaseAuthenticationController`);

// Create new router for the confession post
const router = express.Router();

// Import the messageController module
const messageController = require(`${__dirname}/../../controller/messageController/messageController`);

// Use the protect middleware to protect any routes beyond this point
router.use(firebaseAuthenticationController.protect);

// The route for getting all messages and creating the new one
// When creating new message, need to check to see if is there any message room between the 2 users or not
router
  .route("/")
  .get(messageController.getAllMessages)
  .post(messageController.checkMessageRoom, messageController.createNewMessage);

// The route for getting all messages but based on the or query this time
router
  .route("/queryWithOrCondition")
  .get(messageController.getAllMessagesOrCondition);

// The route for getting latest message of the specified message room
router
  .route("/getLatestMessageOfMessageRoom")
  .get(messageController.getLatestMessageOfMessageRoom);

// Export the router
module.exports = router;
