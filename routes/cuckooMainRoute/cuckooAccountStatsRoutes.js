// Import express for the route
const express = require("express");

// Import the authenticationController
const authenticationController = require(`${__dirname}/../../controller/authenticationController`);

// Import the Firebase authentication controller
const firebaseAuthenticationController = require(`${__dirname}/../../controller/firebaseAuthenticationController`);

// Create new router for the confession post
const router = express.Router();

// Import the CuckooAccountStatsController module
const cuckooAccountStatsController = require(`${__dirname}/../../controller/cuckooController/cuckooAccountStatsController`);

// Use the protect middleware to protect any routes beyond this point
router.use(firebaseAuthenticationController.protect);

// The route for updating user interaction frequency
router
  .route("/updateUserInteractionFrequency")
  .post(cuckooAccountStatsController.updateUserInteractionFrequency);

// The route for getting user interaction frequency
router
  .route("/getUserInteractionFrequency")
  .get(cuckooAccountStatsController.getUserInteractionFrequency);

// The route for getting interaction status of the user
router
  .route("/getUserInteractionStatusForUser")
  .get(cuckooAccountStatsController.getInteractionStatusForUser);

// The route for updating like status for the user
router
  .route("/updateLikeStatus")
  .post(cuckooAccountStatsController.updateLikeStatusForUser);

// The route for getting like interaction status for the user
router
  .route("/getUserLikeInteractionStatus")
  .get(cuckooAccountStatsController.getLikeInteractionStatusOfUser);

// The route for getting comment interaction status for the user
router
  .route("/getUserCommentInteractionStatus")
  .get(cuckooAccountStatsController.getCommentInteractionStatusOfUser);

// The route for updating comment status for the user
router
  .route("/updateCommentStatus")
  .post(cuckooAccountStatsController.updateCommentStatusForUser);

// The route for updating profile visit between the 2 users
router
  .route("/updateProfileVisit")
  .post(cuckooAccountStatsController.updateUserProfileVisit);

// The route for getting profile visit status of the user
router
  .route("/getProfileVisitStatus")
  .get(cuckooAccountStatsController.getProfileVisitStatusForUser);

// The route for getting brief user stats of the user
router
  .route("/getBriefAccountStats")
  .get(cuckooAccountStatsController.getBriefAccountStatsForUser);

// Export the router
module.exports = router;
