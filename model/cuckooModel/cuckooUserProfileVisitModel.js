// Import the mongoose
const mongoose = require("mongoose");

// HBTGram user profile visit schema
const hbtGramUserProfileVisit = new mongoose.Schema({
  user: {
    type: String,
    required: [true, "User id must not be blank"],
  },
  visitedBy: {
    type: String,
    required: [
      true,
      "User id of the user who visit the profile must not be blank",
    ],
  },
  numOfVisits: {
    type: Number,
    required: [true, "Number of visits must not be blank"],
  },
});

// HBTGram user profile visit model based on the schema
const HBTGramUserProfileVisit = mongoose.model(
  "HBTGramUserProfileVisit",
  hbtGramUserProfileVisit
);

// Export the model
module.exports = HBTGramUserProfileVisit;
