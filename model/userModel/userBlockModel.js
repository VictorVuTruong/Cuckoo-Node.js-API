// Import the mongoose
const mongoose = require("mongoose");

// User block schema
const userBlockSchema = new mongoose.Schema({
  user: {
    type: String,
    required: [true, "User id must not be blank"],
  },
  blockedBy: {
    type: String,
    required: [true, "Block by which user?"],
  },
  blockType: {
    type: String,
    required: [true, "Block type must not be blank"],
  },
});

// User block object based on the schema that has just been created
const UserBlock = mongoose.model("UserBlock", userBlockSchema);

// Export the user block model
module.exports = UserBlock;
