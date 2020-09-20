// Require mongoose package
const mongoose = require("mongoose");

// Create schema for the confession post photo object
const confessionPostPhotoSchema = new mongoose.Schema({
  imageURL: {
    type: String,
    required: [true, "Image URL must not be blank"],
  },
  postId: {
    type: String,
    required: [true, "Post id must not be blank"],
  },
});

// Create the object out of the schema
const ConfessionPostPhoto = mongoose.model(
  "ConfessionPostPhoto",
  confessionPostPhotoSchema
);

// Export the model
module.exports = ConfessionPostPhoto;
