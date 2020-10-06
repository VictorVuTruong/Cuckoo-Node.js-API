// Import the hbt gram post like model
const hbtGramPostLikeModel = require(`${__dirname}/../../model/hbtGramModel/hbtGramPostLikeModel`);

// Import the handler factory
const factory = require(`${__dirname}/../handlerFactory`);

// The function to get all hbt gram post likes
exports.getAllHBTGramPostLikes = factory.getAllDocuments(
    hbtGramPostLikeModel
);

// The function to create new hbt gram post like
exports.createNewHBTGramPostLike = factory.createDocument(
    hbtGramPostLikeModel
);

// The function to delete a hbt gram post like
exports.deleteHBTGramPostLike = factory.deleteOne(hbtGramPostLikeModel);