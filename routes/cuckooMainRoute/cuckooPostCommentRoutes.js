// Import express for the route
const express = require("express");

// Import the Firebase authentication controller
const firebaseAuthenticationController = require(`${__dirname}/../../controller/firebaseAuthenticationController`);

// Create new router for the post comment
const router = express.Router();

// Import the cuckooPostCommentController module
const cuckooPostCommentController = require(`${__dirname}/../../controller/cuckooController/cuckooPostCommentController`);

// Use this middleware to protect any routes beyond this point
router.use(firebaseAuthenticationController.protect);

// The router for getting all post comments and creating the new one
router
  .route("/")
  .get(cuckooPostCommentController.getAllPostComments)
  .post(cuckooPostCommentController.createNewPostComment);

// The router for deleting comment with a specified id
router
  .route("/deleteCommentWithId")
  .delete(cuckooPostCommentController.deleteCommentWithId);

// Export the router
module.exports = router;
