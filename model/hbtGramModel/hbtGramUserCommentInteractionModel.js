// Import the mongoose
const mongoose = require("mongoose");

// HBTGram user comment interaction schema
const hbtGramUserCommentInteraction = new mongoose.Schema({
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

// HBTGram user comment interaction model based on the schema
const HBTGramUserCommentInteraction = mongoose.model(
  "HBTGramUserCommentInteraction",
  hbtGramUserCommentInteraction
);

// Export the model
module.exports = HBTGramUserCommentInteraction;
