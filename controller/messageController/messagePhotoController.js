// Import the message photo model
const messagePhotoModel = require(`${__dirname}/../../model/messageModel/messagePhotoModel`);

// Import the handler factory
const factory = require(`${__dirname}/../handlerFactory`);

// The function to get all message photo
exports.getAllMessagePhotos = factory.getAllDocuments(messagePhotoModel);

// The function to create new message photo
exports.createNewMessagePhoto = factory.createDocument(messagePhotoModel);

// The function to delete a message photo
exports.deleteMessagePhoto = factory.deleteOne(messagePhotoModel);
