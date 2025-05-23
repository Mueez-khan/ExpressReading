const Message = require("../../models/ChatModels/MessageSchema");
const Chat = require("../../models/ChatModels/ChatSchema");
const User = require("../../models/userSchema");
const { uploadImageToCloudinary } = require("../../utils/imageUploader");
const fs = require("fs");
const { getReceiverSocketId , io } = require("../../socket/socket");
// const {} = require("../../socket/socket");


// **********************************************************************
// **********************************************************************
//                          Send Messages                               *
// **********************************************************************
// **********************************************************************

exports.sendMessageController = async (req , res) =>{

    try{
    const senderId = req.user.id;
    const receiverId = req.params.receiverId;
    const { content  } = req.body;
    const media = req.files || [];

    // console.log(`📩 Sending Message: Sender=${senderId}, Receiver=${receiverId}, Content=${content}`);


    // console.log("SenderId" , senderId)
    // console.log("receiverId" , receiverId);

    const isUserExists = await User.findById(receiverId);

    if(!isUserExists){
        return res.status(404).json({
            success : false,
            message : "The user which you want to contact is not exists"
        })
    }

    let conversion = await Chat.findOne({
        participants :{ $all : [ senderId , receiverId ]},
    })

    if(!conversion){
        conversion = await Chat.create({
            participants : [ senderId , receiverId ]
        });
    }


    let imageUrls = [];
    if (media && media.length > 0) {
      const imageUploadPromises = media.map(async (file) => {
        try {
          // console.log("Path ", file);
          // Adjust parameters as needed
          const result = await uploadImageToCloudinary(
            file,
            "ChatMedia",
            500,
            80
          );
          // Delete the local file after uploading to Cloudinary
          fs.unlinkSync(file.path);
          return result.secure_url;
        } catch (uploadError) {
          console.error("Error uploading image:", uploadError);
          throw new Error("Error uploading image to Cloudinary");
        }
      });
      imageUrls = await Promise.all(imageUploadPromises);
    }
    // console.log("Image urls" , imageUrls);

    const newMessage = await Message.create({senderId , receiverId , content , media : imageUrls  });
    // console.log("newMessage" , newMessage);
    // console.log("NewMEssage ID" , newMessage._id)
    if(newMessage){
        conversion.messages.push(newMessage._id);
        conversion.createdAt = new Date()
    }

    await conversion.save();

    const socketId = getReceiverSocketId(receiverId);

    // console.log("Socket id : " , socketId)

    return res.status(200).json({
        success : true, 
        message : "Message deliver",
        newMessage
    })
    }
    catch(err){
        console.log("Error while sending message " , err);
        return res.status(500).json({
            success : false,
            message : "Error while sending message"
        })
    }

}


// **********************************************************************
// **********************************************************************
//                          Get all chats                               *
// **********************************************************************
// **********************************************************************


exports.getUserChats = async (req, res) => {
  try {
    const userId = req.user.id; // Logged-in user

    // Find all chats where the user is a participant
    const chats = await Chat.find({ participants: userId })
      .populate("participants" , "firstName lastName readingExperience userImage") // Get user details
      .populate({
        path: "messages",
        options: { sort: { createdAt: -1 }, limit: 1 }, // Get the last message
      }).sort({createdAt: -1}).lean();

    if (!chats || chats.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No chats found",
      });
    }

    // Extract the chat list
    const chatList = chats.map((chat) => {
      // Find the other participant (the user they chatted with)
      const otherUser = chat.participants.find(
        (participant) => participant._id.toString() !== userId
      );

      return {
        chatId: chat._id,
        user: otherUser || null, // Chat partner details
        lastMessage: chat.messages.length > 0 ? chat.messages[0] : null, // Last message
      };
    });

    return res.status(200).json({
      success: true,
      message: "Chats fetched successfully",
      data: chatList,
    });
  } catch (err) {
    console.log("Error while fetching user chats", err);
    return res.status(500).json({
      success: false,
      message: "Error while fetching user chats",
    });
  }
};

// **********************************************************************
// **********************************************************************
//                          Update    Message                           *
// **********************************************************************
// **********************************************************************


exports.updateMessage = async (req , res) =>{


  try{

    const senderId = req.user.id;
    const { messageId } = req.params;
    const { content }= req.body;

    // console.log("MessageController , UserId" , senderId);
    // console.log("MessageController , messageID" , messageId);

    const isMessageAvailable = await Message.findById(messageId);
    console.log("MessageController , isMessageAvailable" , isMessageAvailable);
    const messageSenderId = isMessageAvailable.senderId.toString();
    // console.log("MessageController , isMessageAvailable_ID" , id);

    if(isMessageAvailable && messageSenderId == senderId ){
      
      const messageData = await Message.findByIdAndUpdate(
        messageId ,
        {content : content },
        {new : true}
      )

     

      const receiverSocketId = getReceiverSocketId(updatedMessage.receiverId.toString());
    
      if (receiverSocketId) {
        io.emit("messageUpdated", messageData);
      }
  
      // Also emit to sender's socket if needed
      const senderSocketId = getReceiverSocketId(senderId);
      if (senderSocketId) {
        io.emit("messageUpdated", messageData);
      }


      
      return res.status(200).json({
        success : true,
        message : "Message Updated"
      })

    }

    return res.status(403).json({
        success : false,
        message : "Your not authorized to delete the message"
    })
    // return res.status(200).json({
    //     success : true,
    //     message : "Id fetched"
    // })



  }catch(err){
    console.log("Error while deleting messaging " , err);
    return res.status(500).json({
      success : false,
      message : "Error deleting message"
    })
  }

}

// **********************************************************************
// **********************************************************************
//                          Delete    Message                           *
// **********************************************************************
// **********************************************************************


exports.deleteMessage = async (req , res) =>{


  try{

    const senderId = req.user.id;
    const { messageId } = req.params;
    // console.log("MessageController , UserId" , senderId);
    // console.log("MessageController , messageID" , messageId);
    // const socketId = getReceiverSocketId(senderId);

    const isMessageAvailable = await Message.findById(messageId);
    // console.log("MessageController , isMessageAvailable" , isMessageAvailable);
    const messageSenderId = isMessageAvailable.senderId.toString();
    // console.log("MessageController , isMessageAvailable_ID" , messageSenderId);

    if(isMessageAvailable && messageSenderId == senderId ){
      
      await Message.findByIdAndDelete(messageId)

      const receiverSocketId  = getReceiverSocketId(isMessageAvailable.receiverId);
      if(receiverSocketId){
        io.emit("MessageDeleted" , {messageId})
      }
      
      return res.status(200).json({
        success : true,
        message : "Message deleted"
      })

    }

    return res.status(403).json({
        success : false,
        message : "Your not authorized to delete the message"
    })
    // return res.status(200).json({
    //     success : true,
    //     message : "Id fetched"
    // })



  }catch(err){
    console.log("Error while deleting messaging " , err);
    return res.status(500).json({
      success : false,
      message : "Error deleting message"
    })
  }

}


// **********************************************************************
// **********************************************************************
//                          Get all messages                            *
// **********************************************************************
// **********************************************************************


exports.getUserMessages = async (req , res)  =>{

    try{

      const{ receiverId} = req.params;
      const senderId = req.user.id;
      // console.log("ReceiverId" , receiverId)
      const isMessageAvailable = await Message.find({
        $or: [
          { senderId, receiverId }, // Sent by sender
          { senderId: receiverId, receiverId: senderId } // Sent by receiver
        ]
      })
      // console.log("Message  :" , isMessageAvailable) 
      if(!isMessageAvailable){
        return res.status(404).json({
          success : false,
          message : "Messages not found"
        })
      }

      return res.status(200).json({
        success : true,
        message : "Messages fetched successfully",
        data : isMessageAvailable
      });

      


    }
    catch(err){
      console.log("Error while fetching user message" , err);
      return res.status(500).json({
        success : false,
        message : "Error while fetching user messages"
      })
    }

}