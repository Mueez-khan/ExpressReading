import { useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";

export default function UpdateComment({ commentId , comment}) {


  // console.log("CommentID", commentId);
  // console.log("Reply data" , comment);
  const user = useSelector((state) => state.auth.user);

  const [replyText, setReplyText] = useState(comment.commentText);
//   const [conn]
    
    
  

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      //    console.log("id" , commentId);
      const token = localStorage.getItem("token");
      const response = await axios.put(
        "http://localhost:8000/api/v1/post/editComment",
        {
          commentID: commentId,
          commentText: replyText,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setReplyText("");
      // console.log("Response", response);
    } catch (error) {
      console.error("Error submitting reply:", error);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="mt-2 space-y-2">
        <textarea
          value={replyText}
          onChange={(e) => setReplyText(e.target.value)}
          placeholder="Update the text..."
          className="w-full p-2 border rounded"
          required
        />
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Update
        </button>
      </form>
    </div>
  );
}
