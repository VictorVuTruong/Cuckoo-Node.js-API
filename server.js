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
    // Get chat room id of the user who joined the chat room
    const chatRoomData = JSON.parse(data);

    // Get chat room id
    const chatRoomId = chatRoomData.chatRoomId;

    // Let user join in the room name
    socket.join(`${chatRoomId}`);
  });

  // Listen to event listener of when user send message to the database
  socket.on("newMessage", async (data) => {
    // Get data of the message
    const messageData = JSON.parse(data);

    // Get sender of the message
    const messageSender = messageData.sender;

    // Get reveiver of the message
    const messageReceiver = messageData.receiver;

    // Get content of the message
    const messageContent = messageData.content;

    // Get chat room id of the message
    const chatRoomId = messageData.chatRoomId;

    // Create the received message object out of those info
    const receivedMessageObject = {
      sender: messageSender,
      receiver: messageReceiver,
      content: messageContent,
      chatRoomId: chatRoomId,
    };

    // Emit this event so that the client app will get update when new message is added
    socket.broadcast
      .to(`${chatRoomId}`)
      .emit("updateMessage", JSON.stringify(receivedMessageObject));
  });
});
