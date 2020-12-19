// Import the mongoose
const mongoose = require("mongoose");

// HBtGram post photo label visit schema
const hbtGramPostPhotoLabelVisit = new mongoose.Schema({
  user: {
    type: String,
    required: [true, "User id must not be blank"],
  },
  visitedLabel: {
    type: String,
    required: [true, "Label of the visited photo must not be blank"],
  },
  numOfVisits: {
    type: Number,
    required: [true, "Number of visit must not be blank"],
  },
});

// HBTGram post photo label visit model based on the schema
const HBTGramPostPhotoLabelVisit = mongoose.model(
  "HBTGramPostPhotoLabelVisit",
  hbtGramPostPhotoLabelVisit
);

// Export the model
module.exports = HBTGramPostPhotoLabelVisit;
