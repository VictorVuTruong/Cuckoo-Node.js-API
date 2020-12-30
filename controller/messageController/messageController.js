// Import the message model
const Message = require(`${__dirname}/../../model/messageModel/messageModel`);

// Import the message room model
const MessageRoom = require(`${__dirname}/../../model/messageModel/messageRoomModel`);

// Import catchAsync
const catchAsync = require(`${__dirname}/../../utils/catchAsync`);

// Import the AppError
const AppError = require(`${__dirname}/../../utils/appError`);

// Import the handler factory
const factory = require(`${__dirname}/../handlerFactory`);

// This middleware is used for getting all messages
exports.getAllMessages = factory.getAllDocuments(Message);

// This middleware is used for creating new message
exports.createNewMessage = catchAsync(async (request, response, next) => {
  // Reference the database to get room id which include the 2 users
  const arrayOfMessageRoom = await MessageRoom.find({
    $or: [
      {
        user1: request.body.sender,
        user2: request.body.receiver,
      },
      {
        user1: request.body.receiver,
        user2: request.body.sender,
      },
    ],
  });

  // Get chat room id between the 2 users
  const chatRoomId = arrayOfMessageRoom[0]._id;

  // Create the new chat message based on the provided info from request body and message room that just created
  const createdMessage = await Message.create({
    sender: request.body.sender,
    receiver: request.body.receiver,
    content: request.body.content,
    chatRoomId: chatRoomId,
  });

  // Return response to the client
  // Also need to return chat room id between the 2 users
  response.status(201).json({
    status: "Message created",
    data: createdMessage,
  });
});

// This middleware is to check if there exist chat room between sender and receiver of the message or not
// if not, create one for both of them
exports.checkMessageRoom = catchAsync(async (request, response, next) => {
  // Reference the database and search to see if is there any messages between the 2 users or not
  const arrayOfMessages = await Message.find({
    $or: [
      {
        sender: request.body.sender,
        receiver: request.body.receiver,
      },
      {
        sender: request.body.receiver,
        receiver: request.body.sender,
      },
    ],
  });

  try {
    // Check the array of messages to see if it's empty or not
    // If the array is empty, it means that there is no chat room between the sender and the receiver yet
    // create one for them
    if (arrayOfMessages.length === 0) {
      await MessageRoom.create({
        user1: request.body.sender,
        user2: request.body.receiver,
      });
    }

    // Go to the next middleware
    next();
  } catch (error) {
    response.status(500).json({
      status: "failed",
      message: "Error occur while creating new message chat room",
      error: error,
    });
  }
});

// This middleware is used for getting all messages based on the or condition
exports.getAllMessagesOrCondition = factory.getAllDocumentsOrQuery(Message);

// This middleware is used for getting latest message of the message room
exports.getLatestMessageOfMessageRoom = catchAsync(
  async (request, response, next) => {
    // Array of messages of the specified message room
    const arrayOfMessages = await Message.find({
      chatRoomId: request.query.chatRoomId,
    });

    // If there is no message belong to the specified message room, return error to the client
    if (!arrayOfMessages) {
      return next(
        new AppError(
          "There is message belong to the specified message room",
          404
        )
      );
    }

    // Return response to the client (latest message in the message room)
    response.status(200).json({
      status: "success",
      data: arrayOfMessages[arrayOfMessages.length - 1],
    });
  }
);
