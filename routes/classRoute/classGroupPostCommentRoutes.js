// Import express for the route
const express = require("express");

// Import the authenticationController
const authenticationControllers = require(`${__dirname}/../../controller/authenticationController`);

// Create new router for the class group post comment
const router = express.Router();

// Import the classGroupPostCommentController module
const classGroupPostCommentController = require(`${__dirname}/../../controller/classController/classGroupPostCommentController`);

// With this middleware being used. All routes that come after this point will be protected
router.use(authenticationControllers.protect);

// The route for getting all class discussion board items and creating a new one
router
  .route("/")
  .get(classGroupPostCommentController.getAllClassGroupPostCommentItems)
  .post(classGroupPostCommentController.createNewClassGroupPostCommentItem);

// Export the router in order to be able to be used by the app
module.exports = router;
