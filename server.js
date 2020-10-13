// Require the mongoose package
const mongoose = require("mongoose");

// Import the dotnev module
const dotnev = require("dotenv");

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
