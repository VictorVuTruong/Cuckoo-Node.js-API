// Import the confession post model
const confessionPostModel = require(`${__dirname}/../../model/confessionModel/confessionPostModel`);

// Import the handler factory
const factory = require(`${__dirname}/../handlerFactory`);

// The function to get all confession posts
exports.getAllConfessionPosts = factory.getAllDocuments(confessionPostModel);

// The function to create new confession post
exports.createNewConfessionPost = factory.createDocument(confessionPostModel);

// The function to delete a confession post
exports.deleteConfessionPost = factory.deleteOne(confessionPostModel);
