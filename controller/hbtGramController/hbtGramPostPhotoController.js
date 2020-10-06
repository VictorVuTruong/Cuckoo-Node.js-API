// Import the hbt gram post photo model
const hbtGramPostPhotoModel = require(`${__dirname}/../../model/hbtGramModel/hbtGramPostPhotoModel`);

// Import the handler factory
const factory = require(`${__dirname}/../handlerFactory`);

// The function to get all hbt gram post photo
exports.getAllHBTGramPostPhotos = factory.getAllDocuments(
    hbtGramPostPhotoModel
);

// The function to create new hbt gram post photo
exports.createNewHBTGramPostPhoto = factory.createDocument(
    hbtGramPostPhotoModel
);

// The function to delete a hbt gram post photo
exports.deleteHBTGramPostPhoto = factory.deleteOne(hbtGramPostPhotoModel);