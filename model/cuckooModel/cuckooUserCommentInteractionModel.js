// Import the mongoose
const mongoose = require("mongoose");

// Cuckoo user comment interaction schema
const cuckooUserCommentInteraction = new mongoose.Schema({
  user: {
    type: String,
    required: [true, "User id must not be blank"],
  },
  commentedBy: {
    type: String,
    required: [true, "User id of the user who comment must not be blank"],
  },
  numOfComments: {
    type: Number,
    required: [true, "Number of comments must not be blank"],
  },
});

// Cuckoo user comment interaction model based on the schema
const CuckooUserCommentInteraction = mongoose.model(
  "CuckooUserCommentInteraction",
  cuckooUserCommentInteraction
);

// Export the model
module.exports = CuckooUserCommentInteraction;
