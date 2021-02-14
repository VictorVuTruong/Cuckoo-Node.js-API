// Import the cuckoo user comment interaction model
const cuckooUserCommentUserInteractionModel = require(`${__dirname}/../../model/cuckooModel/cuckooUserCommentInteractionModel`);

// Import the handler factory
const factory = require(`${__dirname}/../handlerFactory`);

// The function to get cuckoo user comment interaction object
exports.getUserCommentInteractionObject = factory.getAllDocuments(
  cuckooUserCommentUserInteractionModel
);

// The function to create new user comment interaction object
exports.createNewUserCommentInteractionObject = factory.createDocument(
  cuckooUserCommentUserInteractionModel
);

// The function to delete a user comment interaction object
exports.deleteUserCommentInteractionObject = factory.deleteOne(
  cuckooUserCommentUserInteractionModel
);
