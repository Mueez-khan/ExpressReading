import React, { useState } from 'react';
import { Heart, MessageCircle, Share2, Bookmark, ChevronLeft, ChevronRight, Menu } from 'lucide-react';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import usePostDelete from '../../hooks/UsePostDelete';

const PostCard = ({ props, onClick }) => {
  const userParamsId = useParams();
  const navigate = useNavigate();
  const { postDelete } = usePostDelete();
  const user = useSelector((state) => state.auth.user);
  const description = `${props.description}`.replace(/"/g, '');
  const [isLiked, setIsLiked] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [likeCount, setLikeCount] = useState(props.likeCount);
  const [showDropdown, setShowDropdown] = useState(false);

  const handleToggleDropdown = () => setShowDropdown(!showDropdown);
  
  const handleLike = async () => {
    try {
      if (isLiked) {
        const response = await fetch('http://localhost:8000/api/v1/dislike', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ postId: props._id, userId: user._id })
        });
        if (response.ok) {
          setIsLiked(false);
          setLikeCount(prev => prev - 1);
        }
      } else {
        const response = await fetch('http://localhost:8000/api/v1/likePost', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ postId: props._id, userId: user._id })
        });
        if (response.ok) {
          setIsLiked(true);
          setLikeCount(prev => prev + 1);
        }
      }
    } catch (error) {
      console.error('Error handling like:', error);
    }
  };

  React.useEffect(() => {
    const checkLikeStatus = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/v1/isLiked', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ postId: props._id, userId: user._id })
        });
        const data = await response.json();
        setIsLiked(data.success);
      } catch (error) {
        console.error('Error checking like status:', error);
      }
    };
    checkLikeStatus();
  }, [props._id, user._id]);

  const nextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % props.postImage.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prevIndex) => prevIndex === 0 ? props.postImage.length - 1 : prevIndex - 1);
  };

  const formattedDate = new Date(props.date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <div className="max-w-[500px] mx-auto mt-4  bg-gray-700  dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden mb-6 transition-all duration-300 hover:shadow-xl">
      {/* User Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-3">
          <div 
            onClick={() => navigate(`/user/${props?.author?._id}`)}
            className="w-12 h-12 rounded-full overflow-hidden cursor-pointer transform hover:scale-105 transition-transform duration-200"
          >
            <img 
              src={props?.author.userImage} 
              alt={`${props.author.firstName}'s profile`}
              className="w-12 h-12  rounded-full"
            />
          </div>
          
          <div className="flex flex-col">
            <p 
              onClick={() => navigate(`/user/${props?.author?._id}`)}
              className="font-semibold text-white  dark:text-gray-200 cursor-pointer hover:text-blue-600 dark:hover:text-blue-400"
            >
              {props.author.firstName} {props.author.lastName}
            </p>
            <div className="flex text-white items-center space-x-2 text-xs  dark:text-gray-400">
              <span>{formattedDate}</span>
              <span>•</span>
              <span>{props.author.readingExperience}y exp</span>
            </div>
          </div>
        </div>

        {user._id === userParamsId.id && (
          <div className="relative">
            <button
              onClick={handleToggleDropdown}
              className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
            >
              <Menu size={20} />
            </button>

            {showDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 z-50">
                <button
                  onClick={() => navigate(`/user/update-post/${props._id}`)}
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                >
                  Update Post
                </button>
                <button
                  onClick={() => postDelete(props._id)}
                  className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors duration-200"
                >
                  Delete Post
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Post Description */}
      {description && (
        <div onClick={onClick} className="px-4 py-3 cursor-pointer text-white dark:text-gray-300">
          {description.length > 100 ? `${description.slice(0, 100)}...` : description}
        </div>
      )}

      {/* Image Carousel */}
      {props.postImage.length > 0 && (
        <div className="relative group">
          <img 
            src={props.postImage[currentImageIndex]} 
            alt={`Post image ${currentImageIndex + 1}`} 
            className="w-full h-68 object-cover cursor-pointer"
            onClick={onClick}
          />
          
          {props.postImage.length > 1 && (
            <>
              <button 
                onClick={prevImage}
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"
              >
                <ChevronLeft size={20} />
              </button>
              <button 
                onClick={nextImage}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"
              >
                <ChevronRight size={20} />
              </button>
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                {currentImageIndex + 1} / {props.postImage.length}
              </div>
            </>
          )}
        </div>
      )}

      {/* Actions */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <button 
                onClick={handleLike}
                className="transform hover:scale-110 transition-transform duration-200"
              >
                <Heart 
                  className={`w-6 h-6 ${isLiked ? 'text-red-500 fill-red-500' : 'text-white '}`}
                />
              </button>
              <span className="text-sm text-white dark:text-gray-400">{likeCount}</span>
            </div>
            
            <div className="flex items-center space-x-2">
              <button 
                onClick={onClick}
                className="transform hover:scale-110 transition-transform duration-200"
              >
                <MessageCircle className="w-6 h-6 text-white" />
              </button>
              <span className="text-sm text-white dark:text-gray-400">{props.comments}</span>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {/* <button className="transform hover:scale-110 transition-transform duration-200">
              <Share2 className="w-6 h-6 text-gray-600 dark:text-gray-400" />
            </button>
            <button className="transform hover:scale-110 transition-transform duration-200">
              <Bookmark className="w-6 h-6 text-gray-600 dark:text-gray-400" />
            </button> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostCard;