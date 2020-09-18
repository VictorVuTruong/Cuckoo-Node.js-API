// Import express for the route
const express = require("express");

// Import the authenticationController
const authenticationControllers = require(`${__dirname}/../../controller/authenticationController`);

// Create new router for the class group post like
const router = express.Router();

// Import the classGroupPostLikeController module
const classGroupPostLikeController = require(`${__dirname}/../../controller/classController/classGroupPostLikeController`);

// With this middleware being used. All routes that come after this point will be protected
router.use(authenticationControllers.protect);

// The route for getting all class discussion board items and creating a new one
router
  .route("/")
  .get(classGroupPostLikeController.getAllClassGroupPostLikeItems)
  .post(classGroupPostLikeController.createNewClassGroupPostLikeItem);

// Export the router in order to be able to be used by the app
module.exports = router;
