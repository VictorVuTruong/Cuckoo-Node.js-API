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

//--------------CLASS ROUTERS --------------
// Router for the class group chat
const classGroupChatRouter = require(`${__dirname}/routes/classRoute/classGroupChatRoutes`);

// Router for the class dashboard
const classDashboardRouter = require(`${__dirname}/routes/classRoute/classDashboardRoutes`);

// Router for the class discussion board
const classDiscussionBoardRouter = require(`${__dirname}/routes/classRoute/classDiscussionBoardRoutes`);

// Router for the class course info
const classCourseInfoRouter = require(`${__dirname}/routes/classRoute/classCourseInfoRoutes`);

// Router for the class group post
const classGroupPostRouter = require(`${__dirname}/routes/classRoute/classGroupPostRoutes`);

// Router for the class group post comments
const classGroupPostCommentRouter = require(`${__dirname}/routes/classRoute/classGroupPostCommentRoutes`);

// Router for the class group post likes
const classGroupPostLikeRouter = require(`${__dirname}/routes/classRoute/classGroupPostLikeRoutes`);

// Router for the class group post photos
const classGroupPostPhotoRouter = require(`${__dirname}/routes/classRoute/classGroupPostPhotoRoutes`);

//--------------CONFESSION ROUTERS --------------
// Router for the confession posts
const confessionPostRouter = require(`${__dirname}/routes/confessionRoute/confessionPostRoutes`);

// Router for the confession post comments
const confessionPostCommentRouter = require(`${__dirname}/routes/confessionRoute/confessionPostCommentRoutes`);

// Router for the confession post likes
const confessionPostLikeRouter = require(`${__dirname}/routes/confessionRoute/confessionPostLikeRoutes`);

// Router for the confession post photos
const confessionPostPhotoRouter = require(`${__dirname}/routes/confessionRoute/confessionPostPhotoRoutes`);

//--------------HBTGRAM ROUTERS --------------
// Router for the hbt gram posts
const hbtGramPostRouter = require(`${__dirname}/routes/hbtGramRoute/hbtGramPostRoutes`);

// Router for the hbt gram post comments
const hbtGramPostCommentRouter = require(`${__dirname}/routes/hbtGramRoute/hbtGramPostCommentRoutes`);

// Router for the hbt gram post likes
const hbtGramPostLikeRouter = require(`${__dirname}/routes/hbtGramRoute/hbtGramPostLikeRoutes`);

// Router for the hbt gram post photos
const hbtGramPostPhotoRouter = require(`${__dirname}/routes/hbtGramRoute/hbtGramPostPhotoRoutes`);

// Router for the hbt gram post comment photos
const hbtGramPostCommentPhotoRouter = require(`${__dirname}/routes/hbtGramRoute/hbtGramPostCommentPhotoRoutes`);

// Router for the hbt gram follow
const hbtGramFollowRouter = require(`${__dirname}/routes/hbtGramRoute/hbtGramFollowRoutes`);

// Router for the hbt gram user interaction
const hbtGramUserInteractionRouter = require(`${__dirname}/routes/hbtGramRoute/hbtGramUserInteractionRoutes`);

// Router for the hbt gram user like interaction
const hbtGramUserLikeInteractionRoutes = require(`${__dirname}/routes/hbtGramRoute/hbtGramUserLikeInteractionRoutes`);

// Router for the hbt gram user comment interaction
const hbtGramUserCommentInteractionRoutes = require(`${__dirname}/routes/hbtGramRoute/hbtGramUserCommentInteractionRoutes`);

// Router for the hbt gram account stats
const hbtGramAccountStatsRoutes = require(`${__dirname}/routes/hbtGramRoute/hbtGramAccountStatsRoutes`);

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

//-------------- CREATE ROUTES FOR THE CLASS --------------
// Use the classGroupChatRouter as middleware. This is also parent route for class group chat
app.use("/api/v1/classGroupChat", classGroupChatRouter);

// Use the classDashboardRouter as middleware
app.use("/api/v1/classDashboard", classDashboardRouter);

// Use the classDiscussionBoardRouter as middleware
app.use("/api/v1/classDiscussionBoard", classDiscussionBoardRouter);

// Use the classCourseInfoRouter as middleware
app.use("/api/v1/classCourseInfo", classCourseInfoRouter);

// Use the classGroupPostRouter as middleware
app.use("/api/v1/classGroupPost", classGroupPostRouter);

// Use the classGroupPostCommentRouter as middleware
app.use("/api/v1/classGroupPostComment", classGroupPostCommentRouter);

// Use the classGroupPostLikeRouter as middleware
app.use("/api/v1/classGroupPostLike", classGroupPostLikeRouter);

// Use the classGroupPostPhotoRouter as middleware
app.use("/api/v1/classGroupPostPhoto", classGroupPostPhotoRouter);

//-------------- CREATE ROUTES FOR THE CONFESSION --------------
// Use the confessionPostRouter as middleware
app.use("/api/v1/confessionPost", confessionPostRouter);

// Use the confessionPostCommentRouter as middleware
app.use("/api/v1/confessionPostComment", confessionPostCommentRouter);

// Use the confessionPostLikeRouter as middleware
app.use("/api/v1/confessionPostLike", confessionPostLikeRouter);

// Use the confessionPostPhotoRouter as middleware
app.use("/api/v1/confessionPostPhoto", confessionPostPhotoRouter);

//-------------- CREATE ROUTES FOR THE HBT GRAM --------------
// Use the hbtGramPostRouter as middleware
app.use("/api/v1/hbtGramPost", hbtGramPostRouter);

// Use the hbtGramPostCommentRouter as middleware
app.use("/api/v1/hbtGramPostComment", hbtGramPostCommentRouter);

// Use the hbtGramPostLikeRouter as middleware
app.use("/api/v1/hbtGramPostLike", hbtGramPostLikeRouter);

// Use the hbtGramPostPhotoRouter as middleware
app.use("/api/v1/hbtGramPostPhoto", hbtGramPostPhotoRouter);

// Use the hbtGramPostCommentPhotoRouter as middleware
app.use("/api/v1/hbtGramPostCommentPhoto", hbtGramPostCommentPhotoRouter);

// Use the hbtGramFollowRouter as middleware
app.use("/api/v1/hbtGramFollow", hbtGramFollowRouter);

// Use the hbtGramUserInteraction as middleware
app.use("/api/v1/hbtGramUserInteraction", hbtGramUserInteractionRouter);

// Use the hbtGramUserLikeInteraction
app.use("/api/v1/hbtGramUserLikeInteraction", hbtGramUserLikeInteractionRoutes);

// Use the hbtGramUserCommentInteraction
app.use(
  "/api/v1/hbtGramUserCommentInteraction",
  hbtGramUserCommentInteractionRoutes
);

// Use the hbtGramAccountStatsRoutes
app.use("/api/v1/hbtGramAccountStats", hbtGramAccountStatsRoutes);

//-------------- CREATE ROUTES FOR THE MESSAGE --------------
// Use the messageRouter as middleware
app.use("/api/v1/message", messageRouter);

// Use the messageRoomRouter as middleware
app.use("/api/v1/messageRoom", messageRoomRouter);

// Use the messagePhotoRouter as middleware
app.use("/api/v1/messagePhoto", messagePhotoRouter);

// Export the app so that the server file can user it
module.exports = app;
