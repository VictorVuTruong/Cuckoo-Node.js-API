// Require mongoose package
const mongoose = require("mongoose");

// Create schema for the class group post like object
const classGroupPostLikesSchema = new mongoose.Schema({
  whoLike: {
    type: String,
    required: [true, "Liker email must not be blank"],
  },
  postId: {
    type: String,
    required: [true, "Post id must not be blank"],
  },
});

// Create the object out of the schema
const ClassGroupPostLikes = mongoose.model(
  "ClassGroupPostLikes",
  classGroupPostLikesSchema
);

// Export the model
module.exports = ClassGroupPostLikes;
