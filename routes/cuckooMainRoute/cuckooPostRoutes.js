// Import express for the route
const express = require("express");

// Import the authenticationController
const authenticationController = require(`${__dirname}/../../controller/authenticationController`);

// Create new router for the confession post
const router = express.Router();

// Import the cuckooPostController module
const cuckooPostController = require(`${__dirname}/../../controller/cuckooController/cuckooPostController`);

// Use the protect middleware to protect any routes beyond this point
router.use(authenticationController.protect);

// The route for getting all posts and creating the new one
router
  .route("/")
  .get(cuckooPostController.getAllCuckooPosts)
  .post(cuckooPostController.createNewCuckooPost)
  .delete(cuckooPostController.deleteCuckooPost);

// The route for getting Cuckoo post detail based on post id
router
  .route("/getCuckooPostDetail")
  .get(cuckooPostController.getCuckooPostDetail);

// THe route for getting Cuckoo posts for the user
router
  .route("/getCuckooPostForUser")
  .get(cuckooPostController.getAllCuckooPostsForUser);

// The route for getting list of posts within a radius
router
  .route("/getCuckooPostWithinRadius")
  .get(cuckooPostController.getCuckooPostWithinARadius);

// The route for getting latest post object in the collection
router
  .route("/getLatestPostInCollection")
  .get(cuckooPostController.getLatestPostOrderInCollection);

// The route for checking if user is at the end of the colletion or not
router
  .route("/checkEndOfCollectionStatus")
  .get(cuckooPostController.checkEndOfCollectionStatus);

// Export the router
module.exports = router;
