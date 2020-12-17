// Import express for the route
const express = require("express");

// Import the authenticationController
const authenticationController = require(`${__dirname}/../../controller/authenticationController`);

// Create new router for the confession post
const router = express.Router();

// Import the HBTGramUserCommentInteractionController module
const hbtGramUserCommentInteractionController = require(`${__dirname}/../../controller/hbtGramController/hbtGramUserCommentInteractionController`);

// Use the protect middleware to protect any routes beyond this point
router.use(authenticationController.protect);

// The route for getting all hbt gram user comment interaction objects and create a new one
router
  .route("/")
  .get(
    hbtGramUserCommentInteractionController.getHBTGramUserCommentInteractionObject
  )
  .post(
    hbtGramUserCommentInteractionController.createNewHBTGramUserCommentInteractionObject
  );

// Export the router
module.exports = router;
