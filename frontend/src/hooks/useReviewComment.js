import { useState, useEffect } from "react";
import axios from "axios";

export function useReviewComment (id) {

    const [isLoading , setIsLoading] = useState(false);     
    const [data , setData] = useState(null);
    const POLLING_INTERVAL = 5000;

    useEffect(() => {
        const getAllReviewComments = async () =>{

            try{
            
            setIsLoading(true);
            const token = localStorage.getItem("token");
            const response = await axios.get(`http://localhost:8000/api/v1/book/getAllCommentByIdOfReview/${id}` , {
    
                headers: {
                      Authorization: `Bearer ${token}`,
                      "Content-Type": "application/json", 
                },
              })
            //   console.log("Response" , response);

              setData(response.data.data);
              setIsLoading(false);
              
            }
            catch(err){
                setIsLoading(false);
                console.log("Error while fetching the Review comments" , err)
            }
    
        }
       
    
    
        getAllReviewComments();
        const interval = setInterval(getAllReviewComments , POLLING_INTERVAL);
        return () => clearInterval(interval);
      }, []);


      return { data , isLoading };

}