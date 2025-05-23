const mongoose = require("mongoose");


const commentsSchema = new mongoose.Schema({

    commentText : {
        type : String,
        required : true,
        trim : true
    },
    authorId : {

      type : mongoose.Schema.ObjectId,
      ref : "User",

    },
    authorName : {
      type : String,
      required : true,
      trim : true
    },
    post : {
        type : mongoose.Schema.ObjectId,
        ref : "post"
    },
    parentComment: {
        type: mongoose.Schema.ObjectId,
        ref: 'Comment',
        default: null, // Null if it’s a top-level comment
      },
      replies: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'Comment',
    },
  ],
    createdAt : {
        type : Date,
        default : Date.now
    }

})


module.exports = mongoose.model("Comment" , commentsSchema)