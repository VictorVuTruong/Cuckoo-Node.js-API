// Require mongoose package
const mongoose = require("mongoose");

// Create schema for the HBT Gram post like object
const hbtGramPostLikeSchema = new mongoose.Schema({
  whoLike: {
    type: String,
    required: [true, "Liker email must not be blank"],
  },
  postId: {
    type: String,
    required: [true, "Post id must not be blank"],
  },
});

// Create the object out of the schema
const HBTGramPostLike = mongoose.model(
  "HBTGramPostLike",
  hbtGramPostLikeSchema
);

// Export the model
module.exports = HBTGramPostLike;