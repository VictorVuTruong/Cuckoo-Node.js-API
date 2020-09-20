// Import express for the route
const express = require("express");

// Import the authenticationController
const authenticationController = require(`${__dirname}/../../controller/authenticationController`);

// Create new router for the confession post like
const router = express.Router();

// Import the confessionPostLikeController module
const confessionPostLikeController = require(`${__dirname}/../../controller/confessionController/confessionPostLikeController`);

// Use this middleware to protect any routes beyond this
router.use(authenticationController.protect);

// The route for getting all confession post likes and creating the new one
router
  .route("/")
  .get(confessionPostLikeController.getAllConfessionPostLikes)
  .post(confessionPostLikeController.createNewConfessionPostLike);

// Export the module
module.exports = router;
