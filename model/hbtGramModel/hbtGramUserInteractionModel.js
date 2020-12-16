// Import the mongoose
const mongoose = require("mongoose");

// HBTGram user interaction schema
const hbtGramUserInteraction = new mongoose.Schema({
    user: {
        type: String,
        required: [true, "user id must not be blank"]
    },
    interactWith: {
        type: String,
        required: [true, "User id of the user interacting with must not be blank"]
    },
    interactionFrequency: {
        type: Number,
        required: [true, "Interaction frequency must not be blank"]
    }
})

// HBTGram user interaction model based on the schema
const HBTGramUserInteraction = mongoose.model("HBTGramUserInteraction", hbtGramUserInteraction)

// Export the user interaction model
module.exports = HBTGramUserInteraction