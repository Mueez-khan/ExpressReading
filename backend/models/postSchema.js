const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({


    postImage : [{
        
            type : String
        
    }],
    description : {
        type : String , 
        required : true
    },
    author : {
        type : mongoose.Schema.ObjectId,
        ref : "User"
    },
    likeCount: { // will update this and add users instead of numbers only 
        type: Number,
        default: 0
    },
    comments : {
        
            type : Number,
            default : 0
        
    },
    
    date : {
        type : Date ,
        default : Date.now
    }



})

module.exports = mongoose.model("post" , postSchema);