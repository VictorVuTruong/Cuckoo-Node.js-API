// Immport the class group post controller model
const classGroupPostModel = require(`${__dirname}/../../model/classModel/classGroupPostModel`);

// Import the handler factory
const factory = require(`${__dirname}/../handlerFactory`);

// The function for getting all class group post items
exports.getAllClassGroupPostItems = factory.getAllDocuments(
  classGroupPostModel
);

// The function to create new class group post item
exports.createNewClassGroupPostItem = factory.createDocument(
  classGroupPostModel
);

// The function for deleting a class group post item
exports.deleteClassGroupPostItem = factory.deleteOne(classGroupPostModel);
