// Import express for the route
const express = require("express");

// Import the authenticationController
const authenticationController = require(`${__dirname}/../../controller/authenticationController`);

// Import the Firebase authentication controller
const firebaseAuthenticationController = require(`${__dirname}/../../controller/firebaseAuthenticationController`);

// Create new router for the confession post
const router = express.Router();

// Import the userLikeInteractionController module
const cuckooUserLikeInteractionController = require(`${__dirname}/../../controller/cuckooController/cuckooUserLikeInteractionController`);

// Use the protect middleware to protect any routes beyond this point
router.use(firebaseAuthenticationController.protect);

// The route for getting all user like interaction objects and create a new one
router
  .route("/")
  .get(cuckooUserLikeInteractionController.getUserLikeInteractionObject)
  .post(cuckooUserLikeInteractionController.createNewUserLikeInteractionObject);

// Export the router
module.exports = router;
