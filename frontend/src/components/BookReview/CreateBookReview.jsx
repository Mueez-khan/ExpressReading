import { useState } from "react";
import axios from "axios";



export default function CreateBookReview() {
  const [userData, setUserData] = useState({
    heading: "",
    commentAboutBook: "",
    bookImage: null,
    ratting: "",
  });
  const [loading , setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    setUserData((prev) => ({
      ...prev,
      [name]: type === "file" ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isNaN(userData.ratting) || userData.ratting < 1 || userData.ratting > 5) {
      alert("Review must be a number between 1 and 5.");
      return;
    }
    if (userData.heading == "" || userData.commentAboutBook == "" || userData.bookImage == null){
      alert("All fields are required");
      return;
    }

    try{
      setLoading(true)
      const token = localStorage.getItem("token");
      await axios.post(`http://localhost:8000/api/v1/book/reviewBook`, 
        userData , {
          
            headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data", // Important for file upload
          },
          
        }
      );
      setLoading(false)
      setUserData({
        heading: "",
        commentAboutBook: "",
        bookImage: null,
        ratting: "",
      })

    }catch(err){
      setLoading(false)
      console.log("Error while posting review" , err);
    }


    console.log("Submitted Data:", userData);
    alert("Review submitted successfully!");
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 px-4">
      <div className="max-w-md w-full bg-white shadow-md rounded-lg p-6 sm:p-8">
        <h2 className="text-2xl font-bold text-center mb-4 text-gray-800">
          Create Book Review
        </h2>
        <form
          onSubmit={handleSubmit}
          className="flex flex-col space-y-4"
          noValidate
        >
          {/* Heading Input */}
          <input
            type="text"
            name="heading"
            value={userData.heading}
            onChange={handleChange}
            placeholder="Heading e.g., Amazing book"
            className="border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
            required
          />

          {/* Comment Input */}
          <textarea
            name="commentAboutBook"
            value={userData.commentAboutBook}
            onChange={handleChange}
            placeholder="What do you think about the book?"
            className="border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
            rows="4"
            required
          />

          {/* File Input */}
          <input
            type="file"
            name="bookImage"
            onChange={handleChange}
            className="border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
            accept="image/*"
            required
          />

          {/* Rating Input */}
        

          {/* Select Dropdown for Review */}
          <select
            name="ratting"
            value={userData.ratting}
            onChange={(e) => {
              const value = e.target.value;
              if (/^\d*$/.test(value)) {
                setUserData((prev) => ({ ...prev, ratting: value }));
              }
            }}
            className="border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
            required
          >
            <option value="" disabled>
              Select Review
            </option>
            {[1, 2, 3, 4, 5].map((num) => (
              <option key={num} value={num}>
                {num}
              </option>
            ))}
          </select>

          {/* Submit Button */}
          <button
            type="submit"
            className="bg-blue-500 text-white rounded-lg py-2 hover:bg-blue-600 transition-all duration-300"
          >
           { loading ? "Submitting..." : " Submit Review"}
          </button>
        </form>
      </div>
    </div>
  );
}
