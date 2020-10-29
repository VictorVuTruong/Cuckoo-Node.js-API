// Import the mongoose
const mongoose = require("mongoose");

// Create schema for the message room model
const messageRoomSchema = new mongoose.Schema({
  user1: {
    type: String,
    required: [true, "User 1 id must not be empty"],
  },
  user2: {
    type: String,
    required: [true, "User 2 id must not be empty"],
  },
});

// Message room model based on the schema that we have just created
const MessageRoom = mongoose.model("MessageRoom", messageRoomSchema);

// Export the message room model
module.exports = MessageRoom;
