const { request, response } = require("express");

// Import the message photo model
const messagePhotoModel = require(`${__dirname}/../../model/messageModel/messagePhotoModel`);

// Import the message model
const messageModel = require(`${__dirname}/../../model/messageModel/messageModel`);

// Import the message room model
const MessageRoom = require(`${__dirname}/../../model/messageModel/messageRoomModel`);

// Import catchAsync
const catchAsync = require(`${__dirname}/../../utils/catchAsync`);

// Import the handler factory
const factory = require(`${__dirname}/../handlerFactory`);

// Imports the Google Cloud client library
const { Storage } = require("@google-cloud/storage");

// Storage object
let storage = new Storage({
  keyFilename: `${__dirname}/../../HBTGram-229b40c05d35.json`,
});

// The function to get all message photo
exports.getAllMessagePhotos = factory.getAllDocuments(messagePhotoModel);

// The function to create new message photo
exports.createNewMessagePhoto = factory.createDocument(messagePhotoModel);

// The function to delete a message photo
exports.deleteMessagePhoto = factory.deleteOne(messagePhotoModel);

// The function to get message photos between the users
exports.getMessagePhotosBetweenUsers = catchAsync(
  async (request, response, next) => {
    // Array of message id to get image
    const arrayOfMessageId = [];

    // Array of message photo URL
    const arrayOfMessagePhotoURL = [];

    // Get user id of user 1
    const user1Id = request.query.user1Id;

    // Get user id of user 2
    const user2Id = request.query.user2Id;

    // Reference the database to get all message rooms where the 2 users are in
    const arrayOfMessageRooms = await MessageRoom.find({
      $or: [
        {
          user1: user1Id,
          user2: user2Id,
        },
        {
          user1: user2Id,
          user2: user1Id,
        },
      ],
    });

    // Get chat room id in which 2 users are in
    const chatRoomIdOf2Users = arrayOfMessageRooms[0]._id;

    // Get messages in the found message room id (just take the message with content "image")
    const arrayOfMessages = await messageModel.find({
      chatRoomId: chatRoomIdOf2Users,
      content: "image",
    });

    // Loop through the list of message objects to get their message ids
    arrayOfMessages.forEach((messagePhoto) => {
      // Get the message id and add to array
      arrayOfMessageId.push(messagePhoto._id);
    });

    // Reference the message photo collection to get list of message photo URL
    const arrayOfMessagePhotos = await messagePhotoModel.find({
      messageId: arrayOfMessageId,
    });

    // Loop through the list of message photo objects to get message photo URL
    arrayOfMessagePhotos.forEach((messagePhoto) => {
      arrayOfMessagePhotoURL.push(messagePhoto.imageURL);
    });

    console.log(arrayOfMessagePhotos)

    // Return array of message photos to the user
    response.status(200).json({
      status: "Done",
      data: arrayOfMessagePhotos,
    });
  }
);

// The function to get message photos of chat room
exports.getMessagePhotosOfChatRoom = catchAsync(
  async (request, response, next) => {
    // Array of message id to get image
    const arrayOfMessageId = [];

    // Get chat room id
    const chatRoomId = request.query.chatRoomId;

    // Array of message photo URL
    const arrayOfMessagePhotoURL = [];

    // Get messages in the found message room id (just take the message with content "image")
    const arrayOfMessages = await messageModel.find({
      chatRoomId: chatRoomId,
      content: "image",
    });

    // Loop through the list of message objects to get their message ids
    arrayOfMessages.forEach((messagePhoto) => {
      // Get the message id and add to array
      arrayOfMessageId.push(messagePhoto._id);
    });

    // Reference the message photo collection to get list of message photo URL
    const arrayOfMessagePhotos = await messagePhotoModel.find({
      messageId: arrayOfMessageId,
    });

    // Loop through the list of message photo objects to get message photo URL
    arrayOfMessagePhotos.forEach((messagePhoto) => {
      arrayOfMessagePhotoURL.push(messagePhoto.imageURL);
    });

    // Return array of message photos to the user
    response.status(200).json({
      status: "Done",
      data: arrayOfMessagePhotos,
    });
  }
);

// The function to delete a message photo based on message id
exports.deleteMessagePhotoBasedOnMessageId = catchAsync(async (messageIdParam) => {
  // Reference the database to get message photo object of message with specified message id
  const messagePhotoObject = await messagePhotoModel.findOne({
    messageId: messageIdParam
  })

  // Call the function to delete the message photo of message with specified message id
  deletePhotoBasedOnURL(messagePhotoObject.imageURL, "messagePhotos")
})

// The function to delete a photo based on its URL
function deletePhotoBasedOnURL(imageURL, parentFolder) {
  // Index of the start point of the image name
  var startOfName = imageURL.indexOf("%2F") + 3;

  // Index of the end point of the image name
  var endOfName = imageURL.indexOf("?");

  // Image name
  let imageName = imageURL.substring(startOfName, endOfName);

  // Storage bucket
  var bucket = storage.bucket("hbtgram.appspot.com");

  // Start deleting the found image
  bucket.deleteFiles(
    {
      prefix: `${parentFolder}/${imageName}`,
    },
    function (error) {
      if (!error) {
        // If there is no error, return 0
        return 0;
      } else {
        // If there is an error, return 1
      }
    }
  );
}