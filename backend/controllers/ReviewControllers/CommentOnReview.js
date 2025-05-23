const BookReview = require("../../models/BookReviewModels/bookReviewSchema");
const CommentOnReview = require("../../models/BookReviewModels/CommentOnReviewSchema");


// **********************************************************************
// **********************************************************************
//                          Comment on Review                           *
// **********************************************************************
// **********************************************************************


exports.ReviewComment = async (req , res) =>{

    try{

        
        const {postId} = req.params;
        const userId = req.user.id;

        // console.log("UserId" , userId);
        // console.log("PostId" , postId);
         const { comment  , ratting } = req.body;
         
         if(!comment || !ratting){
            return res.status({
                success : false,
                message : "All fields are required"
            })
         }

         await CommentOnReview.create({
            author : userId,
            commentedOn : postId,
            comment ,
            ratting

         })

         await BookReview.findByIdAndUpdate(
            postId,
            {
                $inc : {
                    
                    commentsCount : 1,
                    totalRatting : ratting

                }
            },
        
            {new : true}
         )


         return res.status(200).json({
            success : true,
            message : "Comment added successfully"
         })

    }
    catch(err){
        console.log("Error while commenting on review" , err);
        return res.status(500).json({
            success : false,
            message : "Error while commenting on review"
        })
    }

}


// **********************************************************************
// **********************************************************************
//                        Edit  Comment on Review                        *
// **********************************************************************
// **********************************************************************


exports.EditReviewComment = async (req , res) =>{

    try{

        
        const userId = req.user.id;

        const { comment  , ratting  } = req.body;
        const  { postId }  = req.params;
        console.log("Comment" , comment)
        console.log("Review" , ratting)
        // console.log("UserId" , userId);
        // console.log("ReviewId" , postId);

        const isPostAvailable = CommentOnReview.find({postId});

        if(!isPostAvailable){
            return res.status(404).json({
                success : false,
                message : "Post not available"
            })
        }
         
         if(!comment || !ratting){
            return res.status({
                success : false,
                message : "All fields are required"
            })
         }

         const data = await CommentOnReview.findByIdAndUpdate(
            postId,
            {
            author : userId,
             comment ,
             ratting
            })

         return res.status(200).json({
            success : true,
            message : "Comment edited successfully",
            data
         })

    }
    catch(err){
        console.log("Error while editing commenting on review" , err);
        return res.status(500).json({
            success : false,
            message : "Error while editing commenting on review"
        })
    }

}


// **********************************************************************
// **********************************************************************
//                        delete  Comment on Review                     *
// **********************************************************************
// **********************************************************************


exports.DeleteReviewComment = async (req , res) =>{

    try{

        
        const userId = req.user.id;
        const{ postId } = req.params;
     
        const isPostAvailable = CommentOnReview.find({postId});

        if(!userId){
            return res.status(404).json({
                success : false,
                message : "User not available"
            })
        }

        if(!isPostAvailable){
            return res.status(404).json({
                success : false,
                message : "Post not available"
            })
        }
         
        await CommentOnReview.findByIdAndDelete(postId)
         
        await BookReview.findByIdAndUpdate(
            postId,
            {
                $inc : { commentsCount : -1}
            },
            {new : true}
         )


         return res.status(200).json({
            success : true,
            message : "Comment deleted successfully"
         })

    }
    catch(err){
        console.log("Error while deleting commenting on review" , err);
        return res.status(500).json({
            success : false,
            message : "Error while deleting commenting on review"
        })
    }

}


// **********************************************************************
// **********************************************************************
//                        Get Comments                                  *
// **********************************************************************
// **********************************************************************


exports.getReviewCommentById = async (req , res) =>{

    try{

        
        const userId = req.user.id;
        const  {postId}  = req.params;
     
      
        // console.log("Post id " , postId)
        if(!userId){
            return res.status(404).json({
                success : false,
                message : "User not available"
            })
        }

       
         
       const data =  await CommentOnReview.find({commentedOn : postId}).populate("author" , "-password").populate("commentedOn").lean();
         
        


         return res.status(200).json({
            success : true,
            message : "successfully get data",
            data
         })

    }
    catch(err){
        console.log("Error while getting comment on review" , err);
        return res.status(500).json({
            success : false,
            message : "Error while getting comment on review"
        })
    }

}