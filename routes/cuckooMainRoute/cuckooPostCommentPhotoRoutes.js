// Import express for the route
const express = require("express");

// Import the Firebase authentication controller
const firebaseAuthenticationController = require(`${__dirname}/../../controller/firebaseAuthenticationController`);

// Create new router for the post comment photo
const router = express.Router();

// Import the cuckooPostCommentPhotoController module
const cuckooPostCommentPhotoController = require(`${__dirname}/../../controller/cuckooController/cuckooPostCommentPhotoController`);

// Use this middleware to protect any routes beyond this point
router.use(firebaseAuthenticationController.protect);

// The route for getting and creating new post comment photo
router
  .route("/")
  .get(cuckooPostCommentPhotoController.getAllCuckooPostCommentPhotos)
  .post(cuckooPostCommentPhotoController.createNewCuckooPostCommentPhotos);

// Export the module
module.exports = router;
