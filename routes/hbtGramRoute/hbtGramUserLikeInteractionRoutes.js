// Import express for the route
const express = require("express");

// Import the authenticationController
const authenticationController = require(`${__dirname}/../../controller/authenticationController`);

// Create new router for the confession post
const router = express.Router();

// Import the HBTGramUserLikeInteractionController module
const hbtGramUserLikeInteractionController = require(`${__dirname}/../../controller/hbtGramController/hbtGramUserLikeInteractionController`);

// Use the protect middleware to protect any routes beyond this point
router.use(authenticationController.protect);

// The route for getting all hbt gram user like interaction objects and create a new one
router
    .route("/")
    .get(hbtGramUserLikeInteractionController.getHBTGramUserLikeInteractionObject)
    .post(hbtGramUserLikeInteractionController.createNewHBTGramUserLikeInteractionObject)

// Export the router
module.exports = router;