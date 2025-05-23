
const nodeMailer = require("nodemailer");

require("dotenv").config();

const mailSend = async (email , title , body) =>{

    try{

        const transporter = nodeMailer.createTransport({
            host : process.env.MAIL_HOST, 
            auth : {
                user : process.env.MAIL_USER,
                pass : process.env.MAIL_PASS
            }

        })

        let info = await transporter.sendMail({
            from: 'ExpressReading', // sender address
            to: `${email}`, // list of receivers
            subject: `${title}`, // Subject line
            html: `${body}`, // html body
        })
        
        console.log(info);

        return info;
    }
    catch(err)
    {
    console.log(err);
    
    }

}


module.exports = mailSend;