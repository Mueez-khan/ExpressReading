// Chats.js
import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import SendMessage from "./SendMessage";
import { io } from "socket.io-client";
import { useSelector } from "react-redux";
import { formatDistanceToNow } from "date-fns";
import { TbLogout2 } from "react-icons/tb";

export default function Chats() {
  const [chats, setChats] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [socket, setSocket] = useState(null);
  const navigate = useNavigate();
  const { id: selectedUserId } = useParams();
  const ownId = useSelector((state) => state.auth.user);
  const INTERVAL_TIME = 5000;

  useEffect(() => {
    if (!ownId?._id) return;

    const newSocket = io("http://localhost:8000", {
      query: { userId: ownId._id },
      transports: ["websocket"],
      reconnection: true,
    });

    setSocket(newSocket);
    newSocket.on("getOnlineUsers", (users) => {
      setOnlineUsers(users);
    });

    return () => newSocket.disconnect();
  }, [ownId]);

  const getChats = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `http://localhost:8000/api/v1/message/getChat`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setChats(response.data.data);
    } catch (err) {
      console.error("Error while fetching chats", err);
    }
  };

  useEffect(() => {
    getChats();
    const interval = setInterval(getChats, INTERVAL_TIME);
    return () => clearInterval(interval);
  }, []);

  const handleChatSelect = (id) => {
    if (window.innerWidth < 768) {
      // Mobile: Navigate to full-screen chat
      navigate(`/sendMessage/${id}`);
    } else {
      // Desktop: Update the URL while staying on the same page
      navigate(`/messages/${id}`);
    }
  };

  // For mobile view, when in SendMessage mode
  if (window.innerWidth < 768 && selectedUserId) {
    return <SendMessage onBack={() => navigate('/messages')} />;
  }

  const backToHome = () =>{
    navigate("/")
  }

  return (
    <div className="flex h-screen overflow-y-auto bg-gray-50">
      {/* Chat List - Always visible on desktop, full width on mobile when no chat selected */}
      <div className={`${selectedUserId ? 'hidden md:block' : 'w-full'} md:w-1/3 border-r border-gray-200 bg-white`}>
        <div className="h-full flex flex-col">
          <div className="p-4 border-b flex">
          <button
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              onClick={backToHome}
            >
              <TbLogout2 className="w-5 h-5 text-gray-600" />
            </button>
            <h2 className="text-xl font-semibold text-gray-800">Messages</h2>
          </div>

          <div className="flex-1 overflow-y-auto">
            {chats?.length >= 0 ? (
              <div className="divide-y divide-gray-100">
                {chats.map((chat) => {
                  const isOnline = onlineUsers.includes(chat?.user?._id);
                  return (
                    <div
                      key={chat._id}
                      onClick={() => handleChatSelect(chat.user._id)}
                      className={`hover:bg-gray-50 transition-colors duration-150 cursor-pointer ${
                        selectedUserId === chat?.user?._id ? 'bg-gray-50' : ''
                      }`}
                    >
                      <div className="p-4">
                        <div className="flex items-center space-x-4">
                          <div className="relative flex-shrink-0">
                            <img
                              className="w-12 h-12 rounded-full object-cover border border-gray-200"
                              src={chat?.user?.userImage || "/default-avatar.png"}
                              alt={`${chat?.user?.firstName}'s profile`}
                            />
                            <div
                              className={`absolute bottom-0 right-0 w-3.5 h-3.5 border-2 border-white rounded-full
                                ${isOnline ? 'bg-green-500' : 'bg-gray-400'}`}
                            />
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <h3 className="text-sm font-medium text-gray-900 truncate">
                                {chat?.user?.firstName} {chat?.user?.lastName}
                              </h3>
                              {chat?.lastMessage?.createdAt && (
                                <span className="text-xs text-gray-500">
                                  {formatDistanceToNow(new Date(chat.lastMessage.createdAt), { 
                                    addSuffix: true,
                                    includeSeconds: true
                                  })}
                                </span>
                              )}
                            </div>
                            
                            <div className="mt-1 flex items-center">
                              <span className={`text-xs ${isOnline ? 'text-green-500' : 'text-gray-500'}`}>
                                {isOnline ? 'Active now' : 'Offline'}
                              </span>
                            </div>

                            {chat?.lastMessage && (
                              <p className="mt-1 text-sm text-gray-600 truncate">
                                {chat.lastMessage.content}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center p-8">
                <div className="text-gray-400 mb-3">
                  <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <p className="text-gray-500 text-sm">
                  No messages yet. Start a conversation to see your chats here.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* SendMessage Component - Hidden on mobile unless selected */}
      <div className={`${selectedUserId ? 'w-full' : 'hidden'} md:block md:w-2/3 h-full`}>
        {selectedUserId ? (
          <SendMessage />
        ) : (
          <div className="hidden md:flex items-center justify-center h-full bg-gray-50">
            <div className="text-center text-gray-500">
              <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <p>Select a chat to start messaging</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}