// Require mongoose package
const mongoose = require("mongoose");

// Create schema for the Cuckoo post comment photo object
const cuckooPostCommentPhotoSchema = new mongoose.Schema({
  imageURL: {
    type: String,
    required: [true, "Image URL must not be blank"],
  },
  commentId: {
    type: String,
    required: [true, "Comment id must not be blank"],
  },
});

// Create the object out of the schema
const CuckooPostCommentPhoto = mongoose.model(
  "CuckooPostCommentPhoto",
  cuckooPostCommentPhotoSchema
);

// Export the model
module.exports = CuckooPostCommentPhoto;
