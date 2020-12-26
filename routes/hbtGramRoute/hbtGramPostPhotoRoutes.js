// Import express for the route
const express = require("express");

// Import the authenticationController
const authenticationController = require(`${__dirname}/../../controller/authenticationController`);

// Create new router for the hbt gram post photo
const router = express.Router();

// Import the hbtGramPostPhotoController module
const hbtGramPostPhotoController = require(`${__dirname}/../../controller/hbtGramController/hbtGramPostPhotoController`);

// Use this middleware to protect any routes beyond this point
router.use(authenticationController.protect);

// The route for getting and creating new hbt gram post photo
router
  .route("/")
  .get(hbtGramPostPhotoController.getAllHBTGramPostPhotos)
  .post(hbtGramPostPhotoController.createNewHBTGramPostPhoto);

// The route for getting photos posted by the specified user
router
  .route("/getPhotosOfUser")
  .get(hbtGramPostPhotoController.getAllPhotosOfUser);

// The route for getting photos for the specified user
router
  .route("/getPhotosForUser")
  .get(hbtGramPostPhotoController.getPostPhotosForUser);

// The route for getting photos for the user
router
  .route("/getRecommendedPhotosForUser")
  .get(hbtGramPostPhotoController.getPhotosForUser)

// The route for creating or updating a hbt gram post photo label visit
router
  .route("/createOrUpdateHBTGramPhotoLabelVisit")
  .post(hbtGramPostPhotoController.createOrUpdateHBTGramPhotoLabelVisit)

// Export the module
module.exports = router;
