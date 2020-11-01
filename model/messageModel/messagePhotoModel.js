// Require mongoose package
const mongoose = require("mongoose");

// Create schema for the message photo object
const messagePhotoSchema = new mongoose.Schema({
  imageURL: {
    type: String,
    required: [true, "Image URL must not be blank"],
  },
  messageId: {
    type: String,
    required: [true, "Message id must not be blank"],
  },
});

// Create the object out of the schema
const MessagePhoto = mongoose.model("MessagePhoto", messagePhotoSchema);

// Export the model
module.exports = MessagePhoto;
