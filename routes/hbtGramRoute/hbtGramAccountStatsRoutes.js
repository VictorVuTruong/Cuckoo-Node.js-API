// Import express for the route
const express = require("express");

// Import the authenticationController
const authenticationController = require(`${__dirname}/../../controller/authenticationController`);

// Create new router for the confession post
const router = express.Router();

// Import the HBTGramAccountStatsController module
const hbtGramAccountStatsController = require(`${__dirname}/../../controller/hbtGramController/hbtGramAccountStatsController`);

// Use the protect middleware to protect any routes beyond this point
router.use(authenticationController.protect);

// The route for updating user interaction frequency
router
  .route("/updateUserInteractionFrequency")
  .post(hbtGramAccountStatsController.updateUserInteractionFrequency);

// The route for getting user interaction frequency
router
  .route("/getUserInteractionFrequency")
  .get(hbtGramAccountStatsController.getUserInteractionFrequency);

// The route for getting interaction status of the user
router
  .route("/getUserInteractionStatusForUser")
  .get(hbtGramAccountStatsController.getInteractionStatusForUser);

// The route for updating like status for the user
router
  .route("/updateLikeStatus")
  .post(hbtGramAccountStatsController.updateLikeStatusForUser);

// The route for getting like interaction status for the user
router
  .route("/getUserLikeInteractionStatus")
  .get(hbtGramAccountStatsController.getLikeInteractionStatusOfUser);

// The route for getting comment interaction status for the user
router
  .route("/getUserCommentInteractionStatus")
  .get(hbtGramAccountStatsController.getCommentInteractionStatusOfUser);

// The route for updating comment status for the user
router
  .route("/updateCommentStatus")
  .post(hbtGramAccountStatsController.updateCommentStatusForUser);

// The route for updating profile visit between the 2 users
router
  .route("/updateProfilevisit")
  .post(hbtGramAccountStatsController.updateUserProfileVisit);

// The route for getting profile visit status of the user
router
  .route("/getProfileVisitStatus")
  .get(hbtGramAccountStatsController.getProfileVisitStatusForUser);

// The route for getting brief user stats of the user
router
  .route("/getBriefAccountStats")
  .get(hbtGramAccountStatsController.getBriefAccountStatsForUser);

// Export the router
module.exports = router;
