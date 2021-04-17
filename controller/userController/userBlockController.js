// Import the user block model
const UserBlock = require(`${__dirname}/../../model/userModel/userBlockModel`);

// Import the app error which will be used to handle errors
const AppError = require(`${__dirname}/../../utils/appError`);

// Import the handler factory
const factory = require(`${__dirname}/../handlerFactory`);

// Import this one in order to catch error in any async functions
const catchAsync = require(`${__dirname}/../../utils/catchAsync`);

// The function to get all user blocks
exports.getAllUserBlocks = factory.getAllDocuments(UserBlock);

// The function to create a new user block
exports.createNewUserBlock = factory.createDocument(UserBlock);

// The function to delete a user block between the 2 users
exports.deleteABlockBetween2Users = catchAsync(
  async (request, response, next) => {
    // Get user id of user get blocked
    const userGetBlocked = request.query.userGetBlocked;

    // Get user id of blocking user
    const blockingUser = request.query.blockingUser;

    // Reference the database and delete a user block based on those info
    await UserBlock.deleteOne({
      user: userGetBlocked,
      blockedBy: blockingUser,
    });

    // Return response to the client
    response.status(200).json({
      status: "Done",
      data: "User block has been removed",
    });
  }
);
