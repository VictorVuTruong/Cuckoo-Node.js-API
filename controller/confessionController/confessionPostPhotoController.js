// Import the confession post photo mode
const confessionPostPhotoModel = require(`${__dirname}/../../model/confessionModel/confessionPostPhotoModel`);

// Import the handler factory
const factory = require(`${__dirname}/../handlerFactory`);

// The function to get all confession post photo
exports.getAllConfessionPostPhotos = factory.getAllDocuments(
  confessionPostPhotoModel
);

// The function to create new confession post photo
exports.createNewConfessionPostPhoto = factory.createDocument(
  confessionPostPhotoModel
);

// The function to delete a confession post photo
exports.deleteConfessionPostPhoto = factory.deleteOne(confessionPostPhotoModel);
