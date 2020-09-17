const path = require("path");

// Import express
const express = require("express");

// Create the app
const app = express();

// Include the cookie parser
const cookieParser = require("cookie-parser");

// Router for the user
const userRouter = require(`${__dirname}/routes/userRoute/userRoutes`);

// Router for the allowed users
const allowedUserRouter = require(`${__dirname}/routes/userRoute/allowedUserRoutes`);

// Router for the class group chat
const classGroupChatRouter = require(`${__dirname}/routes/classRoute/classGroupChatRoutes`);

// Router for the class dashboard
const classDashboardRouter = require(`${__dirname}/routes/classRoute/classDashboardRoutes`);

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
// Use the userRouter as middleware. This can be known as parent route for the user
app.use("/api/v1/users", userRouter);

// Use the allowedUserRouter as middleware. This can be known as parent route for the allowed users
app.use("/api/v1/allowedUsers", allowedUserRouter);

// Use the classGroupChatRouter as middleware. This is also parent route for class group chat
app.use("/api/v1/classGroupChat", classGroupChatRouter);

// Use the classDashboardRouter as middleware
app.use("/api/v1/classDashboard", classDashboardRouter);

// Export the app so that the server file can user it
module.exports = app;
