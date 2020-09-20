// Import the class group post like model
const classGroupPostLikeModel = require(`${__dirname}/../../model/classModel/classGroupPostLikesModel`);

// Import the handler factory
const factory = require(`${__dirname}/../handlerFactory`);

// The function for getting all class group post like items
exports.getAllClassGroupPostLikeItems = factory.getAllDocuments(
  classGroupPostLikeModel
);

// The function to create new class group post like item
exports.createNewClassGroupPostLikeItem = factory.createDocument(
  classGroupPostLikeModel
);

// The function for deleting a class group post like item
exports.deleteClassGroupPostLikeItem = factory.deleteOne(
  classGroupPostLikeModel
);
