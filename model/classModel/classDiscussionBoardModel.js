// Require mongoose package
const mongoose = require("mongoose");

// Create schema for the new object which will be added to the database for the class discussion board
const classDiscussionBoardSchema = new mongoose.Schema({
  content: {
    type: String,
    required: [true, "Content must not be blank"],
  },
  orderInCollection: {
    type: Number,
  },
  subject: {
    type: String,
    required: [true, "Subject name must not be blank"],
  },
  writer: {
    type: String,
    required: [true, "Title must not be blank"],
  },
  classCode: {
    type: String,
    required: [true, "Class code must not be blank"],
  },
});

// Run this middleware before saving the discussion board item to the database in order to fill up orderInCollection field
// with number of seconds since 1970
classDiscussionBoardSchema.pre("save", async function (next) {
  // Get current date and time
  let currentDateAndTime = new Date();

  // Get number of seconds since 1970
  let numOfSeconds = Math.floor(currentDateAndTime / 1000);

  // Set the orderInCollection property of this object to be number of seconds since 1970
  this.orderInCollection = numOfSeconds;

  // Go to the next middleware
  next();
});

// Create the class discussion board item based on the schema that we have just created
const ClassDiscussionBoard = mongoose.model(
  "ClassDiscussionBoard",
  classDiscussionBoardSchema
);

// Export the model
module.exports = ClassDiscussionBoard;
