const mongoose = require("mongoose");


const userSchema = new mongoose.Schema({

    firstName : {
        type : String,
        required : true,
        trim : true
    },
    lastName : {
        type : String,
        required : true,
        trim : true
    },
    email : {
        type : String,
        required : true,
        trim : true
    },
    phoneNumber : {
        type : Number,
        required : true,
        trim : true
    },
    readingExperience :{
        type : Number,
        required : true,
        trim : true
    },
    profession : {

        type : String ,
        default : "Student"

    },
    userImage : {
        type : String
    },
    studMajor : {

        type : String


    },
    dateOfBirth : {
        type : Date,
        required : true
    },
    createdAt: {
        type: Date,
        default: Date.now // Automatically set the creation date
    },
    profile : {
        type: mongoose.Schema.ObjectId,
        ref : "userProfile"
    },


    password : {
        type : String,
        required : true,
        trim : true,
    },

    friends : [{

        type : mongoose.Schema.ObjectId,
        ref : "User"
        

    }],
  
    resetPasswordToken: {
        type : String, 
    },
    resetPasswordExpires:{
        type : Date,
        default: Date.now()+ 5 * 60 * 1000
    }



})


module.exports = mongoose.model("User" , userSchema)