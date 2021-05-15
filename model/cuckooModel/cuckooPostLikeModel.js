// Require mongoose package
const mongoose = require("mongoose");

// Create schema for the Cuckoo post like object
const cuckooPostLikeSchema = new mongoose.Schema({
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
const CuckooPostLike = mongoose.model(
  "CuckooPostLike",
  cuckooPostLikeSchema
);

// Export the model
module.exports = CuckooPostLike;