// Immport the class group chat message model
const ClassGroupChatMessage = require(`${__dirname}/../../model/classModel/classGroupChatModel`);

// Import the handler factory
const factory = require(`${__dirname}/../handlerFactory`);

// The function for getting all class group chat messages
exports.getAllClassGroupChatMessages = factory.getAllDocuments(
  ClassGroupChatMessage
);

// The function for creating new class group chat message
exports.createNewClassGroupChatMessage = factory.createDocument(
  ClassGroupChatMessage
);

// The function for deleting a message
exports.deleteClassGroupChatMessage = factory.deleteOne(ClassGroupChatMessage);
