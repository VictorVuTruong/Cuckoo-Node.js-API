// Import the hbt gram post model
const hbtGramPostModel = require(`${__dirname}/../../model/hbtGramModel/hbtGramPostModel`);

// Import the handler factory
const factory = require(`${__dirname}/../handlerFactory`);

// The function to get all hbt gram posts
exports.getAllHBTGramPosts = factory.getAllDocuments(hbtGramPostModel);

// The function to create new hbt gram post
exports.createNewHBTGramPost = factory.createDocument(hbtGramPostModel);

// The function to delete a hbt gram post
exports.deleteHBTGramPost = factory.deleteOne(hbtGramPostModel);