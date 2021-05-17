// Import express for the route
const express = require("express");

// Create new router for the friend recommendation
const router = express.Router();

// Import the cuckooFriendRecommendationController module
const cuckooFriendRecommendationController = require(`${__dirname}/../../controller/cuckooController/cuckooFriendRecommendationController`);

// The route for getting friend recommendation for the user
router
  .route("/getFriendRecommendation")
  .get(cuckooFriendRecommendationController.getRecommendedUsers);

// Export the module
module.exports = router;
