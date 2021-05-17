// Import express for the route
const express = require("express");
const { route } = require("./cuckooPostRoutes");

// Import the Firebase authentication controller
const firebaseAuthenticationController = require(`${__dirname}/../../controller/firebaseAuthenticationController`);

// Create new router for the confession post
const router = express.Router();

// Import the cuckooUserInteractionController module
const cuckooUserInteractionController = require(`${__dirname}/../../controller/cuckooController/cuckooUserInteractionController`);

// Use the protect middleware to protect any routes beyond this point
router.use(firebaseAuthenticationController.protect);

// The route for getting all user interaction objects and create a new one
router
  .route("/")
  .get(cuckooUserInteractionController.getUserInteractionObject)
  .post(cuckooUserInteractionController.createNewUserInteractionObject);

// Export the router
module.exports = router;
