// Import the class group post photo model
const classGroupPostPhotoModel = require(`${__dirname}/../../model/classModel/classGroupPostPhotoModel`);

// Import the handler factory
const factory = require(`${__dirname}/../handlerFactory`);

// The function for getting all class group post photo items
exports.getAllClassGroupPostPhotoItems = factory.getAllDocuments(
  classGroupPostPhotoModel
);

// The function to create new class group post photo item
exports.createNewClassGroupPostPhotoItem = factory.createDocument(
  classGroupPostPhotoModel
);

// The function for deleting a class group post photo item
exports.deleteClassGroupPostPhotoItem = factory.deleteOne(
  classGroupPostPhotoModel
);
