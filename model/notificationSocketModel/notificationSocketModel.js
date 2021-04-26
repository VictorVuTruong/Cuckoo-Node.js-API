// Import the mongoose
const mongoose = require("mongoose");

// Create schema for the notification socket model
const notificationSocketSchema = new mongoose.Schema({
  user: {
    type: String,
    required: [true, "User must not be blank"],
  },
  socketId: {
    type: String,
    required: [true, "Socket id must not be blank"],
  },
  deviceModel: {
    type: String,
    required: [true, "Device model must not be blank"]
  }
});

// Notification socket schema model based on the schema that we created
const NotificationSocket = mongoose.model(
  "NotificationSocket",
  notificationSocketSchema
);

// Export the model
module.exports = NotificationSocket;
