// Import the mongoose
const mongoose = require("mongoose");

// Create schema for the message model
const messageSchema = new mongoose.Schema({
  chatRoomId: {
    type: String,
    required: [true, "Chat room id must not be empty"],
  },
  sender: {
    type: String,
    required: [true, "Sender must not be empty"],
  },
  receiver: {
    type: String,
    required: [true, "Receiver must not be empty"],
  },
  content: {
    type: String,
    required: [true, "Content must not be empty"],
  },
});

// Message model based on the schema that we have just created
const Message = mongoose.model("Message", messageSchema);

// Export the message model
module.exports = Message;
