const mongoose = require("mongoose");

const groupSchema = new mongoose.Schema({
  name: { type: String, required: true },
  members: [
    { 
        type: mongoose.Schema.ObjectId, 
        ref: 'User', 
        required: true },
  ],
  avatar: {
      type: String,
      default: 'https://cdn-icons-png.flaticon.com/512/9790/9790561.png'
    },
    description :{
        type : String
    },
    groupCreator : {
        type : mongoose.Schema.ObjectId,
        ref : "User"
    }
    ,
  createdAt: {
     type: Date,
      default: Date.now },
});

module.exports = mongoose.model("Group", groupSchema);
