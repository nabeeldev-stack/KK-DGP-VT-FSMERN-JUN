const mongoose = require("mongoose");

const scoreSchema = mongoose.Schema(
{
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    game: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Game",
        required: true
    },

    score: {
        type: Number,
        required: true,
        min: 0
    }
},
{
    timestamps: true
}
);

module.exports =
    mongoose.models.Score ||
    mongoose.model("Score", scoreSchema);