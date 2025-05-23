// ReviewPopup.js
import { useState } from "react";
import axios from "axios"
import { useParams } from "react-router-dom";

const UpdateReviewComment = ({ isVisible, onClose , id  }) => {
  const [text, setText] = useState("");
  const [rating, setRating] = useState(1);
  const [error, setError] = useState("");
  // const postId = useParams();
  // console.log("Id" , id);
  const handleTextChange = (e) => {
    const inputText = e.target.value;
    if (inputText.length > 250) {
      setError("Text cannot exceed 250 characters.");
    } else {
      setError("");
    }
    setText(inputText);
  };

  const handleSubmit = async () => {
    if (text.length <= 250 && text.length > 0) {
        const token = localStorage.getItem("token");
        const response = await axios.put(`http://localhost:8000/api/v1/book/editCommentOnReview/${id}` ,{ 
            comment : text,
            ratting : rating},{
                headers : {
                    Authorization : `Bearer ${token}`,
                    "Content-Type" : "application/json"
                }
            }

        )
        console.log("Response" , response);

      setText("");
      onClose();
    } else {
      setError("Review field can not be empty.");
    }

  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-96">
        <button
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
          onClick={onClose}
        >
          ✕
        </button>
        <h2 className="text-xl font-semibold mb-4">Update Review</h2>
        <textarea
          className="w-full border rounded-lg p-2 mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Write your review (max 250 characters)"
          value={text}
          onChange={handleTextChange}
        />
         <label className="block mb-2 text-sm font-medium text-gray-700">
          Rating (1 to 5):
        </label>
        <select
          value={rating}
          onChange={(e) => setRating(Number(e.target.value))}
          className="w-full border rounded-lg p-2 mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {[1, 2, 3, 4, 5].map((value) => (
            <option key={value} value={value}>
              {value}
            </option>
          ))}
        </select>
        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
        <button
          onClick={handleSubmit}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
        >
          Update Comment
        </button>
      </div>
    </div>
  );
};

export default UpdateReviewComment;
