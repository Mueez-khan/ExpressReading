import { useState, useEffect } from "react";
import axios from "axios";

export function useFetchUserPosts (id) {

    const [isLoading , setIsLoading] = useState(false);     
    const [posts , setPosts] = useState(null);
    // const POLLING_INTERVAL = 3000
    useEffect(() => {
        const getUserPosts = async () => {
          if (!id) return; // Guard clause to prevent unnecessary API calls
    
          try {
            setIsLoading(true);
            const response = await axios.get(
              `http://localhost:8000/api/v1/post/getUserPost/${id}`
            );
            setPosts(response.data.data);
          } catch (err) {
            console.error("Error fetching posts:", err);
          } finally {
            setIsLoading(false);
          }
        };
    
        getUserPosts();     
        // const interval = setInterval(getUserPosts , POLLING_INTERVAL);
        // return () => clearInterval(interval);
      }, []);


      return { posts , isLoading };

}