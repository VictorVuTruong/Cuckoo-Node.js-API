// Import the express module
const express = require("express");

// Create new router for allowed users
const router = express.Router();

// Import the allowedUserController module
const allowedUserController = require(`${__dirname}/../../controller/userController/allowedUserController`);

// The route for creating new user
router.route("/createNewUser").post(allowedUserController.createNewUser);

// The route for getting all allowed users
router.route("/").get(allowedUserController.getAllUsers);

// Export the app in order to be able to be used by the app
module.exports = router;
