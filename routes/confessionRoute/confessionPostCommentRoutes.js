// Import express for the route
const express = require("express");

// Import the authenticationController
const authenticationController = require(`${__dirname}/../../controller/authenticationController`);

// Create new router for the confession post comment
const router = express.Router();

// Import the confessionPostCommentController module
const confessionPostCommentController = require(`${__dirname}/../../controller/confessionController/confessionPostCommentController`);

// Use this middleware to protect any routes beyond this point
router.use(authenticationController.protect);

// The router for getting all confession post comments and creating the new one
router
  .route("/")
  .get(confessionPostCommentController.getAllConfessionPostComments)
  .post(confessionPostCommentController.createNewConfessionPostComment);

// Export the router
module.exports = router;
