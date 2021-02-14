// Import express for the route
const express = require("express");

// Import the authenticationController
const authenticationController = require(`${__dirname}/../../controller/authenticationController`);

// Create new router for the post photo
const router = express.Router();

// Import the cuckooPostPhotoController module
const cuckooPostPhotoController = require(`${__dirname}/../../controller/cuckooController/cuckooPostPhotoController`);

// Use this middleware to protect any routes beyond this point
router.use(authenticationController.protect);

// The route for getting and creating new post photo
router
  .route("/")
  .get(cuckooPostPhotoController.getAllPostPhotos)
  .post(cuckooPostPhotoController.createNewPostPhoto);

// The route for getting photos posted by the specified user
router
  .route("/getPhotosOfUser")
  .get(cuckooPostPhotoController.getAllPhotosOfUser);

// The route for getting photos for the specified user
router
  .route("/getPhotosForUser")
  .get(cuckooPostPhotoController.getPostPhotosForUser);

// The route for getting photos for the user
router
  .route("/getRecommendedPhotosForUser")
  .get(cuckooPostPhotoController.getPhotosForUser);

// The route for creating or updating a post photo label visit
router
  .route("/createOrUpdatePhotoLabelVisit")
  .post(cuckooPostPhotoController.createOrUpdatePhotoLabelVisit);

// THe route for getting order in collection of latest post photo in the collection
router
  .route("/getLatestPhotoLabelOrderInCollection")
  .get(cuckooPostPhotoController.getLatestPhotoLabelOrderInCollection);

// Export the module
module.exports = router;
