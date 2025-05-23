import { useParams } from "react-router-dom";
import { useReviewComment } from "../../../hooks/useReviewComment.js";
import { Star } from "lucide-react";
import { useState } from "react";
import CreateCommentPopUp from "./CreateCommentPopUp.jsx";
import UpdateReviewComment from "./UpdateReviewComment";
import axios from "axios";
import { useSelector } from "react-redux";

export default function ReviewComment() {

  const user = useSelector(state => state.auth.user);
  const [showPopup, setShowPopup] = useState(false);
  const [selectedId, setSelectedId] = useState("");
  const [createShowPopUp, setCreateShowPopUp] = useState(false);
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const postId = useParams();
  const { data } = useReviewComment(postId.id);

  const handleOpenPopupWithId = (id) => {
    setSelectedId(id);
    setShowPopup(true);
    setOpenDropdownId(null); // Close dropdown when opening popup
  };
  
  const handleOpenPopup = () => {
    setCreateShowPopUp(true);
    setOpenDropdownId(null)
  };
  const handleClosePopup = () => {
    setCreateShowPopUp(false);
  };

  const handleClosePopupWithId = () => {
    setShowPopup(false);
    setSelectedId("");
  };

  const handleDropDown = (id) => {
    // Toggle dropdown: close if already open, open if closed
    setOpenDropdownId(openDropdownId === id ? null : id);
  };

  const handleDeleteComment = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.delete(
        `http://localhost:8000/api/v1/book/deleteCommentOnReview/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      console.log("Response", response);
      // Optionally, refresh comments or remove from local state
    } catch (err) {
      console.error("Error while deleting the post", err);
    }
  };


  return (
    <div className="mt-4">
      <h className="text-2xl font-semibold italic block text-white">Users Review</h>
      <button
        onClick={handleOpenPopup  }
        className="w-48 h-8 mt-2 p-1 text-white bg-green-500 font-semibold rounded-md"
      >
        What do you think?
      </button>
      <CreateCommentPopUp  isVisible={createShowPopUp} onClose={handleClosePopup } />
      <div className="grid gap-2 gird-col-1 md:grid-col-2 lg:grid-cols-3">
        {data?.map((comment) => (
          <div
            key={comment._id}
            className="mt-4 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg shadow-lg text-white p-3 max-w-sm flex justify-between"
          >
            <div>
              <div className="flex">
                <img
                  className="mx-2 w-8 h-8 rounded-full"
                  src={comment.author.userImage}
                  alt="User"
                />
                <p>
                  {comment.author.firstName} {comment.author.lastName}
                </p>
              </div>
              <div className="ml-10">
                <p className="font-semibold italic">{comment.comment}</p>
                <p className="flex my-2 ">
                  <p className="mr-1 font-bold italic">{comment?.ratting}</p>
                  <Star fill="yellow" className="text-yellow-400 " />
                </p>
              </div>
            </div>
            <div
              
              className="relative mr-4 text-black text-2xl -mt-4 cursor-pointer"
            >
             {comment.author._id == user._id ? <p className="relative" onClick={() => handleDropDown(comment._id) } >...</p> : ""}
              
            {openDropdownId === comment._id && (
        <div className="absolute right-0 z-40 w-32 bg-white border rounded shadow-lg">
          <button
            // onClick={handleUpdate}
            onClick={() => handleOpenPopupWithId(comment._id)}
            className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
          >
            Update Post
          </button>
          <button
            onClick={() => handleDeleteComment(comment._id)}
            className="block w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-gray-100"
          >
            Delete Post
          </button>
        </div>
      )}
            </div>
          </div>
        ))}
        <UpdateReviewComment
                isVisible={showPopup}
                onClose={handleClosePopupWithId}
                id={selectedId}
              />
      </div>
    </div>
  );
}
