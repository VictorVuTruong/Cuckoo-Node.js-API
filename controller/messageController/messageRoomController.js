// Import the message room model
const MessageRoom = require(`${__dirname}/../../model/messageModel/messageRoomModel`);

// Import catchAsync
const catchAsync = require(`${__dirname}/../../utils/catchAsync`);

// Import the handler factory
const factory = require(`${__dirname}/../handlerFactory`);

// This middleware is used for getting all message rooms
exports.getAllMessageRooms = factory.getAllDocuments(MessageRoom);

// This middleware is used for creating new message room
exports.createNewMessageRoom = factory.createDocument(MessageRoom);

// This middleware is used for getting all message rooms where the specified user is in
exports.getAllMessageRoomsOfUser = catchAsync(
  async (request, response, next) => {
    // Reference the database to get all message rooms where the user is in
    const arrayOfMessageRooms = await MessageRoom.find({
      $or: [{ user1: request.query.userId }, { user2: request.query.userId }],
    });

    // Return response to the client (array of message rooms)
    response.status(200).json({
      status: "success",
      data: arrayOfMessageRooms,
    });
  }
);

// The middleware to get chat room id between the 2 specified users
exports.getMessageRoomIdBetween2Users = catchAsync(
  async (request, response, next) => {
    // Reference the database to get chat room id which include the 2 specified users
    const chatRoomOf2Users = await MessageRoom.find({
      $or: [
        {
          user1: request.query.user1,
          user2: request.query.user2,
        },
        {
          user1: request.query.user2,
          user2: request.query.user1,
        },
      ],
    });

    if (chatRoomOf2Users.length === 0) {
      // Return response to the client app (chat room info which include the 2 spefied user)
      response.status(200).json({
        status: "empty",
        data: [],
      });
    } else {
      // Return response to the client app (chat room info which include the 2 spefied user)
      response.status(200).json({
        status: "success",
        data: chatRoomOf2Users[0],
      });
    }
  }
);
