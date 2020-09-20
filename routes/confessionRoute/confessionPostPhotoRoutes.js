// Import express for the route
const express = require("express");

// Import the authenticationController
const authenticationController = require(`${__dirname}/../../controller/authenticationController`);

// Create new router for the confession post photo
const router = express.Router();

// Import the confessionPostPhotoController module
const confessionPostPhotoController = require(`${__dirname}/../../controller/confessionController/confessionPostPhotoController`);

// Use this middleware to protect any routes beyond this point
router.use(authenticationController.protect);

// The route for getting and creating new confession post photo
router
  .route("/")
  .get(confessionPostPhotoController.getAllConfessionPostPhotos)
  .post(confessionPostPhotoController.createNewConfessionPostPhoto);

// Export the module
module.exports = router;
