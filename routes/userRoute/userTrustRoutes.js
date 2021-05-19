// Import the express model
const express = require("express")

// Create new router for the user trust
const router = express.Router()

// Import the userTrustController
const userTrustController = require(`${__dirname}/../../controller/userController/userTrustController`)

// The route for getting all user trusts
// create new trust
// delete a trust
router
    .get("/", userTrustController.getAllUserTrusts)
    .post("/", userTrustController.createNewUserTrust)
    .delete("/", userTrustController.deleteATrustBetween2Users)

// Export the route in order to be able to be used by the app
module.exports = router