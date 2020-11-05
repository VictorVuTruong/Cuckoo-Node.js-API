// Import express for the route
const express = require("express");

// Import the authenticationController
const authenticationController = require(`${__dirname}/../../controller/authenticationController`);

// Create new router for the hbt gram post comment photo
const router = express.Router();

// Import the hbtGramPostCommentPhotoController module
const hbtGramPostCommentPhotoController = require(`${__dirname}/../../controller/hbtGramController/hbtGramPostCommentPhotoController`);

// Use this middleware to protect any routes beyond this point
router.use(authenticationController.protect);

// The route for getting and creating new hbt gram post comment photo
router
  .route("/")
  .get(hbtGramPostCommentPhotoController.getAllHBTGramPostCommentPhotos)
  .post(hbtGramPostCommentPhotoController.createNewHBTGramPostCommentPhotos);

// Export the module
module.exports = router;
