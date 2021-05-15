// Import express for the route
const express = require("express");

// Import the authenticationController
const authenticationController = require(`${__dirname}/../../controller/authenticationController`);

// Import the Firebase authentication controller
const firebaseAuthenticationController = require(`${__dirname}/../../controller/firebaseAuthenticationController`);

// Create new router for the post like
const router = express.Router();

// Import the cuckooPostLikeController module
const cuckooPostLikeController = require(`${__dirname}/../../controller/cuckooController/cuckooPostLikeController`);

// Use this middleware to protect any routes beyond this
router.use(firebaseAuthenticationController.protect);

// The route for getting all post likes and creating the new one
router
  .route("/")
  .get(cuckooPostLikeController.getAllCuckooPostLikes)
  .post(cuckooPostLikeController.createNewCuckooPostLike);

// The router for checking like status and create new like based on it
router
  .route("/checkLikeStatusAndCreateLike")
  .post(cuckooPostLikeController.checkLikeStatusAndCreateNewCuckooPostLike);

// The router for getting like status of the user with the specified post id
router.route("/checkLikeStatus").post(cuckooPostLikeController.checkLikeStatus);

// Export the module
module.exports = router;
