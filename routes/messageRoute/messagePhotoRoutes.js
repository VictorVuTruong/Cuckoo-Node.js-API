// Import express for the route
const express = require("express");

// Import the authenticationController
const authenticationController = require(`${__dirname}/../../controller/authenticationController`);

// Import the Firebase authentication controller
const firebaseAuthenticationController = require(`${__dirname}/../../controller/firebaseAuthenticationController`);

// Create new router for the post photo
const router = express.Router();

// Import the messagePhotoController module
const messagePhotoController = require(`${__dirname}/../../controller/messageController/messagePhotoController`);

// Use this middleware to protect any routes beyond this point
router.use(firebaseAuthenticationController.protect);

// The route for getting and creating new post photo
router
  .route("/")
  .get(messagePhotoController.getAllMessagePhotos)
  .post(messagePhotoController.createNewMessagePhoto);

// The route for getting message photos between the 2 users
router
  .route("/getMessagePhotosBetween2User")
  .get(messagePhotoController.getMessagePhotosBetweenUsers);

// The route for getting message photos of chat room
router
  .route("/getMessagePhotosOfChatRoom")
  .get(messagePhotoController.getMessagePhotosOfChatRoom);

// Export the module
module.exports = router;
