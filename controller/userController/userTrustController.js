const { request, response } = require("express")

// Import the user trust model
const UserTrust = require(`${__dirname}/../../model/userModel/userTrustModel`)

// Import the handler factory
const factory = require(`${__dirname}/../handlerFactory`)

// Import this one to catch error in async functions
const catchAsync = require(`${__dirname}/../../utils/catchAsync`)

// The function to get all user trusts 
exports.getAllUserTrusts = factory.getAllDocuments(UserTrust)

// The function to create new user trust
exports.createNewUserTrust = factory.createDocument(UserTrust)

// The function to delete a user trust between the 2 users
exports.deleteATrustBetween2Users = catchAsync(async (request, response, next) => {
    // Get user id of user get trusted
    const userGetTrusted = request.query.userGetTrusted

    // get user id of the trusting user
    const trustingUser = request.query.trustingUser

    // Reference the database and delete a user trust based on those info
    await UserTrust.deleteMany({
        user: userGetTrusted,
        trustedBy: trustingUser
    })

    // Return response to the client
    response.status(200).json({
        status: "Done",
        data: "User trust has been removed"
    })
})