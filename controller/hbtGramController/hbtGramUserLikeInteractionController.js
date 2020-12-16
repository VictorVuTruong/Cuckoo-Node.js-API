// Import the hbt gram user like interaction model
const hbtGramUserLikeInteractionModel = require(`${__dirname}/../../model/hbtGramModel/hbtGramUserLikeInteractionModel`);

// Import the handler factory
const factory = require(`${__dirname}/../handlerFactory`);

// The function to get hbt gram user like interaction object
exports.getHBTGramUserLikeInteractionObject = factory.getAllDocuments(hbtGramUserLikeInteractionModel)

// The function to create new hbt gram user like interaction object
exports.createNewHBTGramUserLikeInteractionObject = factory.createDocument(hbtGramUserLikeInteractionModel)

// The function to delete a hbt gram user user like interaction object
exports.deleteHBTGramUserLikeInteractionObject = factory.deleteOne(hbtGramUserLikeInteractionModel)