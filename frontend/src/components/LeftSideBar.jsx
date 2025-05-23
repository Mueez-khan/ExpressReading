// import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { House , UserPen , BookMarked , ImagePlus , LogOut} from "lucide-react"
import { useSelector , useDispatch } from 'react-redux'
import { logOut } from "../redux/slices/authSlice";



export default function LeftSideBar() {


    const dispatch = useDispatch();
    const user = useSelector(state => state.auth.user)
    // console.log("User" , user);
    const navigate = useNavigate();

    const navigateToHome = () =>{
        navigate("/")
    }
    const navigateToProfile = () =>{
        navigate(`user/${user._id}`)
    }
    const navigateToSaved = () =>{
        navigate("/")
    }

    const navigateToCreatePost = () =>{
        navigate("/user/create-post")
    }

    const handleLogout = () =>{
       dispatch(logOut())
    }


  return (
    <div>
      <div className="ml-4 mt-10 ">

            <div onClick={navigateToProfile} className="cursor-pointer">
            <div className="flex">
                <div className="flex pb-6">
                    <img src={user.userImage} className="w-12 h-12 rounded-full mr-4" />
                    
                </div>

                <div>
                <p className="font-semibold ml-2">{user.firstName}</p>
                <p className=" font-light text-[12px]">@{user.firstName}</p>
                </div>

                </div>
            </div>

            <div className="bg-purple-600 w-36 p-2 rounded mt-4 ">
                <button onClick={navigateToHome} className="flex">
                <House size={20} color="#ffffff" /> <span className="ml-2 font-semibold text-white ">Home</span> 
                </button>
            </div>
            <div className="bg-purple-600 w-36 p-2 rounded mt-4">
                <button onClick={navigateToProfile} className="flex">
                <UserPen size={20} color="#ffffff" /> 
                <span className="ml-2 font-semibold text-white ">Profile</span>
                </button>
            </div>
            <div className="bg-purple-600 w-36 p-2 rounded mt-4">
                <button onClick={navigateToSaved} className="flex">
                <BookMarked size={20} color="#ffffff" /> 
                <span className="ml-2 font-semibold text-white ">Saved</span>
                </button>
            </div>
            <div className="bg-purple-600 w-36 p-2 rounded mt-4">
                <button onClick={navigateToCreatePost} className="flex">
                <ImagePlus size={20} color="#ffffff" /> 
                <span className="ml-2 font-semibold text-white ">Create Post</span>
                </button>
            </div>

            <div className="mt-10 ml-1">
                <button className="flex " onClick={handleLogout}>

                <span className="mr-2">Logout</span> <LogOut />
                
                </button>
            </div>
      </div>
    </div>
  );
}
