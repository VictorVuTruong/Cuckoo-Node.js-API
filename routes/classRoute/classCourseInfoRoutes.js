// Import express for the route
const express = require("express");

// Import the authenticationController
const authenticationControllers = require(`${__dirname}/../../controller/authenticationController`);

// Create new router for the class discussion board
const router = express.Router();

// Import the classCourseInfoController module
const classCourseInfoController = require(`${__dirname}/../../controller/classController/classCourseInfoController`);

// With this middleware being used. All routes that come after this point will be protected
router.use(authenticationControllers.protect);

// The route for getting all class discussion board items and creating a new one
router
  .route("/")
  .get(classCourseInfoController.getAllClassCourseInfoItems)
  .post(classCourseInfoController.createNewClassCourseInfoItem);

// Export the router in order to be able to be used by the app
module.exports = router;