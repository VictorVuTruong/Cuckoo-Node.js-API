// Immport the class group post comment controller model
const classGroupPostCommentModel = require(`${__dirname}/../../model/classModel/classGroupPostCommentsModel`);

// Import the handler factory
const factory = require(`${__dirname}/../handlerFactory`);

// The function for getting all class group post comment items
exports.getAllClassGroupPostCommentItems = factory.getAllDocuments(
  classGroupPostCommentModel
);

// The function to create new class group post comment item
exports.createNewClassGroupPostCommentItem = factory.createDocument(
  classGroupPostCommentModel
);

// The function for deleting a class group post comment item
exports.deleteClassGroupPostItem = factory.deleteOne(
  classGroupPostCommentModel
);
