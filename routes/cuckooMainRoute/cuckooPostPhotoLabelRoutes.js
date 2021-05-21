// Import express for the route
const express = require("express");

// Import the Firebase authentication controller
const firebaseAuthenticationController = require(`${__dirname}/../../controller/firebaseAuthenticationController`);

// Create new router for the post photo label
const router = express.Router();

// Import the cuckooPostPhotoLabelController module
const cuckooPostPhotoLabelController = require(`${__dirname}/../../controller/cuckooController/cuckooPostPhotoLabelController`);

// Use the protect middleware to protect any routes beyond this point
//router.use(firebaseAuthenticationController.protect);

// The route for getting all post photo label and creating new one
router
  .route("/")
  .get(cuckooPostPhotoLabelController.getAllPostPhotoLabel)
  .post(cuckooPostPhotoLabelController.createNewPostPhotoLabel);

// The route for updating photo label visit of the user
router
  .route("/updatePhotoLabelVisit")
  .post(cuckooPostPhotoLabelController.updatePhotoLabelVisit);

// Export the router
module.exports = router;
