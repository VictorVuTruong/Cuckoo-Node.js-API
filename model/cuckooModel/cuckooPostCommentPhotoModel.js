// Require mongoose package
const mongoose = require("mongoose");

// Create schema for the hbt gram post comment photo object
const hbtGramPostCommentPhotoSchema = new mongoose.Schema({
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
const HBTGramPostCommentPhoto = mongoose.model(
  "HBTGramPostCommentPhoto",
  hbtGramPostCommentPhotoSchema
);

// Export the model
module.exports = HBTGramPostCommentPhoto;
