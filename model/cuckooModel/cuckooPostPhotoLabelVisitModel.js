// Import the mongoose
const mongoose = require("mongoose");

// Cuckoo post photo label visit schema
const cuckooPostPhotoLabelVisit = new mongoose.Schema({
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

// Cuckoo post photo label visit model based on the schema
const CuckooPostPhotoLabelVisit = mongoose.model(
  "CuckooPostPhotoLabelVisit",
  cuckooPostPhotoLabelVisit
);

// Export the model
module.exports = CuckooPostPhotoLabelVisit;
