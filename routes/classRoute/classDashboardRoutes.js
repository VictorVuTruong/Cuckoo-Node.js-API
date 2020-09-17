// Import express for the route
const express = require("express");

// Import the authenticationController
const authenticationControllers = require(`${__dirname}/../../controller/authenticationController`);

// Create new router for the class group chat
const router = express.Router();

// Import the classDashboardController module
const classDashboardController = require(`${__dirname}/../../controller/classController/classDashboardController`);

// With this middleware being used. All routes that come after this point will be protected
router.use(authenticationControllers.protect);

// The route for getting all class dashboard items and creating a new one
router
  .route("/")
  .get(classDashboardController.getAllClassDashboardItems)
  .post(classDashboardController.createNewClassDashboardItem);

// Export the router in order to be able to be used by the app
module.exports = router;
