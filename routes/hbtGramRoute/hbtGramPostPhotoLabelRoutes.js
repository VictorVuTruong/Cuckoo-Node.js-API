// Import express for the route
const express = require("express");

// Import the authenticationController
const authenticationController = require(`${__dirname}/../../controller/authenticationController`);

// Create new router for the confession post
const router = express.Router();

// Import the hbtGramPostPhotoLabelController module
const hbtGramPostPhotoLabelController = require(`${__dirname}/../../controller/hbtGramController/hbtGramPostPhotoLabelController`);

// Use the protect middleware to protect any routes beyond this point
router.use(authenticationController.protect);

// The route for getting all hbt gram post photo label and creating new one
router
  .route("/")
  .get(hbtGramPostPhotoLabelController.getAllHBTGramPostPhotoLabel)
  .post(hbtGramPostPhotoLabelController.createNewHBTGramPostPhotoLabel);

// The route for updating photo label visit of the user
router
  .route("/updatePhotoLabelVisit")
  .post(hbtGramPostPhotoLabelController.updatePhotoLabelVisit);

// Export the router
module.exports = router;
