// Import express for the route
const express = require("express");

// Import the authenticationController
const authenticationControllers = require(`${__dirname}/../../controller/authenticationController`);

// Create new router for the class group post photo
const router = express.Router();

// Import the classGroupPostPhotoController module
const classGroupPostPhotoController = require(`${__dirname}/../../controller/classController/classGroupPostPhotoController`);

// With this middleware being used. All routes that come after this point will be protected
router.use(authenticationControllers.protect);

// The route for getting all class group post photo and creating a new one
router
  .route("/")
  .get(classGroupPostPhotoController.getAllClassGroupPostPhotoItems)
  .post(classGroupPostPhotoController.createNewClassGroupPostPhotoItem);

// Export the router in order to be able to be used by the app
module.exports = router;
