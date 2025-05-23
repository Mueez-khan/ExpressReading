const mongoose = require("mongoose");

const FriendSchema = new mongoose.Schema({


    senderId : {
        type : mongoose.Schema.ObjectId,
        ref : "User"
    },
    receiverId : {
        type : mongoose.Schema.ObjectId,
        ref :  "User"
    },
    status :{

    type: String,
    enum: ['pending', 'accepted', 'declined'],
    default: 'pending'

    }




})
 
module.exports = mongoose.model("Friend" , FriendSchema);