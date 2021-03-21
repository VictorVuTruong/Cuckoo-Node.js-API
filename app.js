const path = require("path");

// Import express
const express = require("express");

// Create the app
const app = express();

// Include the cookie parser
const cookieParser = require("cookie-parser");

//--------------USER ROUTERS --------------
// Router for the user
const userRouter = require(`${__dirname}/routes/userRoute/userRoutes`);

// Router for the allowed users
const allowedUserRouter = require(`${__dirname}/routes/userRoute/allowedUserRoutes`);

//-------------- MAIN ROUTERS --------------
// Router for the posts
const cuckooPostRouter = require(`${__dirname}/routes/cuckooMainRoute/cuckooPostRoutes`);

// Router for the post comments
const cuckooPostCommentRouter = require(`${__dirname}/routes/cuckooMainRoute/cuckooPostCommentRoutes`);

// Router for the post likes
const cuckooPostLikeRouter = require(`${__dirname}/routes/cuckooMainRoute/cuckooPostLikeRoutes`);

// Router for the post photos
const cuckooPostPhotoRouter = require(`${__dirname}/routes/cuckooMainRoute/cuckooPostPhotoRoutes`);

// Router for the post photo label
const cuckooPostPhotoLabelRouter = require(`${__dirname}/routes/cuckooMainRoute/cuckooPostPhotoLabelRoutes`);

// Router for the post comment photos
const cuckooPostCommentPhotoRouter = require(`${__dirname}/routes/cuckooMainRoute/cuckooPostCommentPhotoRoutes`);

// Router for the follow
const cuckooFollowRouter = require(`${__dirname}/routes/cuckooMainRoute/cuckooFollowRoutes`);

// Router for the user interaction
const cuckooUserInteractionRouter = require(`${__dirname}/routes/cuckooMainRoute/cuckooUserInteractionRoutes`);

// Router for the user like interaction
const cuckooUserLikeInteractionRoutes = require(`${__dirname}/routes/cuckooMainRoute/cuckooUserLikeInteractionRoutes`);

// Router for the user comment interaction
const cuckooUserCommentInteractionRoutes = require(`${__dirname}/routes/cuckooMainRoute/cuckooUserCommentInteractionRoutes`);

// Router for the account stats
const cuckooAccountStatsRoutes = require(`${__dirname}/routes/cuckooMainRoute/cuckooAccountStatsRoutes`);

// Router for the notifications
const cuckooNotificationRoutes = require(`${__dirname}/routes/cuckooMainRoute/cuckooNotificationRoutes`);

// Router for the friend recommendation
const cuckooFriendRecommendationRoutes = require(`${__dirname}/routes/cuckooMainRoute/cuckooFriendRecommendationRoutes`);

// Router for the video chat
const cuckooVideoChatRoutes = require(`${__dirname}/routes/cuckooMainRoute/cuckooVideoChatRoutes`);
//--------------MESSAGE ROUTERS --------------
// Router for the messages
const messageRouter = require(`${__dirname}/routes/messageRoute/messageRoutes`);

// Router for the message rooms
const messageRoomRouter = require(`${__dirname}/routes/messageRoute/messageRoomRoutes`);

// Router for the message photo
const messagePhotoRouter = require(`${__dirname}/routes/messageRoute/messagePhotoRoutes`);

// Use middleWare. This one is to work with JSON. This is also known as body parser
// THIS IS VERY IMPORTANT
// This body parser is used to read data from body into request.body
// Limit the body size to just 10kb.
app.use(express.json({ limit: "10kb" }));

// This one will parse the data from the cookie. After this line is executed, the request.cookies will be filled up with the cookie
// that was sent to the browser from the server
app.use(cookieParser());

// This one is to get data from the submitted HTML form
app.use(express.urlencoded({ extended: true, limit: "10kb" }));

// ROUTERS
//-------------- CREATE ROUTES FOR THE USER --------------
// Use the userRouter as middleware. This can be known as parent route for the user
app.use("/api/v1/users", userRouter);

// Use the allowedUserRouter as middleware. This can be known as parent route for the allowed users
app.use("/api/v1/allowedUsers", allowedUserRouter);

//-------------- CREATE ROUTES FOR THE MAIN ROUTES --------------
// Use the cuckooPostRouter as middleware
app.use("/api/v1/cuckooPost", cuckooPostRouter);

// Use the cuckooPostCommentRouter as middleware
app.use("/api/v1/cuckooPostComment", cuckooPostCommentRouter);

// Use the cuckooPostLikeRouter as middleware
app.use("/api/v1/cuckooPostLike", cuckooPostLikeRouter);

// Use the cuckooPostPhotoRouter as middleware
app.use("/api/v1/cuckooPostPhoto", cuckooPostPhotoRouter);

// User the cuckooPostPhotoLabelRouter as middleware
app.use("/api/v1/cuckooPostPhotoLabel", cuckooPostPhotoLabelRouter);

// Use the cuckooPostCommentPhotoRouter as middleware
app.use("/api/v1/cuckooPostCommentPhoto", cuckooPostCommentPhotoRouter);

// Use the cuckooFollowRouter as middleware
app.use("/api/v1/cuckooFollow", cuckooFollowRouter);

// Use the cuckooUserInteraction as middleware
app.use("/api/v1/cuckooUserInteraction", cuckooUserInteractionRouter);

// Use the cuckooUserLikeInteraction
app.use("/api/v1/cuckooUserLikeInteraction", cuckooUserLikeInteractionRoutes);

// Use the cuckooUserCommentInteraction
app.use(
  "/api/v1/cuckooUserCommentInteraction",
  cuckooUserCommentInteractionRoutes
);

// Use the cuckooAccountStatsRoutes
app.use("/api/v1/cuckooAccountStats", cuckooAccountStatsRoutes);

// Use the cuckooNotificationRoutes
app.use("/api/v1/cuckooNotifications", cuckooNotificationRoutes);

// Use the cuckooFriendRecommendationRoutes
app.use("/api/v1/cuckooFriendRecommendation", cuckooFriendRecommendationRoutes);

// Use the cuckooVideoChatRoutes
app.use("/api/v1/videoChat", cuckooVideoChatRoutes)

//-------------- CREATE ROUTES FOR THE MESSAGE --------------
// Use the messageRouter as middleware
app.use("/api/v1/message", messageRouter);

// Use the messageRoomRouter as middleware
app.use("/api/v1/messageRoom", messageRoomRouter);

// Use the messagePhotoRouter as middleware
app.use("/api/v1/messagePhoto", messagePhotoRouter);

// Export the app so that the server file can user it
module.exports = app;
