// Import express for the route
const express = require("express");

// Import the authenticationController
const authenticationController = require(`${__dirname}/../../controller/authenticationController`);

// Create new router for the post photo
const router = express.Router();

// Import the messagePhotoController module
const messagePhotoController = require(`${__dirname}/../../controller/messageController/messagePhotoController`);

// Use this middleware to protect any routes beyond this point
router.use(authenticationController.protect);

// The route for getting and creating new post photo
router
  .route("/")
  .get(messagePhotoController.getAllMessagePhotos)
  .post(messagePhotoController.createNewMessagePhoto);

// The route for getting message photos between the 2 users
router
  .route("/getMessagePhotosBetween2User")
  .get(messagePhotoController.getMessagePhotosBetweenUsers);

// Export the module
module.exports = router;
