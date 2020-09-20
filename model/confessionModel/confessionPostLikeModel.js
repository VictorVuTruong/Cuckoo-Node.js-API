// Require mongoose package
const mongoose = require("mongoose");

// Create schema for the confession post like object
const confessionPostLikeSchema = new mongoose.Schema({
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
const ConfessionPostLike = mongoose.model(
  "ConfessionPostLike",
  confessionPostLikeSchema
);

// Export the model
module.exports = ConfessionPostLike;
