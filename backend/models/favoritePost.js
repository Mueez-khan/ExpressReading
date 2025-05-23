const mongoose = require("mongoose");

const favoritePost = new mongoose.Schema({


    post : {
        type : mongoose.Schema.ObjectId,
        ref : "post"
    },
    user : {
        type : mongoose.Schema.ObjectId,
        ref :  "User"
    }




})

module.exports = mongoose.model("favoritePost" , favoritePost);