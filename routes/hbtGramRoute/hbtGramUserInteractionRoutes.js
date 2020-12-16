// Import express for the route
const express = require("express");
const { route } = require("./hbtGramPostRoutes");

// Import the authenticationController
const authenticationController = require(`${__dirname}/../../controller/authenticationController`);

// Create new router for the confession post
const router = express.Router();

// Import the HBTGramUserInteractionController module
const hbtGramUserInteractionController = require(`${__dirname}/../../controller/hbtGramController/hbtGramUserInteractionController`);

// Use the protect middleware to protect any routes beyond this point
router.use(authenticationController.protect);

// The route for getting all hbt gram user interaction objects and create a new one
router
    .route("/")
    .get(hbtGramUserInteractionController.getHBTGramUserInteractionObject)
    .post(hbtGramUserInteractionController.createNewHBTGramUserInteractionObject)

// Export the router
module.exports = router;