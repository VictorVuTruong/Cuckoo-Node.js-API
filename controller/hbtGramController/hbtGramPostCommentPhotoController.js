// Import the hbt gram post comment photo model
const hbtGramPostCommentPhotoModel = require(`${__dirname}/../../model/hbtGramModel/hbtGramPostCommentPhotoModel`);

// Import the handler factory
const factory = require(`${__dirname}/../handlerFactory`);

// The function to get all hbt gram post comment photo
exports.getAllHBTGramPostCommentPhotos = factory.getAllDocuments(
  hbtGramPostCommentPhotoModel
);

// The function to create new hbt gram post comment photo
exports.createNewHBTGramPostCommentPhotos = factory.createDocument(
  hbtGramPostCommentPhotoModel
);

// The function to delete a hbt gram post comment photo photo
exports.deleteHBTGramPostCommentPhotos = factory.deleteOne(
  hbtGramPostCommentPhotoModel
);
