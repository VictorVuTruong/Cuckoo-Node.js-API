// Import the confession post comment model
const confessionPostCommentModel = require(`${__dirname}/../../model/confessionModel/confessionPostCommentModel`);

// Import the handler factory
const factory = require(`${__dirname}/../handlerFactory`);

// The function to get all confession post comments
exports.getAllConfessionPostComments = factory.getAllDocuments(
  confessionPostCommentModel
);

// The function to create new confession post comment
exports.createNewConfessionPostComment = factory.createDocument(
  confessionPostCommentModel
);

// The function to delete a confession post comment
exports.deleteConfessionPostComment = factory.deleteOne(
  confessionPostCommentModel
);
