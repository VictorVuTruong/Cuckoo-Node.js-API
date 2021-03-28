// Require the mongoose package
const mongoose = require("mongoose");

// Import the dotnev module
const dotnev = require("dotenv");

// For the socket
var os = require("os");

// Firebase admin SDK
var admin = require("firebase-admin");

// Private key
var serviceAccount = require(`${__dirname}/hbtgram-firebase-adminsdk-zv1hs-15f7eaf4f4.json`);

// Import the socketio in order to listen to real time app update
const socketio = require("socket.io");
const { request, response } = require("express");
const { use } = require("./app");

// Import this one in order to catch error in any async functions
const catchAsync = require(`${__dirname}/utils/catchAsync`);

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

    // Initialize Firebase Admin SDK
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      databaseURL: "https://hbtgram.firebaseio.com",
      storageBucket:
        "https://console.firebase.google.com/project/hbtgram/storage/hbtgram.appspot.com/files",
    });
  });

// Import the app
const app = require(`${__dirname}/app`);

// Import the notification socket model
const notificationSocketModel = require(`${__dirname}/model/notificationSocketModel/notificationSocketModel`);

// Import the post model
const cuckooPostModel = require(`${__dirname}/model/cuckooModel/cuckooPostModel`);

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
io.on(
  "connection",
  catchAsync(async (socket) => {
    // When user establish connection with the server, they will get the socket id
    console.log(`Connection: SocketId = ${socket.id}`);

    /********************** THESE ARE FOR THE POST DETAIL SERVER  ************************/
    // Listen to evenr of when user jump into the post detail room
    socket.on(
      "jumpInPostDetailRoom",
      catchAsync(async (data) => {
        // In some cases, data is already in JSON format, we don't have to do anything. Hence, check if
        let postId;
        if (data.postId != undefined) {
          // Get the post id
          postId = data.postId;
        } // If data is not in JSON, parse it first
        else {
          // Parse the data
          const parsedData = JSON.parse(data);

          // Get the post id
          postId = parsedData.postId;
        }

        // Let user join in the post detail room
        socket.join(postId);
      })
    );

    // Listen to event of when new comment is created
    socket.on(
      "newComment",
      catchAsync(async (data) => {
        let commentObject;

        // Check to see if we need to parse the data or not
        if (data.commentId != undefined) {
          // If it is already in JSON, don't parse it
          commentObject = data;
        } // Otherwise, parse it
        else {
          commentObject = JSON.parse(data);
        }

        //***************** Reference the database to get info of writer of the post that get commented to send notification ***************/
        // Get post id of the post that get commented
        const postIdGetCommented = commentObject.postId;

        // Reference the database to get post info of the post with the specified id
        const postObjectGetCommented = await cuckooPostModel.findOne({
          _id: postIdGetCommented,
        });

        // Get user id of the user who created that post
        const postWriterUserId = postObjectGetCommented.writer;

        // Call the function to send notification for the post writer
        await sendNotification(
          postWriterUserId,
          "Some one just commented on your post",
          "Go and check out who just commented on your post"
        );
        //***************** End reference the database to get info of writer of the post that get commented to send notification ***************/

        // Create the new comment object based on the received comment object from the client app
        const commentObjectToEmit = {
          _id: commentObject.commentId,
          writer: commentObject.writer,
          content: commentObject.content,
        };

        // Emit the event and let the client app know that new comment was created
        socket.broadcast
          .to(commentObject.postId)
          .emit("updateComment", commentObjectToEmit);
      })
    );

    // Listen to event of when image is sent as a comment
    socket.on(
      "imageSentAsComment",
      catchAsync(async (data) => {
        let commentObject;

        // Check to see if we need to parse the data or not
        if (data.commentId != undefined) {
          // If it is already in JSON, don't parse it
          commentObject = data;
        } // Otherwise, parse it
        else {
          commentObject = JSON.parse(data);
        }

        // Create new comment objecct based on the received comment object from the client app
        const commentObjectToEmit = {
          _id: commentObject.commentId,
          writer: commentObject.writer,
          content: commentObject.content,
        };

        // Emit the event and let the client app (including the sender know that new comment with photo was created)
        io.to(commentObject.postId).emit(
          "updateCommentWithPhoto",
          commentObjectToEmit
        );
      })
    );
    /********************** END POST DETAIL SERVER  ************************/

    /********************** THESE ARE FOR THE CHAT SERVER  ************************/
    // Listen to event listener of when user jump into the chat room
    socket.on(
      "jumpInChatRoom",
      catchAsync(async (data) => {
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
      })
    );

    // Listen to event listener of when user send message to the database
    socket.on(
      "newMessage",
      catchAsync(async (data) => {
        let messageData;

        // If the data is already in JSON format, don't need to parse it
        if (data.sender != undefined) {
          // Get data of the message
          messageData = data;
        } // Otherwise, parse the data first
        else {
          // Get data of the message
          messageData = JSON.parse(data);
        }

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
          _id: messageId,
        };

        // Call the function to send notification to the message receiver
        await sendNotification(
          messageReceiver,
          "Someone just messaged you",
          "Go and check out who just ping you"
        );

        // Emit this event so that the client app will get update when new message is added
        socket.broadcast
          .to(`${chatRoomId}`)
          .emit("updateMessage", receivedMessageObject);
      })
    );

    // Listen to event of when user is typing message
    socket.on(
      "isTyping",
      catchAsync(async (data) => {
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
      })
    );

    // Listen to event of when user is done typing message
    socket.on(
      "isDoneTyping",
      catchAsync(async (data) => {
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
      })
    );

    // Listen to event of when one of the user send photo as a message
    socket.on(
      "userSentPhotoAsMessage",
      catchAsync(async (data) => {
        let messageData;
        // If the data is already in JSON format, don't need to parse it
        if (data.sender != undefined) {
          // Get data of the message
          messageData = data;
        } // Otherwise, parse the data first
        else {
          // Get data of the message
          messageData = JSON.parse(data);
        }

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
          _id: messageId,
        };

        // Emit this event so that the client app will get update when new message is added
        io.to(`${chatRoomId}`).emit(
          "updateMessageWithPhoto",
          receivedMessageObject
        );
      })
    );
    /********************** END CHAT SERVER  ************************/

    /********************** FOLLOWING SERVER ************************/
    // Listen to event of when new follow object is created
    socket.on(
      "newFollow",
      catchAsync(async (data) => {
        let followData;

        // If the data is already in JSON format, don't need to parse it
        if (data.sender != undefined) {
          // Get data of the message
          followData = data;
        } // Otherwise, parse the data first
        else {
          // Get data of the message
          followData = JSON.parse(data);
        }

        // Get user id of the follower
        const follower = followData.follower;

        // Get user id of the user that get followed
        const followedUser = followData.followedUser;

        console.log(followedUser);

        // Call the function to send notification to the follow receiver
        await sendNotification(
          followedUser,
          "Someone just started following you",
          "Go and check out who just followed you"
        );
      })
    );
    /********************** END FOLLOWING SERVER ************************/

    /********************** THESE ARE FOR THE NOTIFICATIONS SERVER ************************/
    // Listen to event listener of when user jump into the notification room
    socket.on(
      "jumpInNotificationRoom",
      catchAsync(async (data) => {
        // User id
        var userId = "";

        // Socket id of the user
        var socketId = "";

        // In some cases, data is already in JSON format, we don't have to do anything. Hence, check it
        if (data.userId != undefined) {
          // Get user id of user that has just joined the notification room
          userId = data.userId;

          // Get socket id of the user
          socketId = data.socketId;
        } // If data is not JSON, parse it first
        else {
          // Parse the data if needed
          const parsedData = JSON.parse(data);

          // Get the user id
          userId = parsedData.userId;

          // Get socket id of the user
          socketId = parsedData.socketId;
        }

        // Let user join in the notification room
        socket.join("notificationRoom");

        console.log(socketId)

        // Reference the database to check and see if specified socket id has been registered or not
        const notificationSocketObjectOfSocketId = await notificationSocketModel.findOne(
          {
            user: userId,
            socketId: socketId,
          }
        );

        // If the notification socket object is null, it means the specified socket id has not been registered, create one
        // If the socket id has been registered, don't do anything
        if (notificationSocketObjectOfSocketId == null) {
          // Create notification socket for the socket id
          await notificationSocketModel.create({
            user: userId,
            socketId: socketId,
          });
        }
      })
    );
    /********************** END NOTIFICATIONS SERVER ************************/
  })
);

// The function to send notification
async function sendNotification(userId, title, content) {
  // Reference the database to get list of notification sockets for the specified user
  const notificationSockets = await notificationSocketModel.find({
    user: userId,
  });

  // Loop through list of notification sockets to get the notification socket id
  notificationSockets.forEach((notificationSocket) => {
    // Get the socket id
    const socketId = notificationSocket.socketId;

    // Create the notification
    var message = {
      notification: {
        title: title,
        body: content,
      },
      token: socketId,
    };

    // Send the notification
    admin
      .messaging()
      .send(message)
      .then((responseInner) => {
        console.log("Message sent", responseInner);
      })
      .catch((error) => {
        console.log("Something went wrong", error);
      });
  });
}
