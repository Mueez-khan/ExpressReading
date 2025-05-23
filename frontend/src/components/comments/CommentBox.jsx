import { useState } from "react";
import ReplyToComment from "./ReplyToComment";
import UpdateComment from "./UpdateComment";
import { useSelector } from "react-redux";
import UseCommentDelete from "../../hooks/UseCommentDelete";
import { useNavigate } from "react-router-dom";

export default function CommentBox({ props }) {
  const { deleteComment } = UseCommentDelete();
  const user = useSelector((state) => state.auth.user);
  const [showReplyForm, setShowReplyForm] = useState({});
  const [showUpdateForm, setShowUpdateForm] = useState({});
  const navigate = useNavigate();
  // console.log(props)
  const handleCommentDelete = async (id) => {
    deleteComment(id);
  };
  
  const toggleVisibility = (stateUpdater, id) => {
    stateUpdater((prev) => ({ ...prev, [id]: !prev[id] }));
  };
  
  const moveToProfile = (id) =>{
    navigate(`/user/${id}`)
  }

  return (
    <div className="">
      {props?.map((reply) => (
        <div key={reply._id} className=" bg-gray-100  rounded-lg border border-l-gray-800 pl-4">
          <p className="text-sm text-gray-600">
            Reply to <span  className="font-semibold">@{reply.parentComment?.authorName || "Unknown"}</span>
          </p>
          <h1 onClick={() => moveToProfile(reply?.authorId)} className="font-semibold text-gray-900">
          {reply.authorName}
          </h1>
          <p className="text-gray-800 mt-1">{reply.commentText}</p>

          {/* Action Buttons */}
          <div className="mt-2 flex space-x-3">
            <button
              onClick={() => toggleVisibility(setShowReplyForm, reply._id)}
              className="text-sm text-green-600 hover:text-green-800 transition"
            >
              {showReplyForm[reply._id] ? "Cancel Reply" : "Reply"}
            </button>

            {user._id === reply.authorId && (
              <>
                <button
                  onClick={() => handleCommentDelete(reply._id)}
                  className="text-sm text-red-600 hover:text-red-800 transition"
                >
                  Delete
                </button>
                <button
                  onClick={() => toggleVisibility(setShowUpdateForm, reply._id)}
                  className="text-sm text-blue-600 hover:text-blue-800 transition"
                >
                  {showUpdateForm[reply._id] ? "Cancel Update" : "Update"}
                </button>
              </>
            )}
          </div>

          {/* Reply Form */}
          {showReplyForm[reply._id] && (
            <div className="mt-3">
              <ReplyToComment
                commentId={reply._id}
                onReplySubmit={() => toggleVisibility(setShowReplyForm, reply._id)}
              />
            </div>
          )}

          {/* Update Form */}
          {showUpdateForm[reply._id] && (
            <div className="mt-3">
              <UpdateComment
                commentId={reply._id}
                comment={reply}
                onReplySubmit={() => toggleVisibility(setShowUpdateForm, reply._id)}
              />
            </div>
          )}

          {/* Nested Replies */}
          {reply.replies && (
            <div className="mt-4  ">
              <CommentBox key={reply._id} props={reply.replies} />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
