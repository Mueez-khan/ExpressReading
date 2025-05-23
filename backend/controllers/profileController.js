const userProfile = require("../models/userProfile");
const User = require("../models/userSchema");

const { uploadImageToCloudinary } = require("../utils/imageUploader");
const fs = require("fs");

// **********************************************************************
// **********************************************************************
//                          Update profile                              *
// **********************************************************************
// **********************************************************************

exports.updateUserProfile = async (req, res) => {
  try {
    const userId = req.user.id; // Assuming userId is passed as a URL parameter
    const { firstName, lastName, gender, bio, favoriteWriter, lastBook } =
      req.body;

      console.log("Userid" , userId);

    // console.log("LAst book", req.body);
    const coverImage = req.files?.coverImage?.[0];
    const profileImage = req.files?.profileImage?.[0];


    console.log("Profile Image" , req.files?.profileImage?.[0]);
    console.log("Cover Image" , req.files?.coverImage?.[0]);
    // console.log("last book ", lastBook);

    const user = await User.findById(userId).populate("profile") .lean();

    if (user) {
       user.password = undefined;
    }
    

    // console.log("Cover image" , coverImage)

    const profile = await userProfile.findById(user.profile);

    if(!user){
      return res.status(404).json({
        success : false,
        message : "User does not exists"
      })
    }

    //   console.log("UserId" , userId)
    //     console.log("Profile" , profile.id)

    // console.log("CoverImage "  , coverImage)
    // console.log("Uploaded file details:", req.file);

    if (!userId) {
      return res.status(404).json({
        success: false,
        message: "You are not authorized to update profile",
      });
    }

    let coverImageResult , profilePictureResult;
    // console.log("Cover image file: ", coverImage.file);  // Ensure it's an array or object containing path
    if (coverImage) {
      coverImageResult = await uploadImageToCloudinary(
        coverImage,
        "coverImages",
        500,
        80
      ); // Assuming it's an array
      // console.log("result ", result.secure_url);
      fs.unlinkSync(coverImage.path); // Delete the file after uploading
    }
  
    // console.log("Cover image file: ", coverImage.file);  // Ensure it's an array or object containing path
    if (profileImage) {
      profilePictureResult = await uploadImageToCloudinary(
        profileImage,
        "profileImage",
        500,
        80
      ); // Assuming it's an array
      // console.log("result ", result.secure_url);
      fs.unlinkSync(profileImage.path); // Delete the file after uploading
    }

    // Update user profile

    if(profilePictureResult){
      const response = await User.findByIdAndUpdate(
        userId,
        {
       
          userImage : profilePictureResult?.secure_url || user.userImage
        },
        { new: true }
      );

      console.log("Profile Picture -> " , response)
    }

    if (firstName || lastName ) {
      await User.findByIdAndUpdate(
        userId,
        {
          firstName,
          lastName,
          userImage : profilePictureResult?.secure_url || user.userImage
        },
        { new: true }
      );
    }

    // updateUser.save()
    // profile.coverImage = imageUrls
    // profile.gender = gender
    // profile.bio = bio
    // profile.favoriteWriter = favoriteWriter
    // profile.lastBook= lastBook

    // // Save the updated profile
    // await profile.save()

    if (coverImageResult) {
      const updatedCoverPicture = await userProfile.findByIdAndUpdate(
        profile.id,
        {
          coverImage: coverImageResult.secure_url ,
        },
        { new: true, runValidators: true } // Options to return the updated document and run validations
      );
    }

    const updatedProfile = await userProfile.findByIdAndUpdate(
      profile.id,
      {
        gender: gender,
        bio: bio,
        favoriteWriter: favoriteWriter,
        lastBook: lastBook,
      },
      { new: true, runValidators: true } // Options to return the updated document and run validations
    );

    // Check if profile exists
    if (!updatedProfile) {
      return res.status(404).json({
        success: false,
        message: "User profile not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: user
    });
  } catch (err) {
    console.error("Error updating profile:", err);
    return res.status(500).json({
      success: false,
      message: "Error while updating the profile",
    });
  }
};
