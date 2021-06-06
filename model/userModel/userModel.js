// Import the mongoose
const mongoose = require("mongoose");

// Import the validator
const validator = require("validator");

// This is used for password encryption
const bcrypt = require("bcryptjs");

// Crypto which will be used to create a random token to reset password
const crypto = require("crypto");

// User schema
const userSchema = new mongoose.Schema({
  firebaseUID: {
    type: String,
    required: [true, "Firebase UID must not be blank"],
  },
  fullName: {
    type: String,
  },
  email: {
    type: String,
    required: [true, "Email must not be blank"],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail],
  },
  password: {
    type: String,
    required: [true, "Password must not be blank"],
    minlength: 8,
    // Don't want to send password data to the client
    select: false,
  },
  passwordChangedAt: {
    type: Date,
  },
  passwordResetToken: {
    type: String,
  },
  passwordResetTokenExpires: {
    type: Date,
  },
  avatarURL: {
    type: String,
    require: [true, "Avatar URL must not be blank"],
  },
  coverURL: {
    type: String,
    require: [true, "Cover URL must not be blank"],
  },
  phoneNumber: {
    type: String,
    default: "",
  },
  description: {
    type: String,
    default: "",
  },
  location: {
    type: {
      type: String,
      default: "Point",
      enum: ["Point"],
    },
    coordinates: [Number],
    description: String,
  },
  locationEnabled: {
    type: String,
  },
});

// Index for MongoDB so that it knows that location should be 2D sphere
userSchema.index({ location: "2dsphere" });

// The middleware that is going to be executed in order to encrypt user's password. This middleware will run before the save command
// is executed (before the user's information is pushed to the database)
userSchema.pre("save", async function (next) {
  // Only update and hash the password if the password field is modified
  if (!this.isModified("password")) {
    return next();
  }

  // Hash the password
  this.password = await bcrypt.hash(this.password, 12);

  // Go to the next middleware
  next();
});

// This middleware is to set location enabled for user to be false
userSchema.pre("save", async function (next) {
  this.locationEnabled = "Disabled";

  // Go to the next middleware
  next();
});

// This middleware is going to create the default location for the user
userSchema.pre("save", async function (next) {
  // Create the default current location
  this.location = {
    coordinates: [107.59148730624084, 16.46396205584513],
    description: "",
    type: "Point",
  };
});

// This middleware is to check if the password of the user has been changed during data modification or not
// if the password is changed during the modification, update the passwordChangedAt property
userSchema.pre("save", async function (next) {
  // Only update and hash the password if the password field is modified
  if (!this.isModified("password")) {
    return next();
  }

  // If the user has really changed the password, then update the field as needed
  // We do have to make sure that token is created after the password is changed
  // So bring the passwordChangedAt property back 1 second to ensure this thing
  this.passwordChangedAt = Date.now() - 1000;
  next();
});

// This is used to validate user's password
userSchema.methods.validatePassword = async function (
  enteredPassword,
  databasePassword
) {
  // Return true or false
  return await bcrypt.compare(enteredPassword, databasePassword);
};

// This middleware will add the changedPasswordAfter property to the database after the user changed the password
userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  // If passwordChangedAt property exist, then the user may have changed the password
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );

    // This comparision will return either true or false which allow us to know if the user has changed the
    // password lately or not
    return JWTTimestamp < changedTimestamp;
  }

  // If the user hasn't changed the password, simply return false
  return false;
};

// This middleware will create password reset token for the user when the user need a JWT to reset the password
userSchema.methods.createPasswordResetToken = function () {
  // This just need to be random. Doesn't need to be very strong as password token
  const resetPasswordToken = crypto.randomBytes(32).toString("hex");

  // Hash it a little bit
  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetPasswordToken)
    .digest("hex");

  // Make the token expires after a while. This means that the token will expire in 10 minutes
  this.passwordResetTokenExpires = Date.now() + 10 * 60 * 1000;

  return resetPasswordToken;
};

// User model based on the schema that we have just created
const User = mongoose.model("User", userSchema);

// Export the user model
module.exports = User;
