const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema({
  senderId: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },
  receiverId: { 
    type: mongoose.Schema.ObjectId,
     ref: "User" },
  // chatId: {
  //    type: mongoose.Schema.Types.ObjectId, 
  //    ref: 'Chat',
  //     required: true },
  content: {
     type: String 
    },

  media: [{
     type: String
 }], // Stores media file URLs

 

  // groupId: { 
  //   type: mongoose.Schema.Types.ObjectId,
  //    ref: "Group" },

  createdAt: {
     type: Date, 
     default: Date.now },
});

module.exports = mongoose.model("Message", MessageSchema);
