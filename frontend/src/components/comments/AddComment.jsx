import  { useState } from "react"
import axios from "axios"
import { useParams } from "react-router-dom"
import { useSelector } from 'react-redux'


export default function AddComment() {

  const postID = useParams();
  const user =  useSelector(state => state.auth.user)

  // console.log("User" , user.firstName);

  const [commentData, setCommentData] = useState({
    commentText : ""
  })

  // console.log("PostId" ,postID.id);
  const handleChange =  (e) =>{

    setCommentData({...commentData , [e.target.name] : e.target.value})

  }

  const handleSubmit =  async (e) =>{

    const token = localStorage.getItem("token");
    

    e.preventDefault()
    try{

      const response = await axios.post(`http://localhost:8000/api/v1/post/comment/${postID.id}`,  {

        commentText : commentData.commentText,
        authorName : user.firstName,

      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
       );

      setCommentData({
        commentText : ""
      });
      // console.log("Response" , response);

    }
    catch(err){
      console.log("Error while Comment" , err)
    }


    console.log("Clicked" , commentData);

  }

  return (
    <div>

    <div>

    <form className="flex flex-col lg:flex-row">

      <input
        type="text"
        placeholder="Write something..."
        name="commentText"
        value={commentData.commentText}
        onChange={handleChange}
        className="w-full  mt-4 ml-2 lg:ml-2 border-2 h-10 lg:h-12 rounded-lg "
      />
      <button
      type="submit"
      onClick={handleSubmit}
       className=" w-24 h-10 lg:h-12 mt-4 ml-2 lg:w-32 rounded-lg bg-green-500 text-white ">Send</button>
    </form>

    </div>
      
    </div>
  )
}
