import { useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";

export default function ReplyToComment  ({ commentId  })  {
    const user = useSelector((state) => state.auth.user);

    const [replyText, setReplyText] = useState('');
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      
      try {
    //    console.log("id" , commentId);
        const token = localStorage.getItem("token");
    const response = await axios.post('http://localhost:8000/api/v1/post/commentReply', {
        commentID : commentId,
        authorName : user.firstName,
        commentText : replyText
    } , {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
      setReplyText("");
        // console.log("Response" , response);
      } catch (error) {
        console.error('Error submitting reply:', error);
      }
    };
  
    return (
      <form onSubmit={handleSubmit} className="mt-2 space-y-2">
 
        <textarea
          value={replyText}
          onChange={(e) => setReplyText(e.target.value)}
          placeholder="Write your reply..."
          className="w-full p-2 border rounded"
          required
        />
        <button 
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Reply
        </button>
        
      </form>
    );
  };