// Import express for the route
const express = require("express");

// Import the authenticationController
const authenticationController = require(`${__dirname}/../../controller/authenticationController`);

// Create new router for the hbt gram friend recommendation
const router = express.Router();

// Import the hbtGramFriendRecommendationController module
const hbtGramFriendRecommendationController = require(`${__dirname}/../../controller/hbtGramController/hbtGramFriendRecommendationController`);

// The route for getting friend recommendation for the user
router
  .route("/getFriendRecommendation")
  .get(hbtGramFriendRecommendationController.getRecommendedUsers);

// Export the module
module.exports = router;
