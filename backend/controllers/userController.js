const User = require("../models/userSchema.js");


exports.getUserDetailsById = async (req ,res) =>{


    try{
        
        const {userId} = req.params;
        // console.log("USerid" , userId);

        // if(!userId){
        //     return res.status(400).json({
        //         success : false,
        //         message : "User id not provided"
        //     })
        // }

        const userDetails = await User.findById(userId).select("-password").populate("profile").lean();
    
        if(!userDetails){
            return res.status(404).json({
                success : false,
                message : "User not found"
            })
        }


        return res.status(200).json({
            success : true,
            message : "User data fetched ",
            data : userDetails
        })

    }
    catch(err){
        console.log("Error while fetching user details" , err);
        return res.status(500).json({
            success : false,
            message : "Error while fetching user details"
        })
    }

}