const mongoose = require("mongoose");


const bookReview = new mongoose.Schema({


    author : {

        type : mongoose.Schema.ObjectId,
        ref : "User"

    },

    bookImage : {

        type : String,
        required : true
        
    },
    heading : {
        type : String,
        required : true,
        trim : true
    },
    commentAboutBook : {
        type : String,
        required : true,
        trim : true
    },
    ratting  : {
        type : Number,
        default : 1,
        min : [1 , "You can not review below 1" ],
        max : [5 , "Your can not review above 5"],
        required : true

    },
    commentsCount:{

        type : Number

    },
    // otherUserReviews : [{
    //     type : mongoose.Schema.ObjectId,
    //     ref : "reviewComment"
    // }],
    totalRatting : {

        type : Number,
        default: 0

    },
    createdAt : {
        type : Date,
        default : Date.now
    }



})


module.exports = mongoose.model("BookReview" , bookReview)