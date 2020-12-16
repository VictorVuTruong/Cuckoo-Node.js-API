// Import the mongoose
const mongoose = require("mongoose");

// HBTGram user like interaction schema
const hbtGramUserLikeInteraction = new mongoose.Schema({
    user: {
        type: String,
        required: [true, "User id must not be blank"]
    },
    likedBy: {
        type: String,
        required: [true, "User id of the user who like must not be blank"]
    },
    numOfLikes: {
        type: Number,
        required: [true, "Number of likes must not be blank"]
    }
})

// HBTGram user like interaction model based on the schema
const HBTGramUserLikeInteraction = mongoose.model("HBTGramUserLikeInteraction", hbtGramUserLikeInteraction)

// Export the user like interaction model
module.exports = HBTGramUserLikeInteraction