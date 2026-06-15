const mongoose = require("mongoose");

const gameSchema = mongoose.Schema({

    title:{
        type:String,
        required:true
    },

    description:{
        type:String
    },

    genre:{
        type:String
    }
});

module.exports = mongoose.model("Game", gameSchema);