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

// The function to get all message photo
exports.getAllMessagePhotos = factory.getAllDocuments(messagePhotoModel);

// The function to create new message photo
exports.createNewMessagePhoto = factory.createDocument(messagePhotoModel);

// The function to delete a message photo
exports.deleteMessagePhoto = factory.deleteOne(messagePhotoModel);

// The function to get message photos between the users
exports.getMessagePhotosBetweenUsers = catchAsync(
  async (request, response, next) => {
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
    const arrayOfMessagePhotos = await messageModel.find({
      chatRoomId: chatRoomIdOf2Users,
      content: "image",
    });

    // Return array of message photos to the user
    response.status(200).json({
      status: "Done",
      data: arrayOfMessagePhotos,
    });
  }
);
