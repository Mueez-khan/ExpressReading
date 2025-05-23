import UserHeader from './UserHeader'
import { useParams , useNavigate} from "react-router-dom"
import PostCard from "../post/PostCard";
import { useFetchUserPosts } from '../../hooks/useFetchUserPosts';

export default function UserProfileDetailPage() {

  const navigate = useNavigate();
  const{ id : userId }= useParams();
  const { posts , isLoading } = useFetchUserPosts(userId);
  // console.log("userId:", userId);
 
  // console.log("posts" , posts);


  const handleUserClick = (post) => {
    navigate(`/page-detail/${post._id}`);
    // console.log("clicked")
  };

  return (
    <div className='bg-gray-500 h-full'>
      <div className='w-full  mb-20 '>

      <UserHeader/>

     {/* <div className=' w-full relative mx-auto max-w-4xl bg-gray-500 mt-8 p-1 rounded-md '>
     <UserInfo/>
     </div> */}
      </div>

      <div className=''>
        {isLoading ? (
          <p>Loading...</p>
        ) : posts && posts.length > 0 ? (
          posts.map((post) => (
            <PostCard
              key={post._id}
              props={post} // Pass `post` directly instead of wrapping it in `props`
              onClick={() => handleUserClick(post)}
            />
          ))
        ) : (
          <p className='flex justify-center items-center'>No posts available</p>
        )}
      </div>
    </div>
  )
}
