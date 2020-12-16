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

// The route for getting HBTGram post detail based on post id
router
  .route("/getHBTGramPostDetail")
  .get(hbtGramPostController.getHBTGramPostDetail)

// THe route for getting HBTGram posts for the user
router
  .route("/getHBTGramPostForUser")
  .get(hbtGramPostController.getAllHBTGramPostsForUser)

// The route for getting latest post object in the collection
router
  .route("/getLatestPostInCollection")
  .get(hbtGramPostController.getLatestPostOrderInCollection)

// The route for checking if user is at the end of the colletion or not
router
  .route("/checkEndOfCollectionStatus")
  .get(hbtGramPostController.checkEndOfCollectionStatus)

// The route for updating user interaction frequency
router
  .route("/updateUserInteractionFrequency")
  .post(hbtGramPostController.updateUserInteractionFrequency)

// The route for getting user interaction frequency
router
  .route("/getUserInteractionFrequency")
  .get(hbtGramPostController.getUserInteractionFrequency)

// The route for getting interaction status of the user
router
  .route("/getUserInteractionStatusForUser")
  .get(hbtGramPostController.getInteractionStatusForUser)

// The route for updating like status for the user
router
  .route("/updateLikeStatus")
  .post(hbtGramPostController.updateLikeStatusForUser)

// The route for getting like interaction status for the user
router
  .route("/getUserLikeInteractionStatus")
  .get(hbtGramPostController.getLikeInteractionStatusOfUser)

// Export the router
module.exports = router;