// Import express for the route
const express = require("express");

// Import the authenticationController
const authenticationController = require(`${__dirname}/../../controller/authenticationController`);

// Import the Firebase authentication controller
const firebaseAuthenticationController = require(`${__dirname}/../../controller/firebaseAuthenticationController`);

// Create new router for the post comment photo
const router = express.Router();

// Import the cuckooFollowController module
const cuckooFollowController = require(`${__dirname}/../../controller/cuckooController/cuckooFollowController`);

// Use this middleware to protect any routes beyond this point
router.use(firebaseAuthenticationController.protect);

// The route for getting and creating new follow object
router
  .route("/")
  .get(cuckooFollowController.getAllCuckooFollows)
  .post(cuckooFollowController.createNewCuckooFollow);

// The route for deleting a follow object
router.route("/").delete(cuckooFollowController.deleteCuckooFollow);

// The route for deleting a follow based on follower and following
router
  .route("/deleteCuckooFollowBetween2Users")
  .delete(cuckooFollowController.deleteCuckooFollowBetween2Users);

// The router to check following status of the 2 specified users
router
  .route("/checkFollowStatus")
  .get(cuckooFollowController.checkFollowStatus);

// Export the module
module.exports = router;
