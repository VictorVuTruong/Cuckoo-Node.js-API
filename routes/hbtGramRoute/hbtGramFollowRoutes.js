// Import express for the route
const express = require("express");

// Import the authenticationController
const authenticationController = require(`${__dirname}/../../controller/authenticationController`);

// Create new router for the hbt gram post comment photo
const router = express.Router();

// Import the hbtGramFollowController module
const hbtGramFollowController = require(`${__dirname}/../../controller/hbtGramController/hbtGramFollowController`);

// Use this middleware to protect any routes beyond this point
router.use(authenticationController.protect);

// The route for getting and creating new hbt gram follow
router
  .route("/")
  .get(hbtGramFollowController.getAllHBTGramFollows)
  .post(hbtGramFollowController.createNewHBTGramFollow);

// The route for deleting a hbt gram follow
router
    .route("/")
    .delete(hbtGramFollowController.deleteHBTGramFollow)

// The router to check following status of the 2 specified users
router
    .route("/checkFollowStatus")
    .get(hbtGramFollowController.checkFollowStatus)

// Export the module
module.exports = router;