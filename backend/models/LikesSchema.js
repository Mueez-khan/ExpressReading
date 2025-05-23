const mongoose = require("mongoose");

const LikeSchema = new mongoose.Schema({


    postId : {
        type : mongoose.Schema.ObjectId,
        ref : "post"
    },
    userId : {
        type : mongoose.Schema.ObjectId,
        ref :  "User"
    }




})
 
module.exports = mongoose.model("likePost" , LikeSchema);