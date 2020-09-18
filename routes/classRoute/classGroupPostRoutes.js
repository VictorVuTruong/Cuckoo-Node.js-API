// Import express for the route
const express = require("express");

// Import the authenticationController
const authenticationControllers = require(`${__dirname}/../../controller/authenticationController`);

// Create new router for the class group post
const router = express.Router();

// Import the classGroupPostController module
const classGroupPostController = require(`${__dirname}/../../controller/classController/classGroupPostController`);

// With this middleware being used. All routes that come after this point will be protected
router.use(authenticationControllers.protect);

// The route for getting all class discussion board items and creating a new one
router
  .route("/")
  .get(classGroupPostController.getAllClassGroupPostItems)
  .post(classGroupPostController.createNewClassGroupPostItem);

// Export the router in order to be able to be used by the app
module.exports = router;
