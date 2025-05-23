import { Star } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";

const BookReviewCard = ({ props , onClick }) => {

  const navigate = useNavigate();
  const userId = useSelector(state => state.auth.user);
  // console.log("Userid" , userId._id)
  const [showDropdown, setShowDropdown] = useState(false);
  const [isDelete , setIsDelete] = useState(false);
  const handleNavigateTOUserProfile = () =>{
    navigate(`/user/${props.author._id}`)}

    const handleDeleteReview = async () =>{

      try{
        setIsDelete(true)
        const token = localStorage.getItem("token");
        console.log("id" , props._id)
          const response = await axios.delete(`http://localhost:8000/api/v1/book/deleteReviewBook/${props._id}`,{
          headers : {
                    Authorization : `Bearer ${token}`,
                    "Content-Type" : "application/json"
                    // Authorization: `Bearer ${token}`,
                    // "Content-Type": "application/json", 
                }
         })

         setIsDelete(false);
         console.log("Res" , response);
        }
        catch(err){
          setIsDelete(false);
          console.log("error " , err)
          alert(`Error : ${err.response.data.message}`)
      }

    }

const handleToggleDropdown = () => {
  setShowDropdown(!showDropdown); // Toggle the dropdown visibility
};

  const handleUpdate = async (id) =>{
    navigate(`/book/book-review/update/${id}`)
  }

return (
    <div data-testid="reviewCard" className="flex justify-center items-center p-4 overflow-hidden z-4">
     
      <div className="w-full flex max-w-sm bg-gray-100 shadow-lg rounded-lg p-4 md:max-w-md lg:max-w-lg">
        {/* Header */}
       
        <div>
        <div className="flex items-center mb-4">
          <img
            onClick={handleNavigateTOUserProfile}
            className="w-10 h-10 rounded-full mr-3 cursor-pointer"
            src={props?.author?.userImage}
            alt="User"
            
          />
          
          <div>
            <p onClick={handleNavigateTOUserProfile} className="text-lg font-bold cursor-pointer">
            {props?.author?.firstName} {props?.author?.lastName}</p>
            {/* <p className="text-sm text-gray-500">{props.date}</p> */}
          </div>
        </div>
       
      
        <div className="cursor-pointer" onClick={onClick}>
            {/* Review Heading */}
        <h1 className="text-xl font-semibold mb-2 text-gray-800">
          {props?.heading?.toUpperCase()}
        </h1>

        {/* Review Text */}
        <p className="text-gray-700 mb-4">{props?.commentAboutBook?.length > 100 ? `${props?.commentAboutBook?.slice(0 , 100)} ...`  :  props.commentAboutBook }</p>

        {/* Book Image */}
        <div className="mb-4">
          <img
            className="w-full  rounded-lg object-cover h-60"
            src={props?.bookImage}
            alt="Book"
          />
        </div>

        {/* Rating */}
        <div className="flex items-center justify-between">
          <p className="text-sm">
            My Review:
            <span
              className={`font-semibold ml-1 ${props.ratting < 3 ? "text-red-500" : "text-green-500"}`}
            >
              {props.ratting}
            </span>
            / 5
          </p>
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                        key={i}
                        size={20}
                        className={`${
                          i < props?.ratting
                            ? "text-yellow-400 fill-yellow-400"
                            : "text-gray-300"
                        }`}
                      />
            ))}
          </div>
        </div>
        </div>
        </div>
        <div className="cursor-pointer relative">
         {props?.author?._id ==  userId._id ? <p onClick={handleToggleDropdown}>...</p> : ""}
          
      {   showDropdown && (
        <div className="absolute right-0 z-50 w-32 bg-white border rounded shadow-lg">
          <button
            onClick={() => handleUpdate(props._id)}
            className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
          >
            Update Post
          </button>
          <button
            onClick={handleDeleteReview}
            className="block w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-gray-100"
          >
            {isDelete ? "Deleting... " : "Delete"}
          </button>
        </div>
      )  }
        </div>
      </div>
    </div>
  );
};

export default BookReviewCard;
