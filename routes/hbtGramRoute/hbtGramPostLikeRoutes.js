// Import express for the route
const express = require("express");

// Import the authenticationController
const authenticationController = require(`${__dirname}/../../controller/authenticationController`);

// Create new router for the hbt gram post like
const router = express.Router();

// Import the hbtGramPostLikeController module
const hbtGramPostLikeController = require(`${__dirname}/../../controller/hbtGramController/hbtGramPostLikeController`);

// Use this middleware to protect any routes beyond this
router.use(authenticationController.protect);

// The route for getting all hbt gram post likes and creating the new one
router
  .route("/")
  .get(hbtGramPostLikeController.getAllHBTGramPostLikes)
  .post(hbtGramPostLikeController.createNewHBTGramPostLike);

// The router for checking like status and create new like based on it
router
  .route("/checkLikeStatusAndCreateLike")
  .post(hbtGramPostLikeController.checkLikeStatusAndCreateNewHBTGramPostLike)

// The router for getting like status of the user with the specified post id
router
  .route("/checkLikeStatus")
  .post(hbtGramPostLikeController.checkLikeStatus)

// Export the module
module.exports = router;
