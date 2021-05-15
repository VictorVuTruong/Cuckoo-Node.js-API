// Import the mongoose
const mongoose = require("mongoose");

// Cuckoo user profile visit schema
const cuckooUserProfileVisit = new mongoose.Schema({
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

// Cuckoo user profile visit model based on the schema
const CuckooUserProfileVisit = mongoose.model(
  "CuckooUserProfileVisit",
  cuckooUserProfileVisit
);

// Export the model
module.exports = CuckooUserProfileVisit;
