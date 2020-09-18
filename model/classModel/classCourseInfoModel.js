// Require mongoose package
const mongoose = require("mongoose");

// Create schema for the new object which will be added to the database for the class course info
const classCourseInfoSchema = new mongoose.Schema({
  schoolYear: {
    type: String,
    required: [true, "School year must not be blank"],
  },
  teacher: {
    type: String,
    required: [true, "Teacher must not be blank"],
  },
  classCode: {
    type: String,
    required: [true, "Class code must not be blank"],
  },
  subject: {
    type: String,
    required: [true, "Subject must not be blank"],
  },
});

// Create the class course info item based on the schema that we have just created
const ClassCourseInfo = mongoose.model(
  "ClassCourseInfo",
  classCourseInfoSchema
);

// Export the model
module.exports = ClassCourseInfo;
