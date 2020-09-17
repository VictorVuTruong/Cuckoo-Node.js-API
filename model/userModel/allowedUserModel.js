// Import the mongoose
const mongoose = require("mongoose");

// Import this one to encrypt password in the database as well as encrypting the token
const crypto = require("crypto");

// User schema
const allowedUserSchema = new mongoose.Schema({
  studentId: {
    type: String,
    require: [true, "Student id must not be blank"],
  },
  firstName: {
    type: String,
    require: [true, "First name must not be blank"],
  },
  middleName: {
    type: String,
    require: [true, "Middle name must not be blank"],
  },
  lastName: {
    type: String,
    require: [true, "Last name must not be blank"],
  },
  classCode: {
    type: String,
    require: [true, "Class code must not be blank"],
  },
  registered: {
    type: String,
    require: [true, "registration status must not be blank"],
  },
  role: {
    type: String,
    enum: ["user", "teacher", "admin"],
    required: [true, "Select a role"],
  },
  signUpToken: {
    type: String,
  },
  signUpTokenExpires: {
    type: Date,
  },
});

// This middleware will create sign up token when user need it to create new account
allowedUserSchema.methods.createSignUpToken = function () {
  // This just need to be random. Doesn't need to be very strong as password token
  const signUpToken = crypto.randomBytes(32).toString("hex");

  // Create the signUpToken and signUpTokenExpires property here so that they will be brought to the database
  // when the user request for sign up

  // Hash it a little bit
  this.signUpToken = crypto
    .createHash("sha256")
    .update(signUpToken)
    .digest("hex");

  // Make the token expires after a while. This means that the token will expire in 10 minutes
  this.signUpTokenExpires = Date.now() + 10 * 60 * 1000;

  // Return the token
  return signUpToken;
};

// Allowed user model based on the schema that we have just created
const AllowedUser = mongoose.model("AllowedUser", allowedUserSchema);

// Export the user model
module.exports = AllowedUser;
