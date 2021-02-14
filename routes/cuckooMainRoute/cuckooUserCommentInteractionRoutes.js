// Import express for the route
const express = require("express");

// Import the authenticationController
const authenticationController = require(`${__dirname}/../../controller/authenticationController`);

// Create new router for the confession post
const router = express.Router();

// Import the cuckooUserCommentInteractionController module
const cuckooUserCommentInteractionController = require(`${__dirname}/../../controller/cuckooController/cuckooUserCommentInteractionController`);

// Use the protect middleware to protect any routes beyond this point
router.use(authenticationController.protect);

// The route for getting all user comment interaction objects and create a new one
router
  .route("/")
  .get(cuckooUserCommentInteractionController.getUserCommentInteractionObject)
  .post(
    cuckooUserCommentInteractionController.createNewUserCommentInteractionObject
  );

// Export the router
module.exports = router;
