// Require mongoose package
const mongoose = require("mongoose");

// Create schema for the class group post photo object
const classGroupPostPhotoSchema = new mongoose.Schema({
  imageURL: {
    type: String,
    required: [true, "Image URL must not be blank"],
  },
  postId: {
    type: String,
    required: [true, "Class code must not be blank"],
  },
});

// Create the object out of the schema
const ClassGroupPostPhoto = mongoose.model(
  "ClassGroupPostLikes",
  classGroupPostPhotoSchema
);

// Export the model
module.exports = ClassGroupPostPhoto;
