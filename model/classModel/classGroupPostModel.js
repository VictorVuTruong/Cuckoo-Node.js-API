// Require mongoose package
const mongoose = require("mongoose");

// Create schema for the new object which will be added to the database for the class group post
const classGroupPostSchema = new mongoose.Schema({
  content: {
    type: String,
    required: [true, "Content must not be blank"],
  },
  dateCreated: {
    type: String,
    required: [true, "Date created must not be blank"],
  },
  numOfImages: {
    type: Number,
    required: [true, "Number of images must not be blank"],
  },
  writer: {
    type: String,
    required: [true, "Writer email must not be blank"],
  },
  classCode: {
    type: String,
    required: [true, "Class code must not be blank"],
  },
  orderInCollection: {
    type: Number,
  },
});

// Run this middleware before saving chat message to the database in order to fill in order in collection
// for the class group post object
classGroupPostSchema.pre("save", async function (next) {
  // Get the current day and time
  let currentDateAndTimeObject = new Date();

  // Get number of seconds since 1970 (epoch)
  let numOfSeconds = Math.floor(currentDateAndTimeObject / 1000);

  // Set the orderInCollection property of the object to be number of seconds since 1970
  this.orderInCollection = numOfSeconds;

  // Go to the next middleware
  next();
});

// Create the class group post object based on the schema that we have just created
const ClassGroupPost = mongoose.model("ClassGroupPost", classGroupPostSchema);

// Export the model
module.exports = ClassGroupPost;
