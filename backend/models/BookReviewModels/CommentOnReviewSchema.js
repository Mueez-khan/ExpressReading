const mongoose = require("mongoose");

const CommentOnReviewSchema = new mongoose.Schema({

    author : {

        type : mongoose.Schema.ObjectId,
        ref : "User",
        required : true

    },
    commentedOn : {

        type : mongoose.Schema.ObjectId,
        ref : "BookReview",
        required : true

    },
    comment : {
        type : String,
        required : true,
        trim : true
    },
    ratting :  {

        type : Number,
        required : true,
        min : [1 , "Your can't give review less then 1"],
        max : [5 , "You can't give review more then 5"],
        trim : true
        
    }


})


module.exports = mongoose.model("CommentOnReview" , CommentOnReviewSchema);