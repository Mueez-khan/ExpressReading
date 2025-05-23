import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  MessageCircle,
  Book,
  User2,
  UserRoundPen,
  UserPlus,
  SquarePen,
  UserCheck,
  Loader,
} from "lucide-react";
import { useSelector } from "react-redux";
import axios from "axios";

const UserHeader = () => {
  const user = useSelector((state) => state.auth.user);
  const navigate = useNavigate();
  const { id } = useParams();
  const [userData, setUserData] = useState(null);
  const [coverModalOpen, setCoverModalOpen] = useState(false);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [isYourFriend, setIsYourFriend] = useState();

  const getUserDetails = async () => {
    try {
      const response = await fetch(
        `http://localhost:8000/api/v1/user/userDetails/${id}`
      );
      const data = await response.json();
      console.log("User", data);
      setUserData(data.data);
    } catch (err) {
      console.error("Error fetching user details:", err);
    }
  };

  const isFriend = async () => {
    try {
      const token = localStorage.getItem("token");
      // console.log("token" , token);
      const response = await axios.post(
        `http://localhost:8000/api/v1/friend/isFriend/${id}`,
        {}, // This is required because Axios expects a body for a POST request
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      

      console.log("Friend", response);
      setIsYourFriend(response.data);
    } catch (err) {
      console.error("Error fetching user details:", err);
    }
  };

  const sendFriendRequest = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `http://localhost:8000/api/v1/friend/sendRequest/${id}`,
        {}, // This is required because Axios expects a body for a POST request
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Request ", response);
      setIsYourFriend((prev) =>({
        ...prev,
        data : { ...prev.data , status : "pending"}
    }))
    } catch (err) {
      console.log("Error while sending friend request", err);
    }
  };
  const acceptFriendRequest = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `http://localhost:8000/api/v1/friend/acceptRequest/${id}`,
        {}, // This is required because Axios expects a body for a POST request
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Request ", response);
      setIsYourFriend((prev) =>({
        ...prev,
        data : { ...prev.data , status : "accepted" }

    }))
    } catch (err) {
      console.log("Error while accepting friend request", err);
    }
  };

  useEffect(() => {
    getUserDetails();
    isFriend();
  }, [id]);

  const handleProfileClick = () => {
    navigate(`/user/profile`);
  };
  const handleCreatePostClick = () => {
    navigate(`/user/create-post`);
  };
  const handleRedirectToMessages = (id) => {
    navigate(`/sendMessage/${id}`);
  };

  const ImageModal = ({ isOpen, onClose, imageSrc, alt }) => {
    if (!isOpen) return null;

    return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 p-4"
        onClick={onClose}
      >
        <div
          className="relative max-w-5xl w-full h-full flex items-center justify-center"
          onClick={(e) => e.stopPropagation()}
        >
          <img
            src={imageSrc}
            alt={alt}
            className="max-w-full max-h-[90vh] object-contain rounded-lg"
          />
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-black bg-opacity-50 rounded-full text-white hover:bg-opacity-75 transition-all"
          >
            <span className="text-xl">×</span>
          </button>
        </div>
      </div>
    );
  };

  if (!userData)
    return <div className="w-full h-96 bg-gray-100 animate-pulse"></div>;

  return (
    <div className="w-full max-w-4xl mx-auto ">
      <div className="bg-gray-600 rounded-lg shadow-lg overflow-hidden b">
        {/* Cover Image */}
        <div
          className="relative h-80 bg-cover bg-center cursor-pointer transition-all hover:brightness-95"
          onClick={() => setCoverModalOpen(true)}
          style={{
            backgroundImage: `url(${userData.profile.coverImage})`,
            backgroundColor: "#f3f4f6",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        />

        {/* Profile Content */}
        <div className="relative px-8 pb-8">
          {/* Profile Image */}
          <div className="absolute -top-16 left-8">
            <div
              className="w-32 h-32 rounded-full border-4 border-white shadow-lg overflow-hidden cursor-pointer hover:brightness-95 transition-all"
              onClick={() => setProfileModalOpen(true)}
            >
              <img
                src={userData.userImage}
                alt={`${userData.firstName}'s profile`}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* User Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-20">
            {/* Left Column - Basic Info */}
            <div className="col-span-2">
              <h1 className="text-3xl font-bold text-white">
                {userData.firstName} {userData.lastName}
              </h1>
              <p className="text-white mt-2 flex items-center gap-2">
                <Book className="w-4 h-4" />
                Reading Experience: {userData.readingExperience} years
              </p>
              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2     gap-3">
                {user._id == id ? (
                  ""
                ) : (
                  <button
                    onClick={() => handleRedirectToMessages(userData._id)}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
                  >
                    <MessageCircle className="w-4 h-4" />
                    Chat
                  </button>
                )}
                {user._id !== id && (
                  <>
                    {isYourFriend?.data?.status === "accepted" ? (
                      // Fellow button (Disabled)
                      <button
                        disabled
                        className="inline-flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-full cursor-not-allowed"
                      >
                        <UserCheck className="w-4 h-4 mt-1 mr-1" /> Fellow
                      </button>
                    ) : isYourFriend?.userData?.receiverId === user._id ? (
                      // Accept Request button
                      <button
                        onClick={acceptFriendRequest} // You need to define this function
                        className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-full transition-colors"
                      >
                        <UserPlus className="w-4 h-4 mr-1" /> Accept Request
                      </button>
                    ) : isYourFriend?.status === "pending" ? (
                      // Pending button (Disabled)
                      <button
                        disabled
                        className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-500 text-white rounded-full cursor-not-allowed"
                      >
                        <Loader className="w-4 h-4 animate-spin mr-1" /> Pending
                      </button>
                    ) : (
                      // Add As Fellow button
                      <button
                        onClick={sendFriendRequest} // This function sends a friend request
                        className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full transition-colors"
                      >
                        <UserPlus className="w-4 h-4 mt-1 mr-1" /> Add As Fellow
                      </button>
                    )}
                  </>
                )}

                {user._id === id && (
                  <button
                    onClick={handleProfileClick}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
                  >
                    <UserRoundPen className="w-4 h-4" />
                    Edit profile
                  </button>
                )}
                {user._id === id && (
                  <button
                    onClick={handleCreatePostClick}
                    className="inline-flex items-center gap-2  px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
                  >
                    <SquarePen className="w-4 h-4" />
                    Create post
                  </button>
                )}
              </div>
            </div>

            {/* Right Column - Stats */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                <User2 className="w-4 h-4" />
                Profile Stats
              </h3>
              <div className="space-y-2">
                {userData.profile.bio && (
                  <p className="text-gray-600 text-sm">
                    {userData.profile.bio}
                  </p>
                )}
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div className="text-center p-2 bg-white rounded-lg shadow-sm">
                    <div className="font-bold text-blue-600">Gender</div>
                    <div className="text-xs text-gray-500">
                      {userData?.profile.gender || "?"}
                    </div>
                  </div>
                  <div className="text-center p-2 bg-white rounded-lg shadow-sm">
                    <div className="font-bold text-blue-600">Last Book</div>
                    <div className="text-xs text-gray-500">
                      {userData?.profile.lastBook || "?"}
                    </div>
                  </div>
                  <div className="text-center p-2 bg-white rounded-lg shadow-sm">
                    <div className="font-bold text-blue-600">
                      Favorite Writer
                    </div>
                    <div className="text-xs text-gray-500">
                      {userData?.profile.favoriteWriter || "?"}
                    </div>
                  </div>
                  <div className="text-center p-2 bg-white rounded-lg shadow-sm">
                    <div className="font-bold text-blue-600">
                      University / Collage
                    </div>
                    <div className="text-xs text-gray-500">
                      {userData?.studMajor}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <ImageModal
        isOpen={coverModalOpen}
        onClose={() => setCoverModalOpen(false)}
        imageSrc={userData.profile.coverImage}
        alt="Cover"
      />
      <ImageModal
        isOpen={profileModalOpen}
        onClose={() => setProfileModalOpen(false)}
        imageSrc={userData.userImage || userData.userImage}
        alt="Profile"
      />
    </div>
  );
};

export default UserHeader;
