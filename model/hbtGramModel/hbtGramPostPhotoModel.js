// Require mongoose package
const mongoose = require("mongoose");

// Create schema for the hbt gram post photo object
const hbtGramPostPhotoSchema = new mongoose.Schema({
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
const HBTGramPostPhoto = mongoose.model(
  "HBTGramPostPhoto",
  hbtGramPostPhotoSchema
);

// Export the model
module.exports = HBTGramPostPhoto;