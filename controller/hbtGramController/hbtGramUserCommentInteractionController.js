// Import the hbt gram user comment interaction model
const hbtGramUserCommentUserInteractionModel = require(`${__dirname}/../../model/hbtGramModel/hbtGramUserCommentInteractionModel`);

// Import the handler factory
const factory = require(`${__dirname}/../handlerFactory`);

// The function to get hbt gram user comment interaction object
exports.getHBTGramUserCommentInteractionObject = factory.getAllDocuments(
  hbtGramUserCommentUserInteractionModel
);

// The function to create new hbt gram user comment interaction object
exports.createNewHBTGramUserCommentInteractionObject = factory.createDocument(
  hbtGramUserCommentUserInteractionModel
);

// The function to delete a hbt gram user comment interaction object
exports.deleteHBTGramUserCommentInteractionObject = factory.deleteOne(
  hbtGramUserCommentUserInteractionModel
);
