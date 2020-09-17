// Import express for the route
const express = require("express");

// Import the authenticationController
const authenticationControllers = require(`${__dirname}/../../controller/authenticationController`);

// Create new router for the class group chat
const router = express.Router();

// Import the classGroupChatController module
const classGroupChatController = require(`${__dirname}/../../controller/classController/classGroupChatController`);

// With this middleware being used. All routes that come after this point will be protected
router.use(authenticationControllers.protect);

// The route for getting all class group chat messages and creating new class group chat message
router
  .route("/")
  .get(classGroupChatController.getAllClassGroupChatMessages)
  .post(classGroupChatController.createNewClassGroupChatMessage);

// Export the app in order to be able to be used by the app
module.exports = router;
