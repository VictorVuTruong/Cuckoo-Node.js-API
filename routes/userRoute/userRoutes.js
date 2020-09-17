// Import the express module
const express = require("express");

// Create new router for users
const router = express.Router();

// Import the userController module
const userController = require(`${__dirname}/../../controller/userController/userController`);

// Import the authenticationController
const authenticationController = require(`${__dirname}/../../controller/authenticationController`);

// The route for signing up
// This route also take the sign up token in order to verify the user
router.post("/signup/:token", authenticationController.signUp);

// The route for logging in
router.post("/login", authenticationController.login);

// The route for logging out
router.post("/logout", authenticationController.logout);

// The route for getting sign up token
router.post("/getSignUpToken", authenticationController.getSignUpToken);

// The route for getting all users
// Query can also be done at this route
router.get("/", userController.getAllUsers);

// With this middleware being used. All routes that come after this point will be protected
router.use(authenticationController.protect);

// Export the app in order to be able to be used by the app
module.exports = router;
