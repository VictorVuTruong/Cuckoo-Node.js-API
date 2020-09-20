// Require mongoose package
const mongoose = require("mongoose");

// Create schema for the new object which will be added to the database for the confession post comment
const confessionPostCommentSchema = new mongoose.Schema({
  content: {
    type: String,
    required: [true, "Message content must not be blank"],
  },
  orderInCollection: {
    type: Number,
  },
  writer: {
    type: String,
    required: [true, "Writer email must not be blank"],
  },
  postId: {
    type: String,
    required: [true, "Post id must not be blank"],
  },
});

// Run this middleware before saving document to the database in order to fill in order in collection
// for the class group post comments
confessionPostCommentSchema.pre("save", async function (next) {
  // Get the current day and time
  let currentDateAndTimeObject = new Date();

  // Get number of seconds since 1970 (epoch)
  let numOfSeconds = Math.floor(currentDateAndTimeObject / 1000);

  // Set the orderInCollection property of the object to be number of seconds since 1970
  this.orderInCollection = numOfSeconds;

  // Go to the next middleware
  next();
});

// Create the object out of the schema
const ConfessionPostComment = mongoose.model(
  "ConfessionPostComment",
  confessionPostCommentSchema
);

// Export the model
module.exports = ConfessionPostComment;
