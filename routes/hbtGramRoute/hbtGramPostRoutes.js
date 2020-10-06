// Import express for the route
const express = require("express");

// Import the authenticationController
const authenticationController = require(`${__dirname}/../../controller/authenticationController`);

// Create new router for the confession post
const router = express.Router();

// Import the hbtGramPostController module
const hbtGramPostController = require(`${__dirname}/../../controller/hbtGramController/hbtGramPostController`);

// Use the protect middleware to protect any routes beyond this point
router.use(authenticationController.protect);

// The route for getting all hbt gram posts and creating the new one
router
  .route("/")
  .get(hbtGramPostController.getAllHBTGramPosts)
  .post(hbtGramPostController.createNewHBTGramPost);

// Export the router
module.exports = router;