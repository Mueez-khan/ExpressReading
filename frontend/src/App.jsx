import {Routes , Route} from "react-router-dom"
import Register from "./pages/Register"
import Login from "./pages/Login"
import ForgotPassword from "./components/ForgotPassword"
import ChangePassword from "./components/ChangePassword"
import Home from "./pages/Home"
import PostDetails from "./pages/PostDetails"
import UserDetailPage from "./components/user/UserProfileDetailPage"
import UserProfile from "./components/user/UserEditProfile"
import CreatePost from "./components/post/CreatePost"
import UpdatePost from "./components/post/UpdatePost"
import ProtectedRoutes from "./components/ProtectedRoutes"
import BookReview from "./components/BookReview/BookReview"
import ReviewDetail from "./components/BookReview/ReviewDetail"
import CreateBookReview from "./components/BookReview/CreateBookReview"
import UpdateBookReview from "./components/BookReview/UpdateBookReview,"
import SendMessage from "./components/ChatSection/SendMessage"
import ChatUi from "./pages/ChatUi"
import Chats from "./components/ChatSection/Chats"
import Page404 from "./pages/Page404"
import FellowsPage from "../src/pages/FellowSection/FellowsPage"
import FellowRequests from "../src/pages/FellowSection/FellowRequests"

function App() {

  return (
    <>
      
      <Routes>
        
        <Route element={<ProtectedRoutes/>}>
        <Route path="/"  element={<Home/>} />
        <Route path="/user/create-post"  element={<CreatePost/>} />
        <Route path="/page-detail/:id"  element={<PostDetails/>} />
        <Route path="/user/:id"  element={<UserDetailPage/>} />
        <Route path="/user/profile"  element={<UserProfile/>} />
        <Route path="/user/update-post/:id"  element={<UpdatePost/>} />
        <Route path="/book/books-reviews"  element={<BookReview/>} />
        <Route path="/book/books-reviews/detail/:id"  element={<ReviewDetail/>} />
        <Route path="/book/create-review"  element={<CreateBookReview/>} />
        <Route path="/book/create-review"  element={<CreateBookReview/>} />
        <Route path="/book/book-review/update/:id"  element={<UpdateBookReview/>} />
        <Route path="/sendMessage/:id"  element={<SendMessage/>} />
        <Route path="/messages/:id" element={<Chats />} />
        <Route path="/messages"  element={<ChatUi/>} />
        <Route path="/fellows"  element={<FellowsPage/>} />
        <Route path="/fellowRequests"  element={<FellowRequests/>} />
        
        </Route>
        <Route path="/register"  element={<Register/>} />
        <Route path="/login"  element={<Login/>} />
        <Route path="/forgotPassword"  element={<ForgotPassword/>} />
        <Route path="/reset-password/:token"  element={<ChangePassword/>} />
        <Route path="*"  element={<Page404/>} />



      </Routes>

    </>
  )
}

export default App
