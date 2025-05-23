import { useState, useEffect } from "react";
import { useParams , useNavigate} from "react-router-dom";
import { Star } from "lucide-react";
import axios from "axios"
import ReviewComment from "./ReviewComments/ReviewComment";
import "react-responsive-carousel/lib/styles/carousel.min.css"; 

export default function ReviewDetail() {
  const { id } = useParams();
  const [postDetail, setPostDetail] = useState(null);
  const navigate = useNavigate();
  const getPostDetail = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `http://localhost:8000/api/v1/book/getByReviewsId/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      // console.log("Response", response);
      
      setPostDetail(response.data.data);
    } catch (err) {
      console.error("Error while getting post detail:", err);
    }
  };

  useEffect(() => {
    getPostDetail();
  }, [id]);

  const handleNavigateTOUserProfile = () =>{
    navigate(`/user/${ postDetail.author._id}`)
}
  if (!postDetail) return null;

  return (
    <div className="min-h-screen bg-gray-700 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="flex flex-col lg:flex-row">
            {/* Left Column - Book Image */}
            <div className="lg:w-1/2 relative">
              <div className="h-64 lg:h-full relative">
                <img
                 
                  src={postDetail?.bookImage}
                  alt={postDetail?.heading}
                  className="w-full h-full  transition-transform duration-300 hover:scale-105"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-6">
                  <div className="flex items-center gap-1">
                    {/* {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={20}
                        className={`${
                          i < postDetail.review
                            ? "text-yellow-400 fill-yellow-400"
                            : "text-gray-300"
                        }`}
                      />
                    ))} */}
                    {/* <span className="ml-2 text-white">
                      {postDetail.review} out of 5
                    </span> */}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Book Details */}
            <div className="lg:w-1/2 p-8 lg:p-12">
              <div className="h-full flex flex-col">
              <div className="flex mb-2">
                <img  onClick={handleNavigateTOUserProfile} className="w-8 h-8 rounded-full mr-2 cursor-pointer" src={postDetail?.author?.userImage} />
                <p  onClick={handleNavigateTOUserProfile} className="font-bold italic mr-2 cursor-pointer">{postDetail?.author?.firstName } </p>
                <p  onClick={handleNavigateTOUserProfile} className="font-bold italic cursor-pointer">{ postDetail?.author?.lastName}</p>
              </div>
              
                <h1 className="text-3xl font-bold text-gray-900 mb-4">
                  {postDetail?.heading?.toUpperCase()}
                </h1>
                
                <div className="mb-8 flex-grow">
                  <h2 className="text-xl font-semibold text-gray-700 mb-3">
                    What I Think About this Book?
                  </h2>
                  <div className="prose prose-gray max-w-none">
                    <p className="text-gray-600 leading-relaxed max-h-[300px] overflow-y-auto pr-4">
                      {postDetail?.commentAboutBook}
                    </p>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-xl p-6">
                  <h2 className="text-xl font-semibold text-gray-700 mb-3">
                   My Review
                  </h2>
                  <p className="text-gray-600 italic flex">
                    {postDetail?.ratting}  <Star fill="yellow" className="text-yellow-300 ml-2"/>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className=" ">
      {/* <Carousel> */}
      <ReviewComment/>
      {/* </Carousel> */}
      </div>
    </div>
  );
}