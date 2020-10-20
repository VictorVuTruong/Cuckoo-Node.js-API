// Import express for the route
const express = require("express");

// Import the authenticationController
const authenticationController = require(`${__dirname}/../../controller/authenticationController`);

// Create new router for the hbt gram post comment
const router = express.Router();

// Import the hbtGramPostCommentController module
const hbtGramPostCommentController = require(`${__dirname}/../../controller/hbtGramController/hbtGramPostCommentController`);

// Use this middleware to protect any routes beyond this point
router.use(authenticationController.protect);

// The router for getting all hbt gram post comments and creating the new one
router
  .route("/")
  .get(hbtGramPostCommentController.getAllHBTGramPostComments)
  .post(hbtGramPostCommentController.createNewHBTGramPostComment);

// Export the router
module.exports = router;
