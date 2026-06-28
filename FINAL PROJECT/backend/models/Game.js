const mongoose = require("mongoose");

const reviewSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    username: {
        type: String,
        required: true
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 10
    },
    comment: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

const gameSchema = mongoose.Schema({

    title:{
        type:String,
        required:true
    },

    description:{
        type:String
    },

    genre:{
    type:String,
    default:"Action"
},

imageUrl:{
    type:String,
    default:"https://via.placeholder.com/300"
},

downloadLink:{
    type:String,
    default:""
},

reviews: [reviewSchema],

rating: {
    type: Number,
    default: 0
},

numReviews: {
    type: Number,
    default: 0
}

});

module.exports = mongoose.models.Game || mongoose.model("Game", gameSchema);
