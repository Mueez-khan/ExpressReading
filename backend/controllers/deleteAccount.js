const User = require("../models/userSchema");
const post = require("../models/postSchema");
const comment = require("../models/comments");

exports.deleteAccount = async (req , res) => {

    try{

        const userId = req.user.id;

        console.log("UserID"  , userId);

        const deletePostDetails =  await post.deleteMany({author : userId});
        console.log("Delete post details" , deletePostDetails);

        // const deleteCommentsDetails =  await comment.deleteMany({author : userId});
        // console.log("Delete Comments details" , deleteCommentsDetails);

        const deleteUser = await User.findByIdAndDelete(userId);
        console.log("Delete user details" , deleteUser);

        return res.status(200).json({
            success : true,
            message : "User account deleted Successfully"
        })

    }
    catch(err){
        console.log("Error while deleting the account" , err);
        return res.status(500).json({
            success : false ,
            message : "Error occur while deleting the account"
        })
    }

}
