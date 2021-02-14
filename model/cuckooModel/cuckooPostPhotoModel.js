// Require mongoose package
const mongoose = require("mongoose");

// Create schema for the hbt gram post photo object
const hbtGramPostPhotoSchema = new mongoose.Schema({
  imageURL: {
    type: String,
    required: [true, "Image URL must not be blank"],
  },
  postId: {
    type: String,
    required: [true, "Post id must not be blank"],
  },
  orderInCollection: {
    type: Number,
  },
});

// Run this middleware before saving the document so that order in collection of the
// newly created photo object will be obtained
hbtGramPostPhotoSchema.pre("save", async function (next) {
  // The date object
  let dateObject = new Date();

  // OBTAIN THE ORDER IN COLLECTION
  // Get number of seconds since 1970
  let numOfSeconds = Math.floor(dateObject / 1000);

  // Set the order in collection property of the object to be the number of seconds we
  // just got
  this.orderInCollection = numOfSeconds;

  // Go to the next middlware
  next();
})

// Create the object out of the schema
const HBTGramPostPhoto = mongoose.model(
  "HBTGramPostPhoto",
  hbtGramPostPhotoSchema
);

// Export the model
module.exports = HBTGramPostPhoto;