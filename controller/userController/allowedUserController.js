// Import the user model
const AllowedUser = require(`${__dirname}/../../model/userModel/allowedUserModel`);

// Import the handler factory
const factory = require(`${__dirname}/../handlerFactory`);

// This middleware is used to get all allowed users
exports.getAllUsers = factory.getAllDocuments(AllowedUser);

// This middleware is used for creating new allowed user
exports.createNewUser = factory.createDocument(AllowedUser);
