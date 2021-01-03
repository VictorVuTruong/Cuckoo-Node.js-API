// Require mongoose package
const mongoose = require("mongoose");

// Create schema for the notification object
const notificationSchema = new mongoose.Schema({
  content: {
    type: String,
    required: [true, "Content must not be blank"],
  },
  forUser: {
    type: String,
    required: [true, "Receiver must not be blank"],
  },
  fromUser: {
    type: String,
    required: [true, "Sender must not be blank"]
  },
  image: {
    type: String,
    required: [true, "Image URL of notification must to be blank"],
  },
  postId: {
    type: String,
    required: [true, "Post id must not be blank"]
  },
  orderInCollection: {
    type: Number,
  },
});

// Run this middleware before saving new document to the database in order to get order
// in collection for the new notification
notificationSchema.pre("save", async function (next) {
  // The date object
  let dateObject = new Date();

  // OBTAIN THE ORDER IN COLLECTION
  // Get number of seconds since 1970
  let numOfSeconds = Math.floor(dateObject / 1000);

  // Set the order in collection property of the object to be the number of seconds we
  // just got
  this.orderInCollection = numOfSeconds;

  // Go to the next middlware
  next();
});

// Create the object out of the schema
const Notification = mongoose.model("Notification", notificationSchema);

// Export the model
module.exports = Notification;
