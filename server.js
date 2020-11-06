// Require the mongoose package
const mongoose = require("mongoose");

// Import the dotnev module
const dotnev = require("dotenv");

// Import the socketio in order to listen to real time app update
const socketio = require("socket.io");

// Handle all uncaught exceptions
process.on("uncaughtException", (error) => {
  console.log("Uncaught exception: Shutting down the app");
  console.log(error.name, error.message);

  // Exit the application
  process.exit(1);
});

// Read variable from a file and save it as environment variable
dotnev.config({ path: `${__dirname}/config.env` });

// Enter the password and connect to the DB
const DB = process.env.DATABASE.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD
);
mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then((connection) => {
    console.log("Connected");
  });

// Import the app
const app = require(`${__dirname}/app`);

// Start the server
// Port number
const port = process.env.PORT || 3000;
//const port = 3000;
const server = app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});

// Handle all unhandled all promise rejections
process.on("unhandledRejection", (error) => {
  console.log("Unhandled rejection: Shutting down the app");
  console.log(error.name, error.message);

  // Close the server and shut down the application
  server.close(() => {
    // Exit the application
    process.exit(1);
  });
});

// Chat server
var io = socketio.listen(server);

// Create event listeners for different things that can happen during chat
io.on("connection", async (socket) => {
  // When user establish connection with the server, they will get the socket id
  console.log(`Connection: SocketId = ${socket.id}`);

  // Listen to event listener of when user jump into the chat room
  socket.on("jumpInChatRoom", async (data) => {
    // In some cases, data is already in JSON format, we don't have to do anything. Hence, check it
    if (data.chatRoomId != undefined) {
      // Get chat room id
      const chatRoomId = data.chatRoomId;

      // Let user join in the room name
      socket.join(`${chatRoomId}`);
    } // If data is not JSON, parse it first
    else {
      // Get chat room id of the user who joined the chat room
      const chatRoomData = JSON.parse(data);

      // Get chat room id
      const chatRoomId = chatRoomData.chatRoomId;

      // Let user join in the room name
      socket.join(`${chatRoomId}`);
    }
  });

  // Listen to event listener of when user send message to the database
  socket.on("newMessage", async (data) => {
    // If the data is already in JSON format, don't need to parse it
    if (data.sender != undefined) {
      // Get data of the message
      const messageData = data;

      // Get sender of the message
      const messageSender = messageData.sender;

      // Get reveiver of the message
      const messageReceiver = messageData.receiver;

      // Get content of the message
      const messageContent = messageData.content;

      // Get message id of the message
      const messagId = messageData.messageId;

      // Get chat room id of the message
      const chatRoomId = messageData.chatRoomId;

      // Create the received message object out of those info
      const receivedMessageObject = {
        sender: messageSender,
        receiver: messageReceiver,
        content: messageContent,
        chatRoomId: chatRoomId,
        _id: messagId,
      };

      // Emit this event so that the client app will get update when new message is added
      socket.broadcast
        .to(`${chatRoomId}`)
        .emit("updateMessage", receivedMessageObject);
    } // Otherwise, parse the data first
    else {
      // Get data of the message
      const messageData = JSON.parse(data);

      // Get sender of the message
      const messageSender = messageData.sender;

      // Get reveiver of the message
      const messageReceiver = messageData.receiver;

      // Get content of the message
      const messageContent = messageData.content;

      // Get message id of the message
      const messagId = messageData.messageId;

      // Get chat room id of the message
      const chatRoomId = messageData.chatRoomId;

      // Create the received message object out of those info
      const receivedMessageObject = {
        sender: messageSender,
        receiver: messageReceiver,
        content: messageContent,
        chatRoomId: chatRoomId,
        messageId: messagId,
      };

      // Emit this event so that the client app will get update when new message is added
      socket.broadcast
        .to(`${chatRoomId}`)
        .emit("updateMessage", receivedMessageObject);
    }
  });

  // Listen to event of when user is typing message
  socket.on("isTyping", async (data) => {
    // Check to see if we need to parse the data or not
    if (data.chatRoomId != undefined) {
      // Get the chat room id
      const chatRoomData = data;

      // Emit the typing event to other user in the chat room
      socket.broadcast.to(chatRoomData.chatRoomId).emit("typing");
    } // Otherwise, parse the data first
    else {
      // Get the chat room id by parsing the incoming data
      const chatRoomData = JSON.parse(data);

      // Emit the typing event to other user in the chat room
      socket.broadcast.to(chatRoomData.chatRoomId).emit("typing");
    }
  });

  // Listen to event of when user is done typing message
  socket.on("isDoneTyping", async (data) => {
    // Check to see if we need to parse the data or not
    if (data.chatRoomId != undefined) {
      // Get the chat room id
      const chatRoomData = data;

      // Emit the typing event to other user in the chat room
      socket.broadcast.to(chatRoomData.chatRoomId).emit("doneTyping");
    } // Otherwise, parse the data first
    else {
      // Get the chat room id by parsing the incoming data
      const chatRoomData = JSON.parse(data);

      // Emit the typing event to other user in the chat room
      socket.broadcast.to(chatRoomData.chatRoomId).emit("doneTyping");
    }
  });

  // Listen to event of when one of the user send photo as a message
  socket.on("userSentPhotoAsMessage", async (data) => {
    // If the data is already in JSON format, don't need to parse it
    if (data.sender != undefined) {
      // Get data of the message
      const messageData = data;

      // Get sender of the message
      const messageSender = messageData.sender;

      // Get reveiver of the message
      const messageReceiver = messageData.receiver;

      // Get content of the message
      const messageContent = messageData.content;

      // Get message id of the message
      const messageId = messageData.messageId;

      // Get chat room id of the message
      const chatRoomId = messageData.chatRoomId;

      // Create the received message object out of those info
      const receivedMessageObject = {
        sender: messageSender,
        receiver: messageReceiver,
        content: messageContent,
        chatRoomId: chatRoomId,
        messageId: messageId,
      };

      console.log(receivedMessageObject);

      // Emit this event so that the client app will get update when new message is added
      io.to(`${chatRoomId}`).emit(
        "updateMessageWithPhoto",
        receivedMessageObject
      );
    } // Otherwise, parse the data first
    else {
      // Get data of the message
      const messageData = JSON.parse(data);

      // Get sender of the message
      const messageSender = messageData.sender;

      // Get reveiver of the message
      const messageReceiver = messageData.receiver;

      // Get content of the message
      const messageContent = messageData.content;

      // Get message id of the message
      const messageId = messageData.messageId;

      // Get chat room id of the message
      const chatRoomId = messageData.chatRoomId;

      // Create the received message object out of those info
      const receivedMessageObject = {
        sender: messageSender,
        receiver: messageReceiver,
        content: messageContent,
        chatRoomId: chatRoomId,
        messageId: messageId,
      };

      console.log(receivedMessageObject);

      // Emit this event so that the client app will get update when new message is added
      io.to(`${chatRoomId}`).emit(
        "updateMessageWithPhoto",
        receivedMessageObject
      );
    }
  });
});
