import { useState, useEffect } from "react";
import HeaderSection from "./HeaderSection";
import PostCard from "./post/PostCard";
import axios from "axios";
import { useNavigate } from "react-router-dom"

export default function MainComponent() {

  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const getPosts = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        `http://localhost:8000/api/v1/post/allPosts`
      );

      // console.log(response.data);
      setPosts(response.data.data);
    } catch (err) {
      setError(err.message);
      console.error("Error fetching posts:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getPosts();
  }, []);

  

  if (isLoading) {
    return <div>Loading posts...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  const handleUserClick = (post) => {
    navigate(`/page-detail/${post._id}`);
    // console.log("clicked")
  };

  return (
    <div >
      <HeaderSection />

      <div className="p-4">
      {posts.length > 0 ? (
        posts.map((post) => (
     
         <PostCard 
         key={post._id}
           props={post} 
           onClick={() => handleUserClick(post)}
           /> 
      
        ))
      ) : (
        <p>No posts available</p>
      )}
      </div>

    </div>
  );
}