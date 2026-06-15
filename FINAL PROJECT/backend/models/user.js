const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
{
    username: {
        type: String,
        required: true
    },

    email: {
        type: String,
        required: true,
        unique: true
    },

    password: {
        type: String,
        required: true
    },

    totalScore: {
        type: Number,
        default: 0
    }
},
{
    timestamps: true
}
);

module.exports = mongoose.models.User || mongoose.model("User", userSchema);