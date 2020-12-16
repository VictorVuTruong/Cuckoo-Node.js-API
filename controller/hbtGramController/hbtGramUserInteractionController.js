const { request, response } = require("express");
const expressMongoSanitize = require("express-mongo-sanitize");

// Import the hbt gram user interaction model
const hbtGramUserInteractionModel = require(`${__dirname}/../../model/hbtGramModel/hbtGramUserInteractionModel`);

// Import the handler factory
const factory = require(`${__dirname}/../handlerFactory`);

// The function to get hbt gram user interaction object
exports.getHBTGramUserInteractionObject = factory.getAllDocuments(hbtGramUserInteractionModel)

// The function to create new hbt gram user interaction object
exports.createNewHBTGramUserInteractionObject = factory.createDocument(hbtGramUserInteractionModel)

// The function to delete a hbt gram user interaction object
exports.deleteHBTGramUserInteractionObject = factory.deleteOne(hbtGramUserInteractionModel)