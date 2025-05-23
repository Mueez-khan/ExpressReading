const mongoose = require("mongoose");


const userProfile = new mongoose.Schema({


    coverImage : {
        type : String
    },
    gender : {
        type : String,
        trim : true
    },
    bio : {
        type : String
    },
    lastBook  : {
        type : String
    },
    favoriteWriter : {
        type : String
    },
    user : {
        type : mongoose.Schema.ObjectId,
        ref : "User"
    }



})


module.exports = mongoose.model("userProfile" , userProfile);