import AddComment from "../components/comments/AddComment"
import Comment from "../components/comments/comment"
import CommentBox from "../components/comments/CommentBox"
import CommentPostCard from "../components/post/CommentPostCard"

export default function PostDetails() {

  return (
   <>
    <div className="w-full flex-col lg:flex-row justify-center lg:justify-end p-4 bg-gray-800">
    
    <div className=" w-full">
    <CommentPostCard/>
     
    </div>
  <div className="w-full p-2 bg-gray-800  h-screen overflow-y-auto flex flex-col justify-end top-0 sticky">
    {/* Scrollable content */}
    <div className="flex-grow overflow-y-auto top-0 sticky">
      <CommentBox />
      <Comment />
    </div>

    {/* Fixed AddComment */}
    <div className=" mb-4 w-full bg-gray-800">
      <AddComment />
    </div>
  </div>
</div>
   </>

  )
}
