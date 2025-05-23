const BookReview = require("../../models/BookReviewModels/bookReviewSchema");
const User = require("../../models/userSchema");
const  {uploadImageToCloudinary} = require("../../utils/imageUploader");
const fs = require("fs");
const CommentOnReview = require("../../models/BookReviewModels/CommentOnReviewSchema");
const mongoose = require("mongoose")



// **********************************************************************
// **********************************************************************
//                          Review a book                               *
// **********************************************************************
// **********************************************************************

exports.reviewBook = async (req , res ) =>{


    try{

            const userId = req.user.id;
            const { heading , commentAboutBook , ratting } = req.body;
            // const coverImage = req.file;
            const bookImage = req.file;
         
            // console.log("Heading" , heading);
            // console.log("CommentAboutBook" , commentAboutBook);
            // console.log("review" , review);
            // console.log("BookImage" , bookImage);
            // console.log("CoverImage" , coverImage);

            const userExists = await User.findById(userId);

            if(!userExists){
                return res.status(404).json({
                    success : false,
                    message : "User does not exists"
                })
            }

            if(!heading || !commentAboutBook || !ratting  || !bookImage){

                return res.status(400).json({
                    success : false,
                    message : "Please fill all box"
                })

            }

            //Uploading to cloud 

            let result;
              if (bookImage) {
              result = await uploadImageToCloudinary(
                bookImage,
                "bookImage",
                500,
                80
              ); 
              fs.unlinkSync(bookImage.path); 
            }

            console.log("REsult " , result);

           const reviewData = await BookReview.create({
                author : userExists._id,
                bookImage : result.secure_url,
                heading,
                commentAboutBook,
                ratting

            })

            return res.status(200).json({
                success : true,
                message : "Book review submitted",
                data : reviewData
            })


    }
    catch(err){

        console.log("Error while review" , err);
        return res.status(500).json({
            success : false,
            message : "Error while giving review"
        })

    }




}
// **********************************************************************
// **********************************************************************
//                          Edit Review Book                             *
// **********************************************************************
// **********************************************************************

exports.editReviewBook = async (req , res ) =>{



    try{

            const userId = req.user.id;
            const { heading , commentAboutBook , ratting} = req.body;
            const {reviewId} = req.params;
            // const coverImage = req.file;
            const bookImage = req.file;
         
            // console.log("Heading" , heading);
            // console.log("CommentAboutBook" , commentAboutBook);
            // console.log("review" , review);
            // console.log("reviewId" , reviewId);
            // console.log("BookImage" , bookImage);
            // console.log("CoverImage" , coverImage);

            const userExists = await User.findById(userId);
            const isReviewExists = await BookReview.findById(reviewId);

            if(!isReviewExists){
                return res.status(404).json({
                    success : false,
                    message : "Review does not exists"
                })
            }

            if(!userExists){
                return res.status(404).json({
                    success : false,
                    message : "User does not exists"
                })
            }

            if(!heading || !commentAboutBook || !review ){

                return res.status(400).json({
                    success : false,
                    message : "Please fill all box"
                })

            }

            //Uploading to cloud 

            let result;
              if (bookImage) {
              result = await uploadImageToCloudinary(
                bookImage,
                "bookImage",
                500,
                80
              ); 
              fs.unlinkSync(bookImage.path); 
            }

            // console.log("REsult " , result);

             if (result){
                await BookReview.findByIdAndUpdate(
                    reviewId,
                      { 
                       bookImage : result.secure_url,
                   },
                       {
                           new : true
                       }
       
                   )
             }

           const reviewData = await BookReview.findByIdAndUpdate(
             reviewId,
               { 
                author : userExists._id,
                heading : heading,
                commentAboutBook : commentAboutBook,
                ratting : ratting
            },
                {
                    new : true
                }

            )

            return res.status(200).json({
                success : true,
                message : "Book review edited",
            })


    }
    catch(err){

        console.log("Error while editing book review" , err);
        return res.status(500).json({
            success : false,
            message : "Error while editing book review"
        })

    }




}

// **********************************************************************
// **********************************************************************
//                          Delete Review Book                           *
// **********************************************************************
// **********************************************************************

exports.deleteReviewBook = async (req , res ) =>{



    try{

            const userId = req.user.id;
            const {  reviewId} = req.params;
            // console.log("ReviewId" , reviewId);
            const userExists = await User.findById(userId);
            const isReviewExists = await BookReview.findById(reviewId);

            if(!isReviewExists){
                return res.status(404).json({
                    success : false,
                    message : "Review does not exists"
                })
            }

            if(!userExists){
                return res.status(404).json({
                    success : false,
                    message : "User does not exists"
                })
            }

          await CommentOnReview.deleteMany({commentedOn : reviewId});
          await BookReview.findByIdAndDelete(reviewId);

            return res.status(200).json({
                success : true,
                message : "Book review deleted",
            })


    }
    catch(err){

        console.log("Error while deleting book review" , err);
        return res.status(500).json({
            success : false,
            message : "Error while deleting book review"
        })

    }




}

// **********************************************************************
// **********************************************************************
//                          Get Review Book                             *
// **********************************************************************
// **********************************************************************

exports.getAllReviewsOfBook = async (req , res ) =>{



    try{

            const userId = req.user.id;
            // console.log("ReviewId" , reviewId);
            const userExists = await User.findById(userId);

            if(!userExists){
                return res.status(404).json({
                    success : false,
                    message : "User does not exists"
                })
            }

         const data = await BookReview.find({}).populate("author" , "-password").lean();

            return res.status(200).json({
                success : true,
                message : "Book review fetched successfully",
                data
            })


    }
    catch(err){

        console.log("Error while fetching  book review" , err);
        return res.status(500).json({
            success : false,
            message : "Error while fetching  book review"
        })

    }




}


// **********************************************************************
// **********************************************************************
//                          Get by Review Book id                       *
// **********************************************************************
// **********************************************************************

exports.getByReviewsId = async (req , res ) =>{



    try{

            const userId = req.user.id;
            // console.log("ReviewId" , reviewId);
            const userExists = await User.findById(userId);
            const { id } = req.params;
            if(!userExists){
                return res.status(404).json({
                    success : false,
                    message : "User does not exists"
                })
            }

         const data = await BookReview.findById(id).populate("author" , "-password").lean();
        

            return res.status(200).json({
                success : true,
                message : "Book review fetched successfully",
                data
            })


    }
    catch(err){

        console.log("Error while fetching  book review" , err);
        return res.status(500).json({
            success : false,
            message : "Error while fetching  book review"
        })

    }




}











// const mongoose = require("mongoose");
// const User = require("../models/User");
// const BookReview = require("../models/BookReview");

// exports.getByReviewsId = async (req, res) => {
//     try {
//         const userId = req.user.id;
//         const { id } = req.params;

//         // Validate ObjectId format
//         if (!mongoose.Types.ObjectId.isValid(id)) {
//             return res.status(400).json({
//                 success: false,
//                 message: "Invalid review ID",
//             });
//         }

//         // Check if user exists
//         const userExists = await User.findById(userId);
//         if (!userExists) {
//             return res.status(404).json({
//                 success: false,
//                 message: "User does not exist",
//             });
//         }

//         // Fetch book review and populate author details
//         const bookReview = await BookReview.findById(id).populate("author", "-password").lean();
//         if (!bookReview) {
//             return res.status(404).json({
//                 success: false,
//                 message: "Book review not found",
//             });
//         }

//         // Calculate average rating manually (assuming ratings are stored in an array)
//         let avgRating = null;
//         if (bookReview.ratings && bookReview.ratings.length > 0) {
//             const total = bookReview.ratings.reduce((sum, rating) => sum + rating, 0);
//             avgRating = total / bookReview.ratings.length;
//         }

//         return res.status(200).json({
//             success: true,
//             message: "Book review fetched successfully",
//             data: { ...bookReview, avgRating },
//         });

//     } catch (err) {
//         console.error("Error while fetching book review:", err);
//         return res.status(500).json({
//             success: false,
//             message: "Error while fetching book review",
//         });
//     }
// };
