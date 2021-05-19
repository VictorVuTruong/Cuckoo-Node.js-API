// Import mongoose
const mongoose = require("mongoose")

// User trust schema
const userTrustSchema = new mongoose.Schema({
    user: {
        type: String,
        required: [true, "User id must not be blank"]
    },
    trustedBy: {
        type: String,
        required: [true, "Trusting user must not be blank"]
    }
})

// User trust model based on the schema that we have just created
const UserTrust = mongoose.model("UserTrust", userTrustSchema)

// Export the user trust model
module.exports = UserTrust