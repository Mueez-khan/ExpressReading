const mongoose = require("mongoose");
const emailTemplate = require("../mailTemplates/emailVerificationTemplate");
const mailSend = require("../utils/MailSender");


const OtpSchema = new mongoose.Schema({
    email : {
        type :String,
        required : true
    },
    otp : {
        type :String,
        required : true
    },
    createAt : {
        type : Date,
        default : Date.now(),
        expires : 5 * 60
    }

})

async function sendVerificationMail(email , otp)
{

    try{

        const mailResponse = await mailSend(
            email , 
            "verification email from Readers" ,
            emailTemplate(otp)
            )
        console.log("Email send successFully :", mailResponse)
    }
    catch(err)
    {
        console.log("Error occur while sending email",err);
    }

}

OtpSchema.pre("save" , async function(next){

    await sendVerificationMail(this.email , this.otp);

    next();


})

module.exports = mongoose.model("Otp" , OtpSchema);