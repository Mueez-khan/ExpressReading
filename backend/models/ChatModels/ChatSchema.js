const mongoose = require("mongoose")

const chatSchema = new mongoose.Schema({

    participants: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }],

    isGroup: { 
        type: Boolean, 
        default: false 
    },
    messages: [{
      type: mongoose.Schema.ObjectId,
      ref: 'Message'
    }],
  
    createdAt: {
      type: Date,
      default: Date.now
    }
});

module.exports = mongoose.model("Chat" , chatSchema)