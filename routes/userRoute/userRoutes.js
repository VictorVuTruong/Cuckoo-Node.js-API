// Import the express module
const express = require("express");

// Create new router for users
const router = express.Router();

// Import the Firebase authentication controller
const firebaseAuthenticationController = require(`${__dirname}/../../controller/firebaseAuthenticationController`);

// Import the authentication controller
const authenticationController = require(`${__dirname}/../../controller/authenticationController`);

// Import the userController module
const userController = require(`${__dirname}/../../controller/userController/userController`);

// The route for signing up
// This route also take the sign up token in order to verify the user
//router.post("/signup/:token", authenticationController.signUp);

// Alternate route for signing up
router.post("/signup", firebaseAuthenticationController.signUp);

// The route for logging in
router.post("/login", authenticationController.login);

// The route for logging out
router.post("/logout", authenticationController.logout);

// The route for getting sign up token
router.post("/getSignUpToken", authenticationController.getSignUpToken);

// The route for validating login token
router.post("/validateLoginToken", firebaseAuthenticationController.checkToken);

// Use the protect middleware to protect any routes beyond this point
router.use(firebaseAuthenticationController.protect);

// The route for getting list of users in a specified radius
router.get("/getUserWithin", userController.getUserWithin);

// The route for geting users to be pinned on the Cuckoo map for user with specified user id
router.get(
  "/getUsersToBePinnedOnMap",
  userController.getListOfUsersToShowOnCuckooMapForUser
);

// The route for getting all users
// Query can also be done at this route
router.get("/", userController.getAllUsers);

// The route for searching user
router.get("/searchUser", userController.searchUser);

// The route for updating info of the user (by the user based on jwt sent to server from client app)
router.patch("/updateMe", userController.updateMe);

// The route for getting user info based on token
router.get(
  "/getUserInfoBasedOnToken",
  firebaseAuthenticationController.getUserInfoBasedOnTokenId
);

// Export the app in order to be able to be used by the app
module.exports = router;
