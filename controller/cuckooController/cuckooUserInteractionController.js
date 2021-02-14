const { request, response } = require("express");
const expressMongoSanitize = require("express-mongo-sanitize");

// Import the user interaction model
const cuckooUserInteractionModel = require(`${__dirname}/../../model/cuckooModel/cuckooUserInteractionModel`);

// Import the handler factory
const factory = require(`${__dirname}/../handlerFactory`);

// The function to get user interaction object
exports.getUserInteractionObject = factory.getAllDocuments(
  cuckooUserInteractionModel
);

// The function to create new user interaction object
exports.createNewUserInteractionObject = factory.createDocument(
  cuckooUserInteractionModel
);

// The function to delete a user interaction object
exports.deleteUserInteractionObject = factory.deleteOne(
  cuckooUserInteractionModel
);
