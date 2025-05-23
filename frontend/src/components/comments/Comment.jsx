import { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import CommentBox from "./CommentBox";
import ReplyToComment from "./ReplyToComment";
import UpdateComment from "./UpdateComment";
import { useSelector } from "react-redux";
import UseCommentDelete from "../../hooks/UseCommentDelete";
import { useNavigate } from "react-router-dom"

export default function Comment() {


  const navigate = useNavigate();

  const { deleteComment } = UseCommentDelete();
  const user = useSelector((state) => state.auth.user);
  const { id: postId } = useParams();
  const [comments, setComments] = useState([]);
  const [showReplies, setShowReplies] = useState({});
  const [showReplyForm, setShowReplyForm] = useState({});
  const [showUpdateForm, setShowUpdateForm] = useState({});
  const POLLING_TIME = 5000

  const getComments = async () => {
    const response = await axios.get(`http://localhost:8000/api/v1/post/comments/${postId}`);
    // console.log(response);
    setComments(response.data.data);
  };

  const handleCommentDelete = async (id) => {
    deleteComment(id);
    setComments(comments.filter(comment => comment._id !== id));
  };

  const toggleVisibility = (stateUpdater, id) => {
    stateUpdater((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  useEffect(() => {
    getComments();

    const interval = setInterval(getComments , POLLING_TIME);

    return () => clearInterval(interval);

  }, []);

  const moveToUserProfile = (id) =>{
    navigate(`/user/${id}`)
  }

  return (
    <div className="w-full mx-auto my-6 p-4 bg-white shadow-lg rounded-lg border border-b-3">
      {comments.length > 0 ? (
        comments.map((comment) => (
          <div key={comment._id} className="mb-6 p-4 bg-gray-100 rounded-lg shadow-md ">
            <div className="flex justify-between items-center mb-2">
              <h1 onClick={() => moveToUserProfile(comment?.authorId)} className="font-semibold text-lg text-gray-800">{comment.authorName}</h1>
              {user._id === comment.authorId && (
                <div className="space-x-2">
                  <button
                    onClick={() => handleCommentDelete(comment._id)}
                    className="px-3 py-1 text-sm text-white bg-red-500 rounded-lg shadow hover:bg-red-600 transition"
                  >
                    Delete
                  </button>
                  <button
                    onClick={() => toggleVisibility(setShowUpdateForm, comment._id)}
                    className="px-3 py-1 text-sm text-white bg-blue-500 rounded-lg shadow hover:bg-blue-600 transition"
                  >
                    {showUpdateForm[comment._id] ? "Cancel Update" : "Update"}
                  </button>
                </div>
              )}
            </div>
            <p className="text-gray-700 mb-3">{comment.commentText}</p>

            {/* Toggle reply form */}
            <div className="space-x-2">
              {comment.replies?.length > 0 && (
                <button
                  onClick={() => toggleVisibility(setShowReplies, comment._id)}
                  className="text-sm text-blue-500 hover:underline"
                >
                  {showReplies[comment._id] ? "Hide Replies" : "Show Replies"}
                </button>
              )}
              <button
                onClick={() => toggleVisibility(setShowReplyForm, comment._id)}
                className="text-sm text-green-500 hover:underline"
              >
                {showReplyForm[comment._id] ? "Cancel Reply" : "Reply"}
              </button>
            </div>

            {/* Reply Form */}
            {showReplyForm[comment._id] && (
              <div className="mt-3">
                <ReplyToComment
                  commentId={comment._id}
                  onReplySubmit={() => toggleVisibility(setShowReplyForm, comment._id)}
                />
              </div>
            )}

            {/* Update Form */}
            {showUpdateForm[comment._id] && (
              <div className="mt-3">
                <UpdateComment
                  commentId={comment._id}
                  comment={comment}
                  onReplySubmit={() => toggleVisibility(setShowUpdateForm, comment._id)}
                />
              </div>
            )}

            {/* Replies Section */}
            {showReplies[comment._id] && comment.replies && (
              <div className="mt-4 ">
                <CommentBox key={comment._id} props={comment.replies} />
              </div>
            )}
          </div>
        ))
      ) : (
        <p className="text-center text-gray-500">No comments yet.</p>
      )}
    </div>
  );
}
