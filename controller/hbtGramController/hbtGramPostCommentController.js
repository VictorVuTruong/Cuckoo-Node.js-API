// Import the hbt gram post comment model
const hbtGramPostCommentModel = require(`${__dirname}/../../model/hbtGramModel/hbtGramPostCommentModel`);

// Import the handler factory
const factory = require(`${__dirname}/../handlerFactory`);

// The function to get all HBT gram post comments
exports.getAllHBTGramPostComments = factory.getAllDocuments(
    hbtGramPostCommentModel
);

// The function to create new HBT gram post comment
exports.createNewHBTGramPostComment = factory.createDocument(
    hbtGramPostCommentModel
);

// The function to delete a HBT gram post comment
exports.deleteHBTGramPostComment = factory.deleteOne(
    hbtGramPostCommentModel
);