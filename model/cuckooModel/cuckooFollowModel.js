// Require mongoose package
const mongoose = require("mongoose");

// Create schema for the new object which will be the follow object
const followSchema = new mongoose.Schema({
    follower: {
      type: String,
      required: [true, "Follower must not be blank"],
    },
    following: {
      type: String,
      required: [true, "Following must not be blank"],
    },
  });

// Create the object out of the schema
const Follow = mongoose.model(
    "Follow",
    followSchema
  );

// Export the model
module.exports = Follow;