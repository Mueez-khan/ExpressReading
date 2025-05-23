const likePost = require("../models/LikesSchema");
const User = require("../models/userSchema");
const post = require("../models/postSchema");

// **********************************************************************
// **********************************************************************
//                          Like post                                   *
// **********************************************************************
// **********************************************************************

exports.postLike = async (req , res) =>{


    try{

        const { postId , userId } = req.body;

        // console.log("Userid" , userId);
        // console.log('PostId' , postId);

        const userDetail = await User.find({userId});


        if(!userDetail){
            return res.status(404).json({
                success : false,
                message : "User not found" 
            })
        }

        const likeDetail = await likePost.findOne({
            postId,
            userId
        });

        if(likeDetail){
            return res.status(403).json({

                success : false,
                message : "You can't like post twice"

            })
        }

        const like = await likePost.create({
            postId,
            userId
        });

         await post.findByIdAndUpdate(
            postId,
            { $inc : {likeCount : 1}},
            {new : true}
        )

        // console.log("Like " , like);

        return res.status(200).json({
            success : true,
            message : "Liked post"
        })

    }
    catch(err){

        console.log("Error while liking post" , err);

        return res.status(500).json({

            success : false,
            message : "Error while liking post"

        })

    }


}


// **********************************************************************
// **********************************************************************
//                          dislike                                     *
// **********************************************************************
// **********************************************************************


exports.dislike = async (req , res ) =>{

    try{

        const { postId , userId } = req.body;

        if(!postId || !userId){
            return res.status(403).json({
                success : false,
                message : "Provide both post and user id"
            })
        }

        const likeDetail = await  likePost.findOne({
            postId,
            userId
        });

        //  console.log("Like detail " , likeDetail)

        if(!likeDetail){
            return res.status(404).json({
                success : false,
                message : "Fist like post "
            })
        }


        const dislike = await likePost.findOneAndDelete({
            postId  : postId,
            userId : userId
        })

        await post.findByIdAndUpdate(
            postId,
            { $inc : {likeCount : -1}},
            {new : true}
        )
    
        if (!dislike) {
            return res.status(404).json({
                success: false,
                message: "Like not found - post may already be disliked"
            });
        }


        return res.status(200).json({
            success: true,
            message: "Post disliked successfully",

        })


    }
    catch(err){

        console.log("Error while disliking post"  ,  err);

        return res.status(500).json({

            success : false,
            message : "Error while disliking post"

        })

    }

}


exports.isLiked = async  (req , res)  =>{

    try{

        const { postId , userId } = req.body;

        // console.log("Userid" , userId);
        // console.log("PostId" , postId);
        if(!postId || !userId){

        return res.status(403).json({

            success : false,
            message : "Post and user Id both are required"

        })

        }

        const isLike = await likePost.findOne({
            postId , 
            userId
        })

        if(!isLike){
          
            return res.status(200).json({
                success: false,
                message: "Post not liked",
            });

        }


        return res.status(200).json({

            success : true,
            message : "Post liked"

        })

    }
    catch(err){
        console.log("Error while checking like"  ,  err);

        return res.status(500).json({

            success : false,
            message : "Error while  checking like "

        })
    }

}