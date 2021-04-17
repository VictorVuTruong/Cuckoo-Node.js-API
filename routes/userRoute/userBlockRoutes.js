// Import the express module
const express = require("express");

// Create new router for users
const router = express.Router();

// Import the authenticationController
const authenticationController = require(`${__dirname}/../../controller/authenticationController`);

// Import the userBlockController module
const userBlockController = require(`${__dirname}/../../controller/userController/userBlockController`);

// The route for getting all user blocks
router
  .get("/", userBlockController.getAllUserBlocks)
  .post("/", userBlockController.createNewUserBlock)
  .delete("/", userBlockController.deleteABlockBetween2Users);

// Export the app in order to be able to be used by the app
module.exports = router;
