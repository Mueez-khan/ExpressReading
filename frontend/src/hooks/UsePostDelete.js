import axios from "axios";

const usePostDelete = () => {
  const postDelete = async (postId) => {
    console.log("id", postId);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.delete(
        `http://localhost:8000/api/v1/post/delete/${postId}`,{
          headers : {
            "Content-Type" : "application/json",
            "Authorization" : `Bearer ${token}`
          }
        }
      );
      // console.log("Delete Response", response);
    } catch (err) {
      console.error("Error", err);
    }
  };

  return { postDelete };
};

export default usePostDelete;