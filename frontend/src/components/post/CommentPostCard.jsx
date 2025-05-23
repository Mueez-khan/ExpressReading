import  { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useParams } from 'react-router-dom';
import { useNavigate } from "react-router-dom"
// import { Skeleton } from '@/components/ui/skeleton';

const CommentPostCard = () => {


  const navigate = useNavigate();
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setIsLoading(true);
        setError(null);
        // Note: Replace with your actual API call mechanism
        const response = await fetch(`http://localhost:8000/api/v1/post/getPost/${id}`);
        const data = await response.json();
        setPost(data.data);
      } catch (err) {
        setError('Failed to load post');
        console.error('Error fetching post:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  const nextImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === (post?.postImage?.length || 1) - 1 ? 0 : prevIndex + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? (post?.postImage?.length || 1) - 1 : prevIndex - 1
    );
  };

  const moveToUserProfile = (id) =>{
    navigate(`/user/${id}`)
  }

  // if (isLoading) {
  //   return (
  //     <div className="w-full max-w-2xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden animate-pulse">
  //       <div className="p-4 space-y-4">
  //         <div className="flex items-center space-x-4">
  //           <Skeleton className="w-12 h-12 rounded-full" />
  //           <Skeleton className="h-4 w-[200px]" />
  //         </div>
  //         <Skeleton className="h-4 w-full" />
  //         <Skeleton className="h-[300px] w-full" />
  //       </div>
  //     </div>
  //   );
  // }

  if (error) {
    return (
      <div className="w-full max-w-2xl mx-auto p-4 bg-red-50 rounded-xl shadow-lg">
        <p className="text-red-600 text-center">{error}</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl">
      {/* User Header */}
      <div className="p-4 bg-gradient-to-r from-gray-300 to-gray-50">
        <div className="flex items-center space-x-3">
          {post?.author?.userImage ? (
            <img
              onClick={() => moveToUserProfile(post?.author?._id)}
              src={post.author.userImage}
              alt={`${post?.author?.firstName}'s profile`}
              className="w-10 h-10 cursor-pointer rounded-full object-cover border-2 border-gray-200 shadow-sm"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
              <span onClick={() => moveToUserProfile(post?.author?._id)} className="cursor-pointer text-gray-500 text-xl">
                {post?.author?.firstName?.[0]}
              </span>
            </div>
          )}
          <div>
            <h3 onClick={() => moveToUserProfile(post?.author?._id)} className="font-semibold cursor-pointer text-gray-800">
              {post?.author?.firstName} {post?.author?.lastName}
            </h3>
            <p className="text-xs text-gray-500">Posted by @{post?.author?.firstName?.toLowerCase()}</p>
          </div>
        </div>
      </div>

      {/* Post Description */}
      <div className="px-4 py-3">
        <p className="text-gray-700 text-sm">
          {post?.description?.replace(/^"|"$/g, '')}
        </p>
      </div>

      {/* Image Carousel */}
      {post?.postImage?.length > 0 && (
        <div className="relative aspect-video">
          <img
            src={post.postImage[currentImageIndex]}
            alt={`Post content ${currentImageIndex + 1}`}
            className="w-full h-full object-cover"
          />

          {post.postImage.length > 1 && (
            <>
              {/* Navigation Buttons */}
              <div className="absolute inset-0 flex items-center justify-between p-2">
                <button
                  onClick={prevImage}
                  className="p-2 rounded-full bg-black/30 text-white hover:bg-black/50 transition-colors focus:outline-none"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={nextImage}
                  className="p-2 rounded-full bg-black/30 text-white hover:bg-black/50 transition-colors focus:outline-none"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </div>

              {/* Image Counter */}
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-black/50 text-white text-sm">
                {currentImageIndex + 1} / {post.postImage.length}
              </div>
            </>
          )}
        </div>
      )}

      {/* Engagement Section */}
     
    </div>
  );
};

export default CommentPostCard;