const mongoose = require("mongoose");

const scoreSchema = mongoose.Schema({

    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },

    game:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Game"
    },

    score:{
        type:Number,
        required:true
    }
});

module.exports = mongoose.model("Score", scoreSchema);