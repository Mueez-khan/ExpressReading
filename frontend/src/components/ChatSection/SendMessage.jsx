import { useRef, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import { TbLogout2 } from "react-icons/tb";
import { BsCircleFill } from "react-icons/bs";
import { io } from "socket.io-client";
import UpdateMessage from "./UpdateMessage";

export default function SendMessage() {
  const navigate = useNavigate();
  const { id: receiverId } = useParams();
  const ownId = useSelector((state) => state.auth.user);
  const token = localStorage.getItem("token");
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState({ content: "" , file : null });
  const [messageSend, setMessageSend] = useState(false);
  const [receiverData, setReceiverData] = useState({ data: [] });
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const typingTimeoutRef = useRef(null);
  const [openDropDownId, setOpenDropdownId] = useState(null);
  const messagesEndRef = useRef(null);
  const [socket, setSocket] = useState(null);
  const [deleting  , setDeleting] = useState(false);
  const [isVisiable , setIsVisiable ] = useState(false);
  const [messageId , setMessageId ] = useState(false);
  


  const backToHome = () => {
    navigate("/messages");
  };

  // Initialize socket connection
  useEffect(() => {
    if (!ownId?._id) return;

    const newSocket = io("http://localhost:8000", {
      query: { userId: ownId._id },
      transports: ["websocket"],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    setSocket(newSocket);

    // Listen for online users
    newSocket.on("getOnlineUsers", (users) => {
      setOnlineUsers(users);
    });

    newSocket.on("MessageDeleted", ({ messageId }) => {
      setMessages((prevMessages) =>
        prevMessages.filter((msg) => msg._id !== messageId)
      );
    });


    
    

    // Listen for typing events
    newSocket.on("typing", ({ senderId }) => {
      if (senderId === receiverId) {
        setIsTyping(true);
      }
    });

    newSocket.on("stopTyping", ({ senderId }) => {
      if (senderId === receiverId) {
        setIsTyping(false);
      }
    });

    return () => {
      newSocket.off("MessageDeleted");
      newSocket.disconnect();
    };
  }, [ownId]);

  // Message listener
  useEffect(() => {
    if (!socket) return;

    const handleMessage = (messageData) => {
      if (
        (messageData.senderId === ownId._id &&
          messageData.receiverId === receiverId) ||
        (messageData.senderId === receiverId &&
          messageData.receiverId === ownId._id)
      ) {
        setMessages((prevMessages) => [...prevMessages, messageData]);
        setIsTyping(false);
      }
    };

    socket.on("newMessage", handleMessage);

    // newSocket.on("updateMessage", ({ messageData }) => {
    //   setMessages((prevMessages) =>
    //     prevMessages.filter((msg) => msg._id !== messageId)
    //   );
    // });

    const handleMessageUpdate = (messageData) => {
      setMessages((prevMessages) =>
        prevMessages.map((msg) =>
          msg._id === messageData._id ? messageData : msg
        )
      );
    };

    socket.on("messageUpdated", handleMessageUpdate);

    return () => {
      socket.off("newMessage", handleMessage);
      socket.on("messageUpdated", handleMessageUpdate);
    };
  }, [socket, ownId, receiverId]);

  // Add click outside handler
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.dropdown-trigger') && 
          !event.target.closest('.dropdown-menu')) {
        setOpenDropdownId(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Authentication check
  useEffect(() => {
    if (!token) navigate("/login");
  }, [token, navigate]);

  // Fetch user details
  const fetchUserDetail = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8000/api/v1/user/userDetails/${receiverId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setReceiverData(response.data.data || []);
    } catch (error) {
      console.error("Error fetching messages", error);
    }
  };

  // Fetch messages
  const fetchMessages = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8000/api/v1/message/userMessage/${receiverId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setMessages(response.data.data || []);
    } catch (error) {
      console.error("Error fetching messages", error);
    }
  };

  useEffect(() => {
    fetchMessages();
    fetchUserDetail();
  }, [receiverId]);

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleChange = (e) => {
    // setUserInput({ ...userInput, [e.target.name]: e.target.value });
    const { name, value, type, files } = e.target;

    if (type === "file") {
      setUserInput((prevState) => ({
        ...prevState,
        [name]: files[0] || null , // Store the selected file object
      }));
      // console.log("Selected File:", files[0]);
    } else {
      setUserInput((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }

    if (socket) {
      socket.emit("typing", { receiverId });

      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }

      typingTimeoutRef.current = setTimeout(() => {
        socket.emit("stopTyping", { receiverId });
      }, 1000);
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    // if (!userInput.content.trim()) return;
    if (!userInput.content.trim() && !userInput.file) return;

    
    try {
      setMessageSend(true);
      const formData = new FormData();

      formData.append('content', userInput.content);
      if (userInput.file) {
        formData.append('media', userInput.file);
      }

      for (let pair of formData.entries()) {
        console.log(pair[0], pair[1]);
      }
      
      const response = await axios.post(
        `http://localhost:8000/api/v1/message/sendmessage/${receiverId}`,
       formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data"
          },
        }
      );
      console.log("Response" , response);

      const messageData = {
        ...response.data.newMessage,
        senderId: ownId._id,
        receiverId,
      };

      socket?.emit("stopTyping", { receiverId });
      socket?.emit("newMessage", messageData);
      setUserInput({ content: ""  , file : ""});
    } catch (error) {
      console.error("Error sending message", error);
    } finally {
      setMessageSend(false);
    }
  };

  const handleDropDown = (messageId) => {
    setOpenDropdownId(openDropDownId === messageId ? null : messageId);
  };

  const handleDelete = async (id) =>{

    try{

      const token = localStorage.getItem("token");

      setDeleting(true)

      const response = await axios.delete(`http://localhost:8000/api/v1/message/deleteMessage/${id}`, {
        headers: {
            Authorization: `Bearer ${token}`,
          },
      })

      setDeleting(false);
      
      // setMessages((prevMessages) => [...prevMessages, messageData]);
      // setMessages((prevMessages ) =>
      
      //   prevMessages.filter((message ) => message._id != id)

      // )
      socket?.emit("MessageDeleted", id);
      console.log("response" , response);

    }catch(err){
      setDeleting(false);
      console.log("Error while deleting message" ,err)
    }
    console.log("Id" , id);

  }

  const isUserOnline = onlineUsers.includes(receiverId);

  // Show the update message 

  const showUpdateMessage = (id) =>{

    setIsVisiable(!isVisiable)
    if(id){
    setMessageId(id)
    }

  }


  return (
    <div className="flex flex-col w-full h-screen overflow-y-auto bg-gray-50">
      <div className="max-w-4xl w-full mx-auto flex-grow flex flex-col">
        {/* Header */}
        <div className="bg-white shadow-sm border-b sticky top-0">
          <div className="px-4 py-3 flex items-center">
            <button
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              onClick={backToHome}
            >
              <TbLogout2 className="w-5 h-5 text-gray-600" />
            </button>

            <div className="ml-4 flex items-center">
              <div className="w-10 h-10 rounded-full bg-gray-200 relative">
                {receiverData.userImage && (
                  <img
                    src={receiverData.userImage}
                    className="w-full h-full rounded-full object-cover"
                    alt={`${receiverData.firstName}'s avatar`}
                  />
                )}
                <div className="absolute bottom-0 right-0">
                  <BsCircleFill
                    className={`w-3 h-3 ${
                      isUserOnline ? "text-green-500" : "text-gray-400"
                    }`}
                  />
                </div>
              </div>

              <div className="ml-3">
                <div className="font-medium">
                  {receiverData?.firstName} {receiverData?.lastName}
                </div>
                <div className="text-sm text-gray-500">
                  {isTyping ? "Typing..." : isUserOnline ? "Online" : "Offline"}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-grow overflow-y-auto px-4 py-6">
          <div className="space-y-4">
            {messages?.map((item) => (
              <div
                key={item._id || item.createdAt}
                className={`flex ${
                  item.senderId === ownId._id ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[70%] px-4 py-2 rounded-lg shadow-sm
                    ${
                      item.senderId === ownId._id
                        ? "bg-blue-600 text-white"
                        : "bg-white border"
                    }`}
                >
                  <span
                    className={`text-sm ${
                      item.senderId === ownId._id
                        ? "text-white"
                        : "text-gray-900"
                    }`}
                  >
                    <div className="relative pl-1 pb-2">
                      {ownId._id === item.senderId ? (
                        <p 
                          className="relative cursor-pointer dropdown-trigger" 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDropDown(item._id);
                          }}
                        >
                          ...
                        </p>
                        
                      ) : null}
                      {openDropDownId === item._id && (
                        <div 
                          className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 z-50 dropdown-menu"
                        >
                          
                            <button
                            onClick={() => showUpdateMessage(item._id  )}
                              className="w-full px-3 py-2 text-left text-xs sm:text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                            >
                              Update Message
                             
                            </button>
                          
                          <button
                            onClick={() => handleDelete(item._id)}
                            className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors duration-200"
                          >
                            {deleting ? "Deleting ..." : "Delete Message"}
                          </button>
                        </div>
                      )}
                    </div>

                    <div className="">
                      {item.content}
                      
                      {item?.media?.length > 0 && (
                        <div className="mt-2">
                          <img
                            src={item.media}
                            className="w-40 h-auto rounded-lg cursor-pointer"
                            alt="Uploaded"
                            onClick={() => window.open(item.media)}
                          /> 
                          <a 
                            href={item.media} 
                            download 
                            className="block text-green-900 text-sm mt-1"
                          >
                            Download
                          </a>
                        </div>
                      )}
                    </div>
                  </span>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-gray-100 rounded-lg px-4 py-2">
                  <div className="text-sm text-gray-500 flex">
                    <span>
                      {
                        <img
                          className="w-4 h-4 mt-1 mr-2 rounded-full"
                          src={receiverData.userImage}
                          alt="Typing indicator"
                        />
                      }
                    </span>
                    Typing...
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
            

        {/* Input */}
        <div className="border-t bg-white p-4">
          <form onSubmit={sendMessage} className="flex items-center gap-2">
        <div ref={messagesEndRef} />
            <input
              type="text"
              name="content"
              value={userInput.content}
              onChange={handleChange}
              placeholder="Type a message..."
              className="flex-grow px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
           
            <label
              htmlFor="uploadFile"
              className="flex bg-gray-800 hover:bg-gray-700 text-white text-base px-5 py-3 outline-none rounded w-max cursor-pointer mx-auto font-[sans-serif]"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-6 mr-2 fill-white inline"
                viewBox="0 0 32 32"
              >
                <path
                  d="M23.75 11.044a7.99 7.99 0 0 0-15.5-.009A8 8 0 0 0 9 27h3a1 1 0 0 0 0-2H9a6 6 0 0 1-.035-12 1.038 1.038 0 0 0 1.1-.854 5.991 5.991 0 0 1 11.862 0A1.08 1.08 0 0 0 23 13a6 6 0 0 1 0 12h-3a1 1 0 0 0 0 2h3a8 8 0 0 0 .75-15.956z"
                  data-original="#000000"
                />
                <path
                  d="M20.293 19.707a1 1 0 0 0 1.414-1.414l-5-5a1 1 0 0 0-1.414 0l-5 5a1 1 0 0 0 1.414 1.414L15 16.414V29a1 1 0 0 0 2 0V16.414z"
                  data-original="#000000"
                />
              </svg>
              Upload
              <input
                type="file"
                name="file"
                id="uploadFile"
                onChange={handleChange}
                placeholder="Type a message..."
                className="hidden"
              />
            </label>
            {/* {userInput.file && (
                  <span className="w-24 text-sm text-gray-600 ml-2">{userInput.file.name}</span>
            )} */}
            <button
              type="submit"
              // disabled={messageSend || !userInput.content.trim()}
              className="px-6 py-2 bg-blue-600 text-white rounded-full font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {messageSend ? "Sending..." : "Send"}
            </button>
          </form>
        </div>
      </div>
      <UpdateMessage 
        isVisible={isVisiable}
        onClose={showUpdateMessage}
        messageId = {messageId}
      />       
    </div>
  );
}