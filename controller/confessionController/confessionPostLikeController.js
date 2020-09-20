// Import the confession post like model
const confessionPostLikeModel = require(`${__dirname}/../../model/confessionModel/confessionPostLikeModel`);

// Import the handler factory
const factory = require(`${__dirname}/../handlerFactory`);

// The function to get all confession post likes
exports.getAllConfessionPostLikes = factory.getAllDocuments(
  confessionPostLikeModel
);

// The function to create new confession post like
exports.createNewConfessionPostLike = factory.createDocument(
  confessionPostLikeModel
);

// The function to delete a confession post like
exports.deleteConfessionPostLike = factory.deleteOne(confessionPostLikeModel);
