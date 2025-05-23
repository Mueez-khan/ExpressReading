const Comment = require("../models/comments");
const mongoose = require("mongoose");
const User = require("../models/userSchema");
const post = require("../models/postSchema");

exports.userComment = async (req, res) => {
  try {
    // Add post validation that post is present if deleted don't allow comment.

    const { commentText, authorName } = req.body;
    const postId = req.params.postId;
    const authorId = req.user.id;
    // console.log("UserId" , author);
    // console.log("PostId" , postId);
    // console.log("CommentText" , commentText);

    if(!authorId){
        return res.status(403).json({
            success: false,
            message: "Please login",
          });
    }

    if (!postId) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    if (!commentText) {
      return res.status(401).json({
        success: false,
        message: "Comment can not be empty",
      });
    }

    const commentDetail = await Comment.create({
      commentText,
      authorId,
      authorName,
      post: postId,
      parentComment: null,
    });

    await post.findByIdAndUpdate(
      postId,
      { $inc: { comments: 1 } },
      { new: true }
    );

    // console.log("Comment details" , commentDetail);

    return res.status(200).json({
      success: true,
      message: "Comment added",
      data: commentDetail,
    });
  } catch (err) {
    console.log("Error while commenting ", err);
    return res.status(500).json({
      success: false,
      message: "Error occur while commenting, Please try again",
    });
  }
};

// **********************************************************************
// **********************************************************************
//                          Replay to comment                           *
// **********************************************************************
// **********************************************************************

exports.replayToComment = async (req, res) => {
  try {
    const { commentID, authorName } = req.body;
    const { commentText } = req.body;
    const authorId = req.user.id;
    console.log("CommentId", commentID);
    console.log("CommentText", commentText);

    if (!mongoose.Types.ObjectId.isValid(commentID)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Comment ID format",
      });
    }

    const ParentComment = await Comment.findById(commentID);

    console.log("ParentCommentID", ParentComment);

    if (!commentText) {
      return res.status(401).json({
        success: false,
        message: "The comment can not be empty",
      });
    }

    if (!ParentComment) {
      return res.status(404).json({
        success: false,
        message: "The comment on which you want to reply  not found",
      });
    }

    const CommentReply = await Comment.create({
      post: ParentComment.post,
      authorId,
      authorName,
      commentText,
      parentComment: commentID,
    });

    console.log("Comment Reply", CommentReply);

    ParentComment.replies.push(CommentReply._id);
    await ParentComment.save();

    await post.findByIdAndUpdate(
      ParentComment.post,
      { $inc: { comments: 1 } },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: "Reply added",
    });
  } catch (err) {
    console.log("Error while replying to comment", err);
    return res.status(500).json({
      success: false,
      message: "Error occur while reply on comment",
    });
  }
};

// **********************************************************************
// **********************************************************************
//                          Delete    comment                           *
// **********************************************************************
// **********************************************************************

exports.deleteComment = async (req, res) => {
  try {
    const commentID = req.params.commentID;
    const userID = req.user.id;

    console.log("UserId", userID);
    console.log("CommentId", commentID);

    if (!mongoose.Types.ObjectId.isValid(commentID)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Comment ID format",
      });
    }

    const isCommentPresent = await Comment.findById(commentID);

    if (!isCommentPresent) {
      return res.status(404).json({
        success: false,
        message: "The Comment not found",
      });
    }

    await deleteCommentAndReplies(commentID);

    await post.findByIdAndUpdate(
      isCommentPresent.post,
      { $inc: { comments: -1 } },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: "Comment deleted",
    });
  } catch (err) {
    console.log("Error while replying to comment", err);
    return res.status(500).json({
      success: false,
      message: "Error occur while reply on comment",
    });
  }
};

async function deleteCommentAndReplies(commentId) {
  const comment = await Comment.findById(commentId);

  if (!comment) {
    throw new error("Comment not Found");
  }

  // console.log("CommentParent", comment.parentComment);

  if (comment.parentComment) {
    await Comment.findByIdAndUpdate(comment.parentComment, {
      $pull: { replies: commentId },
    });
  }

  for (const replies of comment.replies) {
    await Comment.findByIdAndDelete(replies);
  }

  await Comment.findByIdAndDelete(commentId);
}

// **********************************************************************
// **********************************************************************
//                          Update    comment                           *
// **********************************************************************
// **********************************************************************

exports.updateComment = async (req, res) => {
  try {
    
    const { commentText , commentID } = req.body;
    const userId = req.user.id;

    console.log("CommentId", commentID);
    console.log("UserId", userId);

    const user = User.findById({ userId });

    if (!mongoose.Types.ObjectId.isValid(commentID)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Comment ID format",
      });
    }

    const commentPresent = await Comment.findById(commentID);

    if (!commentText) {
      return res.status(500).json({
        success: false,
        message: "Comment can not be empty",
      });
    }

    if (!commentPresent) {
      return res.status(404).json({
        success: false,
        message: "Comment not present",
      });
    }

    if (!user) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to update this comment",
      });
    }
    // if (Comment.author.toString() !== user) { Update this if require
    //     return res.status(403).json({
    //       success: false,
    //       message: 'You are not authorized to update this comment',
    //     });
    //   }

    const commentDetail = await Comment.findByIdAndUpdate(
      commentID,
      { commentText: commentText },
      { new: true }
    );

    // Comment.commentText = commentText;
    // const comment = await Comment.save();

    console.log("Comment ", commentDetail);

    res.status(200).json({
      success: true,
      message: "Comment updated successfully",
      data: commentDetail,
    });
  } catch (err) {
    console.log("Error while updating the comment", err);
    return res.status(500).json({
      success: false,
      message: "Error occur while updating the comment",
    });
  }
};

// **********************************************************************
// **********************************************************************
//                          Get    comment                              *
// **********************************************************************
// **********************************************************************

exports.getComments = async (req, res) => {
  try {
    const postId = req.params.postId;

    // console.log("PostId getComments" , postId);

    // const allComments = await Comment.findOne({post : postId})
    // .populate('author')
    // .populate({
    //     path: 'replies',
    //     populate: {
    //       path: 'replies',

    //     },
    //     populate: {
    //       path: 'author', // Populates replies of replies

    //     },
    //   }).exec();

    //           const allComments = await Comment.find({ post: postId, parentComment: null }) // Top-level comments
    //  // Populate author of top-level comments
    //   .populate({
    //     path: 'replies',
    //     populate: [
    //        // Populate author of replies
    //       {
    //         path: 'replies',
    //         path : 'parentComment' // Populate nested replies
    //      // Populate author of nested replies
    //       },
    //         {
    //             path : 'replies',
    //             path : 'parentComment'
    //         },
    //         {
    //             path : 'replies',
    //             path : 'parentComment'
    //         },
    //         {
    //             path : 'replies',
    //             // path : 'parentComment'
    //         }
    //     ],
    //   })
    //   .exec();

    const populateReplies = (depth = 50) => {

        if (depth <= 0){
            return null;
        }

        return {
            path: 'replies',
            populate: [
                {
                    path: 'parentComment'
                },
                populateReplies(depth - 1)
            ].filter(Boolean),
        };
    };

    const allComments = await Comment.find({
      post: postId,
      parentComment: null,
    })
      .populate(populateReplies())
      .exec();

    if (!allComments) {
      return res.status(404).json({
        success: false,
        message: "There no message found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "All comments are fetched for this post",
      data: allComments,
    });
  } catch (err) {
    console.log("Error while getting the comments", err);
    return res.status(500).json({
      success: false,
      message: "Error occur while getting the comments",
    });
  }
};
