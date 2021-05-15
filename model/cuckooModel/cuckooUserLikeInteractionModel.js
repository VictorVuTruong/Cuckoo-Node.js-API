// Import the mongoose
const mongoose = require("mongoose");

// Cuckoo user like interaction schema
const cuckooUserLikeInteraction = new mongoose.Schema({
  user: {
    type: String,
    required: [true, "User id must not be blank"],
  },
  likedBy: {
    type: String,
    required: [true, "User id of the user who like must not be blank"],
  },
  numOfLikes: {
    type: Number,
    required: [true, "Number of likes must not be blank"],
  },
});

// Cuckoo user like interaction model based on the schema
const CuckooUserLikeInteraction = mongoose.model(
  "CuckooUserLikeInteraction",
  cuckooUserLikeInteraction
);

// Export the user like interaction model
module.exports = CuckooUserLikeInteraction;
