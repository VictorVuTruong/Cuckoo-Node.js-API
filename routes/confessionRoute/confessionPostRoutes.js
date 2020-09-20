// Import express for the route
const express = require("express");

// Import the authenticationController
const authenticationController = require(`${__dirname}/../../controller/authenticationController`);

// Create new router for the confession post
const router = express.Router();

// Import the confessionPostController module
const confessionPostController = require(`${__dirname}/../../controller/confessionController/confessionPostController`);

// Use the protect middleware to protect any routes beyond this point
router.use(authenticationController.protect);

// The route for getting all confession posts and creating new confession post
router
  .route("/")
  .get(confessionPostController.getAllConfessionPosts)
  .post(confessionPostController.createNewConfessionPost);

// Export the router
module.exports = router;
