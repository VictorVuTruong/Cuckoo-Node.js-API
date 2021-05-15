// Require mongoose package
const mongoose = require("mongoose");

// Create schema for the Cuckoo post
const cuckooPostSchema = new mongoose.Schema({
  content: {
    type: String,
    required: [true, "Content must not be blank"],
  },
  dateCreated: {
    type: String,
  },
  numOfImages: {
    type: Number,
    required: [true, "Number of images must not be blank"],
  },
  writer: {
    type: String,
    required: [true, "Writer name must not be blank"],
  },
  orderInCollection: {
    type: Number,
  },
});

// Run this middleware before saving new document to the database in order to get order
// in collection for the new confession post as well as get the date created
cuckooPostSchema.pre("save", async function (next) {
  // The date object
  let dateObject = new Date();

  // OBTAIN THE ORDER IN COLLECTION
  // Get number of seconds since 1970
  let numOfSeconds = Math.floor(dateObject / 1000);

  // Set the order in collection property of the object to be the number of seconds we
  // just got
  this.orderInCollection = numOfSeconds;

  // OBTAIN THE DATE CREATED
  // Get the current day
  let currentDay = dateObject.getDate();

  // Get the current month
  let currentMonth = dateObject.getMonth() + 1;

  // Get the current year
  let currentYear = dateObject.getFullYear();

  // Combine them all to get the full date string
  let dateCreated = `${currentDay}/${currentMonth}/${currentYear}`;

  // Set the dateCreated property in of the object to be the current date we just got
  this.dateCreated = dateCreated;

  // Go to the next middlware
  next();
});

// Create the Cuckoo post object based on the schema
const CuckooPost = mongoose.model("CuckooPost", cuckooPostSchema);

// Export the model
module.exports = CuckooPost;
