// Import the user like interaction model
const cuckooUserLikeInteractionModel = require(`${__dirname}/../../model/cuckooModel/cuckooUserLikeInteractionModel`);

// Import the handler factory
const factory = require(`${__dirname}/../handlerFactory`);

// The function to get user like interaction object
exports.getUserLikeInteractionObject = factory.getAllDocuments(
  cuckooUserLikeInteractionModel
);

// The function to create new user like interaction object
exports.createNewUserLikeInteractionObject = factory.createDocument(
  cuckooUserLikeInteractionModel
);

// The function to delete a user user like interaction object
exports.deleteUserLikeInteractionObject = factory.deleteOne(
  cuckooUserLikeInteractionModel
);
