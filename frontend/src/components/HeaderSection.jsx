import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  Menu,
  X,
  Home,
  User,
  Bookmark,
  PlusCircle,
  BookOpen,
  MessageSquareMore,
  LogOut
} from "lucide-react";
import { useState } from "react";

export default function HeaderSection() {
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);
  const [menuOpen, setMenuOpen] = useState(false);

  const navigateTo = (path) => {
    navigate(path);
    setMenuOpen(false);
  };

  const userLogout = () => {};

  return (
    <header className="bg-gray-900 text-white shadow-md w-full">
      <div className="container mx-auto flex justify-between items-center p-4">
        {/* Logo or Title */}
        <div
          className="text-2xl font-bold cursor-pointer"
          onClick={() => navigateTo("/")}
        >
        <h1>  Express Reading </h1>
        </div>

        {/* Navigation Links */}
        <nav className="hidden md:flex space-x-6 text-lg">
          <button
            onClick={() => navigateTo("/")}
            className="hover:text-gray-400 transition-colors duration-300"
          >
            <Home size={24} />
          </button>
          <button
            aria-label="Profile"
            onClick={() => navigateTo(`/fellows`)}
            className="hover:text-gray-400 transition-colors duration-300"
          >
            <User size={24} />
          </button>
          <button
            onClick={() => navigateTo("/user/create-post")}
            className="hover:text-gray-400 transition-colors duration-300"
          >
            <PlusCircle size={24} />
          </button>
          <button
            onClick={() => navigateTo("/book/books-reviews")}
            className="hover:text-gray-400 transition-colors duration-300"
          >
            <BookOpen size={24} />
          </button>
          <button
            onClick={() => navigateTo("/messages")}
            className="flex items-center space-x-2 w-full text-left hover:text-gray-400 transition-colors duration-300"
          >
            <MessageSquareMore size={20} />
          </button>
          {/* <button
            onClick={() => navigateTo("/saved")}
            className="hover:text-gray-400 transition-colors duration-300"
          >
            <Bookmark size={24} />
          </button> */}
          
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-white"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-gray-900 p-4 space-y-4  text-lg shadow-lg ">
          <button
        
            onClick={() => navigateTo("/")}
            className="flex items-center space-x-2 w-full text-left hover:text-gray-400 transition-colors duration-300"
          >
            <span>Home</span> <Home size={20} />
          </button>
          <button 
            
            onClick={() => navigateTo(`user/${user._id}`)}
            className="flex items-center space-x-2 w-full text-left hover:text-gray-400 transition-colors duration-300"
          >
            <span>Profile</span> <User size={20} />
          </button>
          <button
            onClick={() => navigateTo("/fellows")}
            className="flex items-center space-x-2 w-full text-left hover:text-gray-400 transition-colors duration-300"
          >
            <span>Create post</span> <PlusCircle size={20} />
          </button>
          <button
            onClick={() => navigateTo("/book/books-reviews")}
            className="flex items-center space-x-2 w-full text-left hover:text-gray-400 transition-colors duration-300"
          >
            <span>Book Reviews</span> <BookOpen size={20} />
          </button>
          <button
            onClick={() => navigateTo("/messages")}
            className="flex items-center space-x-2 w-full text-left hover:text-gray-400 transition-colors duration-300"
          >
            <span>Chats</span> <MessageSquareMore size={20} />
          </button>
          <button
            onClick={() => navigateTo("/saved")}
            className="flex items-center space-x-2 w-full text-left hover:text-gray-400 transition-colors duration-300"
          >
            <span>Saved posts</span> <Bookmark size={20} />
          </button>
          <button
            onClick={userLogout}
            // onClick={() => handleDelete(item._id)}
            className="flex items-center space-x-2 w-full text-red-400 text-left hover:text-red-600 transition-colors duration-300"
          >
            {/* {deleting ? "Deleting ..." : "Delete Message"} */}
           <span>  Logout </span> <LogOut size={20} />
          </button>
        </div>
      )}
    </header>
  );
}
