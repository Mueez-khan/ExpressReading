const User = require("../models/userSchema.js");
const otp = require("otp-generator");
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');
const otpGenerator = require("otp-generator");
const Otp = require("../models/otp.js");
const mailSend = require("../utils/MailSender.js");
const crypto = require("crypto"); // Import crypto ***
const userProfile = require("../models/userProfile.js");
const {passwordUpdated} = require("../mailTemplates/passwordUpdate.js"); 


exports.sendOtp = async  (req , res) => {

    try{

        const { email } = req.body;

        const existingUser = await User.findOne({email});

        if(existingUser){
            return res.status(401).json({
                success : false,
                message : "User exists with this email please try another email"
            })
        }

        const otp = otpGenerator.generate(6, { upperCaseAlphabets: false,
           specialChars: false , lowerCaseAlphabets: false  });

        console.log("OTP is generated:", otp);

        // Create an entry in the database for OTP
        const otpPayload = { email, otp };
        const otpBody = await Otp.create(otpPayload); // Await OTP creation
        console.log("otp body ",otpBody);

        res.status(200).json({
            success: true,
            message: "OTP sent successfully"
          });

    }
    catch(err){
        console.log("Error while sending otp" , err);
        return res.status(500).json({
            success : false,
            message : "Error while sending the otp to user"
        })
    }


}


// **********************************************************************
// **********************************************************************
//                          Register User                               *
// **********************************************************************
// **********************************************************************


exports.register = async (req, res) => {
    try {
      const { firstName, lastName,  email, phoneNumber, readingExperience  ,
         otp,  studMajor , dateOfBirth,  profession , password, confirmPassword } = req.body;
  
      // Check if all fields are filled
      if (!firstName || !lastName || !email || !phoneNumber 
        || !readingExperience  || !dateOfBirth || !otp || !password || !confirmPassword) {
        return res.status(403).json({
          success: false,
          message: "Please fill all fields"
        });
      }
  
      // Find the most recent OTP
      const recentOtp = await Otp.findOne({ email }).sort({ createdAt: -1 });
      console.log("Recent otp", recentOtp);
  
      // Validate the OTP
      if (!recentOtp || otp !== recentOtp.otp) {
        return res.status(400).json({
          success: false,
          message: "Invalid or expired OTP"
        });
      }
  
      // Check if passwords match
      if (password !== confirmPassword) {
        return res.status(400).json({ message: "Passwords do not match" });
      }
  
      // Check if user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
      }
  
      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 12);

      const userProfileDetails = await  userProfile.create({
        coverImage : null,
        gender :  null,
        bio : null,
        favoriteWriter : null,
        lastBook : null
      });

      

      console.log("User profile" , userProfileDetails);
  
      // Create a new user
      const newUser = new User({
        firstName,
        lastName,
        email,
        phoneNumber,
        readingExperience,
        userImage : `https://api.dicebear.com/5.x/initials/svg?seed=${firstName}-${lastName}`,
        studMajor,
        dateOfBirth,
        profession,
        profile :userProfileDetails._id,
        password: hashedPassword
      });

      const userDetails = await newUser.save();
  
     

      console.log("User registered successfully" , userDetails);

      res.status(201).json({ message: "User registered successfully" });

    } catch (err) {
      console.error("Error registering user:", err); // Detailed error logging
      res.status(500).json({ message: "Error registering user", error: err.message });
    }
  };
  
  
// **********************************************************************
// **********************************************************************
//                          Login User                                  *
// **********************************************************************
// **********************************************************************


  exports.login = async (req , res) =>{

    try{

        // get data from the body
        const {email , password} = req.body;

        console.log("Email" , email)
        console.log("Password" , password);
        // validation of data

        if(!email || !password)
        {
            return res.status(400).json({
             success : false,
             message : "Please fill all fields "
            })
        }



        // user checks  exists or not 


        const user = await User.findOne({email}).populate("profile");

        console.log("User" , user);

        if(!user)
        {

            return res.status(400).json({
                success : false,
                message : "User is not registered  Please signup first"
               })

        }


        // generate the jwt Token , after password checking 

        if( await bcrypt.compare(password , user.password)){

             const payload = {
                email : user.email,
                id : user._id,
             }

            const token = jwt.sign(payload , process.env.JWT_SECRET , {
                expiresIn : "30d",
            })

            user.token = token ;
        user.password = undefined;
        // create cookie
       

        let options ={
          expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 3 days
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production', // HTTPS in production
          sameSite: 'Lax',
        }

        res.cookie("token" , token , options).status(200).json({
            success : true,
            user ,
            token,
            message : "Logged in Successfully "
        })

        }

        else{
            return res.status(401).json({
                success : false,
                message : "Password is incorrect"
               })
        }
        


    }
    catch(err)
    {
        console.log(err);
        return res.status(500).json({
                success : false,
                message : "Login failure , Please try again"
               })
    }

}



// **********************************************************************
// **********************************************************************
//                          Change password                             *
// **********************************************************************
// **********************************************************************


exports.changePassword = async (req , res) =>{

  try{

    const userId = req.user.id;
    const userDetails = await User.findById(userId);

    console.log("UserDetails ", userDetails);

    const {oldPassword , newPassword} = req.body;
    if(!oldPassword || !newPassword){
      return res.status(401).json({
        success : false,
        message : "Please fill all input box's"
      })
    }


    
    const passwordValidation = await bcrypt.compare(oldPassword , userDetails.password );

    if(!passwordValidation){
      return res.status(401).json({
        success : false,
        message : "Old password not matched"
      })
    }

    const hashedPassword = await bcrypt.hash(newPassword , 12);

    const updatePassword = await User.findByIdAndUpdate(
      userId,
      {password : hashedPassword},
      {new : true}
    )


    console.log("UpdatePassword details" , updatePassword);
    // Sending mail for password updating

    try {
      const emailResponse = await mailSend(
        userDetails.email,
        "Password for your account has been updated",
        passwordUpdated(
          userDetails.email,
          `Password updated successfully for ${userDetails.firstName} ${userDetails.lastName}`
        )
      )
      console.log("Email sent successfully:", emailResponse)
    } catch (error) {
      // If there's an error sending the email, log the error and return a 500 (Internal Server Error) error
      console.error("Error occurred while sending email:", error)
      return res.status(500).json({
        success: false,
        message: "Error occurred while sending email",
        error: error.message,
      })
    }

    return res
   .status(200)
   .json({ success: true, message: "Password updated successfully" })

  }
  catch(err){
    console.log("Error while changing password" , err);
    return res.status(500).json({
      success : false,
      message : "Error while changing the password"
    })
  }

}



// **********************************************************************
// **********************************************************************
//                          Forgot password                             *
// **********************************************************************
// **********************************************************************


exports.forgotPassword = async (req , res) =>{

  try{

    const { email } = req.body;

    const user = User.find({email});

    if(!user){
      return res.status(401).json({
        success : false,
        message : "Provided email does not registered"
      })
    }

    const token = crypto.randomBytes(20).toString("hex")

    const updatedDetails = await User.findOneAndUpdate(
      { email: email },
      {
        resetPasswordToken: token,
        resetPasswordExpires: Date.now() + 3600000,
      },
      { new: true }
    )
    console.log("DETAILS", updatedDetails)

    const url = `http://localhost:5173/reset-password/${token}`
    // const url = `https://studynotion-edtech-project.vercel.app/update-password/${token}`






    try {
      const emailResponse = await mailSend(
       email,
        "Reset Password",
        passwordUpdated(
          updatedDetails.email,
          `Your Link for email verification is ${url}. Please click this url to reset your password.`
        )
      )
      console.log("Email sent successfully:", emailResponse.response)

      return res.status(200).json({
        success : true,
        message : "Password change link sended successfully to your email !"
      })
    } catch (error) {
      // If there's an error sending the email, log the error and return a 500 (Internal Server Error) error
      console.error("Error occurred while sending email:", error)
      return res.status(500).json({
        success: false,
        message: "Error occurred while sending email",
        error: error.message,
      })
    }


  }catch(err){
    console.log("Error while forgot password : " , err);
    return res.status(500).json({
      success : false,
      message : "Error while forget password , please try again"
    })
  }

}



// **********************************************************************
// **********************************************************************
//                          Change Forgot password                      *
// **********************************************************************
// **********************************************************************

exports.resetPassword = async (req , res) =>{

  try{

    const { password , confirmPassword  , token} = req.body;

    console.log("Token" , token);

    if(!password || !confirmPassword ){
      return res.status(401).json({
        success : false,
        message : "Please fill all fields"
      })
    }

    if(password  != confirmPassword ){
      return res.status(401).json({
        success : false,
        message : "Password not match"
      })
    }

    const data = await User.findOne({ resetPasswordToken: token});


    // if(!data){
    //   return res.status(404).json({
    //     success : false,
    //     message : "Token is not valid"
    //   })
    // }

    console.log("DAta" , data);

    if(!(data.resetPasswordExpires > Date.now())){

      return res.status(498).json({
        success : false,
        message : "Token get expired try again"
      })

    }

    const encryptedPassword = await bcrypt.hash(password , 12);


    const updatedUser = await User.findOneAndUpdate(
      { resetPasswordToken: token }, // Query: Find user by resetPasswordToken
      { password: encryptedPassword }, // Update: Set the new password
      { new: true } // Options: Return the updated document
    );
    
    console.log("UpdateUser" , updatedUser);

    return res.status(200).json({
      success :  true ,
      message : "Password has been changed"
    })

    // try {
    //   const emailResponse = await mailSend(
    //    email,
    //     "Reset Password",
    //     passwordUpdated(
    //       updatedDetails.email,
    //       `Your Link for email verification is ${url}. Please click this url to reset your password.`
    //     )
    //   )
    //   console.log("Email sent successfully:", emailResponse.response)

    //   return res.status(200).json({
    //     success : true,
    //     message : "Password change link sended successfully to your email !"
    //   })
    // } catch (error) {
    //   // If there's an error sending the email, log the error and return a 500 (Internal Server Error) error
    //   console.error("Error occurred while sending email:", error)
    //   return res.status(500).json({
    //     success: false,
    //     message: "Error occurred while sending email",
    //     error: error.message,
    //   })
    // }


  }catch(err){
    console.log("Error while forgot password : " , err);
    return res.status(500).json({
      success : false,
      message : "Error while reset password , please try again"
    })
  }

}



