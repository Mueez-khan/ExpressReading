import RightSideBar from "../components/RightSideBar";
import MainComponent from "../components/MainComponent";
import LeftSideBar from "../components/LeftSideBar";
import { useSelector } from 'react-redux';
import { useNavigate } from "react-router-dom";
import { Search, BookOpen, User, Menu } from "lucide-react";
import { logOut } from "../redux/slices/authSlice";
import { useDispatch } from "react-redux";
import image from "../../../Design/Book2.jpg";

import { useState } from "react";

export default function Home() {
  const user = useSelector(state => state.auth.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openDropDownId, setOpenDropdownId] = useState(null);

  const moveToUserProfile = () => {
    navigate(`user/${user._id}`);
  };

  // console.log("User" , user);
  // const toggleMobileMenu = () => {
  //   setIsMobileMenuOpen(!isMobileMenuOpen);
  // };

  const userLogout =  () =>{
    
    dispatch(logOut());

  }

  const handleDropDown = () => {
    setOpenDropdownId(!openDropDownId);
  };

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Mobile Header */}
      {/* <div className="lg:hidden flex items-center justify-between p-4 bg-gray-800 border-b border-gray-700">
        <div className="flex items-center space-x-2">
          <BookOpen className="w-6 h-6 text-blue-400" />
          <h1 className="text-xl font-bold text-white">BookHub</h1>
        </div>
        <button
          onClick={toggleMobileMenu}
          className="p-2 text-gray-400 hover:text-white transition-colors"
        >
          <Menu className="w-6 h-6" />
        </button>
      </div> */}

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-gray-800 border-b border-gray-700">
          <div className="p-4">
            <div className="relative mb-4">
              <input
                type="search"
                placeholder="Search books..."
                className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <Search className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
            </div>
            <button
              onClick={moveToUserProfile}
              className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors mb-4"
            >
              <User className="w-4 h-4" />
              <span>Profile</span>
            </button>
          </div>
        </div>
      )}

      <div className="flex flex-col lg:flex-row">
        {/* Left Sidebar */}
        <div className="hidden lg:flex flex-col w-80 h-screen bg-gray-800 border-r border-gray-700 sticky top-0">
          <div className="p-4">
            <div className="flex items-center space-x-2 mb-6">
              <BookOpen className="w-6 h-6 text-blue-400" />
              <h1 className="text-xl font-bold text-white">ExpressReading</h1>
            </div>

            {/* Search Bar */}
            <div className="relative mb-6">
              <input
                type="search"
                placeholder="Search books..."
                className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <Search className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
            </div>

            {/* Trending Books Section */}
            <div className="mb-6">
              <h2 className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-4">
                Trending Books
              </h2> 
              <div className="space-y-3">
                {[...Array(1)].map((_, i) => (
                  <div key={i} className="p-3 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors">
                    <div className="flex items-center space-x-3">
                    
                      <div className="w-10 h-14 bg-gray-600 rounded " >
                      <img src={image} />
                      </div>
                      
                      <div>
                        <p className="text-sm font-medium text-white ">Think Straight </p>
                        <div className="flex items-center mt-1">
                          <div className="flex text-yellow-400 text-xs">
                            {'★'.repeat(4)}{'☆'.repeat(1)}
                          </div>
                          <span className="text-xs text-gray-400 ml-1">(4.0)</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex-1">
              {/* <LeftSideBar /> */}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 min-h-screen">
          <MainComponent />
        </div>

        

        {/* Right Sidebar */}
        <div className="hidden lg:flex flex-col w-80 h-screen bg-gray-800 border-l border-gray-700 sticky top-0">
          <div className="p-4">
          
            <div className=" items-center justify-between mb-6">
              <h2 className="text-sm font-semibold text-gray-300 uppercase tracking-wider">
              My Profile
              </h2>
              
             <div className="">
              {/* <button
                onClick={moveToUserProfile}
                className="flex items-center space-x-2 px-4 mb-1 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <User className="w-4 h-4" />
                <span>Profile</span>
              </button> */}
              <div className="flex relative bg-gray-700 rounded-lg p-4 mb-6 cursor-pointer mt-2" >
            
              <div className="flex items-center space-x-3" >
              
                <img 
                  onClick={moveToUserProfile}
                  src={user?.userImage || "https://via.placeholder.com/40"}
                  alt="Profile"
                  className="w-10 h-10 rounded-full bg-gray-600"
                />
                <div onClick={moveToUserProfile}>
                  <h3 className="font-medium text-white">@{user?.firstName || "User Name"}</h3>
                  <p className="text-sm text-gray-400">{" Book Enthusiast"}</p>
                </div>

                <div>
             <p onClick={handleDropDown} className="relative mb-3 text-white ">{<Menu className="relative -right-16"/>}</p>
              {openDropDownId  && (
                        <div 
                          className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 z-50 dropdown-menu"
                        >
                          
                          
                          <button
                          onClick={userLogout}
                            // onClick={() => handleDelete(item._id)}
                            className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors duration-200"
                          >
                            {/* {deleting ? "Deleting ..." : "Delete Message"} */}
                              Logout
                          </button>
                        </div>
                      )}
             </div>
              </div>

              
            </div>
            
             </div>
            </div>

            

            <RightSideBar />
          </div>
        </div>
      </div>
    </div>
  );
}