// Import express for the route
const express = require("express");

// Import the authenticationController
const authenticationController = require(`${__dirname}/../../controller/authenticationController`);

// Import the video chat controller
const cuckooVideoChatController = require(`${__dirname}/../../controller/cuckooController/cuckooVideoChatController`);

// Create router for the video chat
const router = express.Router();

// Use the protect middleware to protect any routes beyond this point
router.use(authenticationController.protect);

// The route for getting access token to get into chat room
router
  .route("/getAccessToken")
  .get(cuckooVideoChatController.grantVideoChatAccess);

// The route for creating new chat room
router.route("/createRoom").post(cuckooVideoChatController.createRoom);

// The route for ending a chat room
router.route("/endRoom").delete(cuckooVideoChatController.completeRoom);

// Export the module
module.exports = router;
