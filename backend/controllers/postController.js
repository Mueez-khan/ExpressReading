const post = require("../models/postSchema");
const { uploadImageToCloudinary } = require("../utils/imageUploader");
const fs = require("fs");
const mongoose = require("mongoose");

require("dotenv").config();

exports.createPost = async (req, res) => {
  try {
    const { description } = req.body;
    const postImage = req.files;
    const author = req.user.id;

    // console.log("Description" , description)
    // console.log("image" , postImage)

    // console.log("Author id " , author)

    if (!description || !postImage) {
      return res.status(400).json({
        success: false,
        message: "You can not make empty post",
      });
    }

    let imageUrls = [];
    if (postImage && postImage.length > 0) {
      const imageUploadPromises = postImage.map(async (file) => {
        try {
          // console.log("Path ", file);
          // Adjust parameters as needed
          const result = await uploadImageToCloudinary(
            file,
            "postImages",
            500,
            80
          );
          // Delete the local file after uploading to Cloudinary
          fs.unlinkSync(file.path);
          return result.secure_url;
        } catch (uploadError) {
          console.error("Error uploading image:", uploadError);
          throw new Error("Error uploading image to Cloudinary");
        }
      });
      imageUrls = await Promise.all(imageUploadPromises);
    }

    const postData = await post.create({
      postImage: imageUrls,
      description,
      author: author,
    });

    // console.log("Post data " , postData);

    return res.status(200).json({
      success: true,
      message: "Post created successfully",
      data: postData,
    });
  } catch (err) {
    console.log("Error", err);
    return res.status(401).json({
      success: false,
      message: "Error while posting, please try again",
    });
  }
};

// **********************************************************************
// **********************************************************************
//                          Edit post                                   *
// **********************************************************************
// **********************************************************************

exports.updatePost = async (req, res) => {
  try {
    const postId = req.params.postId; // Assuming userId is passed as a URL parameter
    const { description } = req.body;
    const postImage = req.files;
    // Update user profile

    // console.log("Request Params:", req.params);

    // console.log("Post id", postId);

    if (!mongoose.Types.ObjectId.isValid(postId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Post ID format",
      });
    }

    const foundPost = await post.findOne({_id : postId} );

    // console.log("foundpost", foundPost);

    if (!foundPost) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    let imageUrls = [];
    if (postImage && postImage.length > 0) {
      const imageUploadPromises = postImage.map(async (file) => {
        try {
          console.log("Path ", file);
          // Adjust parameters as needed
          const result = await uploadImageToCloudinary(
            file,
            "postImages",
            500,
            80
          );
          //   console.log("Result" , result)
          // Delete the local file after uploading to Cloudinary
          fs.unlinkSync(file.path);
          return result.secure_url;
        } catch (uploadError) {
          console.error("Error uploading image:", uploadError);
          throw new Error("Error uploading image to Cloudinary");
        }
      });
      imageUrls = await Promise.all(imageUploadPromises);
    }

    const updatedPost = await post.findByIdAndUpdate(
      postId,
      {
        description,
        postImage: imageUrls,
      },
      { new: true, runValidators: true } // Options to return the updated document and run validations
    );

    // console.log("Update post" , updatedPost)

    // Check if profile exists
    if (!updatedPost) {
      return res.status(404).json({
        success: false,
        message: "User profile not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Post updated successfully",
      data: updatedPost,
    });
  } catch (err) {
    console.error("Error updating post:", err);
    return res.status(500).json({
      success: false,
      message: "Error while updating the post",
    });
  }
};

// **********************************************************************
// **********************************************************************
//                          delete post                                  *
// **********************************************************************
// **********************************************************************

exports.deletePost = async (req, res) => {
  try {
    const postId = req.params.postId;
    // console.log("PostId" , postId);

    // console.log("UserId" , userId);

    if (!mongoose.Types.ObjectId.isValid(postId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Post ID format",
      });
    }

    const postPresent = await post.findOne({ _id: postId });

    // console.log("Post Found" , postPresent);

    if (!postPresent) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    const deletedPost = await post.findByIdAndDelete(postPresent._id);

    // console.log("deletedPost" , deletedPost);

    return res.status(200).json({
      success: true,
      message: "Post deleted successfully",
    });
  } catch (err) {
    console.error("Error deleting post:", err);
    return res.status(500).json({
      success: false,
      message: "Error while deleting the post",
    });
  }
};

// **********************************************************************
// **********************************************************************
//                          Get all posts                               *
// **********************************************************************
// **********************************************************************

exports.getAllPosts = async (req, res) => {
  try {
    // const allPosts = await post.find({}).populate('author').select('-password').exec();
    const allPosts = await post.aggregate([
      {$sample : {size : 10} },
      {
        $lookup : {  // lookup is same as populate
          from : "users",
          localField : "author",
          foreignField : "_id",  // Author ke schema match krna hai isko 
          as : "author"
        }
      },
      {

        $unwind : "$author"

      }, 
      {

        $project : {
          "author.password" : 0
        }

      }
    ])

    if (!allPosts) {
      return res.status(404).json({
        success: false,
        message: "Posts not Found",
      });
    }

    // console.log("Posts : ", allPosts);

    return res.status(200).json({
      success: true,
      message: "Fetched all posts",
      data: allPosts,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Error while fetching posts please reload",
    });
  }
};


// **********************************************************************
// **********************************************************************
//                          Get Specific  post                               *
// **********************************************************************
// **********************************************************************

exports.getPostById = async (req, res) => {
  try {
    // const allPosts = await post.find({}).populate('author').select('-password').exec();
    const { postId }  = req.params;
    // console.log("PostId" , postId);
    const specificPost = await post.findById(postId).populate("author", "-password").lean();

    if (!specificPost) {
      return res.status(404).json({
        success: false,
        message: "Post not Found",
      });
    }

    // console.log("Posts : ", specificPost);

    return res.status(200).json({
      success: true,
      message: "Post data Fetched",
      data: specificPost,
    });
  } catch (err) {
    console.log("Error while fetching specific post" , err)
    return res.status(500).json({
      success: false,
      message: "Error while fetching posts please reload",
    });
  }
};




// **********************************************************************
// **********************************************************************
//                          Get Specific  post by author id             *
// **********************************************************************
// **********************************************************************


exports.getPostByUserId = async (req, res) => {
  try {
    // const allPosts = await post.find({}).populate('author').select('-password').exec();
    const { userId }  = req.params;
    // console.log("PostId" , userId);
    const specificPost = await post.find({author : userId}).populate("author", "-password").lean();

    if (!specificPost) {
      return res.status(404).json({
        success: false,
        message: "Post not Found",
      });
    }

    // console.log("Posts : ", specificPost);

    return res.status(200).json({
      success: true,
      message: "Post data Fetched",
      data: specificPost,
    });
  } catch (err) {
    console.log("Error while fetching specific post" , err)
    return res.status(500).json({
      success: false,
      message: "Error while fetching posts please reload",
    });
  }
};
