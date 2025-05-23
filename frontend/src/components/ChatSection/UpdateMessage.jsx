import { useState } from "react";
import axios from "axios";

const UpdateMessage = ({ isVisible, onClose, onSubmit  }) => {
  const [text, setText] = useState(""); 
//   const [error, setError] = useState("");
  const handleTextChange = (e) => {
    const inputText = e.target.value; 
    setText(inputText);
  };
//   console.log("MessageId " , messageId);

  const handleSubmit = async () => {
  
        const token = localStorage.getItem("token");
        const response = await axios.put(`http://localhost:8000/api/v1/message/updateMessage/${messageId}` ,{ 
            content : text
        }, 
             {
                headers : {
                    Authorization : `Bearer ${token}`,
                    "Content-Type" : "application/json" 
                }
            }

    )
        console.log("Response" , response);

      setText("");
      onClose();
    
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
        <h2 className="text-xl font-semibold mb-4">Update Message</h2>
        <textarea
          className="w-full border rounded-lg p-2 mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Write your review (max 250 characters)"
          value={text}
          onChange={handleTextChange}
        />
        
        <button
          onClick={handleSubmit}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default UpdateMessage;
