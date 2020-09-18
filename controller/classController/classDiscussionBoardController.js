// Immport the class discussion board model
const ClassDiscussionBoard = require(`${__dirname}/../../model/classModel/classDiscussionBoardModel`);

// Import the handler factory
const factory = require(`${__dirname}/../handlerFactory`);

// The function for getting all discussion board items
exports.getAllClassDiscussionBoardItems = factory.getAllDocuments(
  ClassDiscussionBoard
);

// The function to create new class discussion board item
exports.createNewClassDiscussionBoardItem = factory.createDocument(
  ClassDiscussionBoard
);

// The function for deleting a class discussion board item
exports.deleteClassDiscussionBoardItem = factory.deleteOne(
  ClassDiscussionBoard
);
