const { Server } = require("socket.io");
const http = require("http");
const express = require("express");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173"],
    methods: ["GET", "POST"],
  },
});

const getReceiverSocketId = (receiverId) => {
  console.log("Got receiver id", receiverId);
  return userSocketMap[receiverId];
};

const userSocketMap = {}; // {userId: socketId}

io.on("connection", (socket) => {
  // console.log("a user connected", socket.id);

  const userId = socket.handshake.query.userId;
  if (userId !== "undefined" && userId !== null) {
    // Map userId to socketId
    userSocketMap[userId] = socket.id;
  }

  socket.on("newMessage", (messageData) => {
    const receiverSocketId = getReceiverSocketId(messageData.receiverId);
    // console.log("DAta", messageData);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", messageData); // Send to receiver
    }
    socket.emit("newMessage", messageData); // Send to sender
  });

    // *********************** Real-Time Message Deletion ******************


  socket.on("deleteMessage", ({messageId , receiverId}) => {
    const receiverSocketId = getReceiverSocketId(receiverId);
    // console.log("DAta", messageData);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("MessageDeleted", {messageId}); // Send to receiver
    }
    socket.emit("MessageDeleted", {messageId}); // Send to sender
  });


  socket.on("updateMessage", ({ messageData, receiverId }) => {
    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("messageUpdated", messageData); // Send to receiver
    }
    socket.emit("messageUpdated", messageData); // Send to sender
  });



  // New typing indicator events
  socket.on("typing", ({ receiverId }) => {
    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("typing", { senderId: userId });
    }
  });

  socket.on("stopTyping", ({ receiverId }) => {
    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("stopTyping", { senderId: userId });
    }
  });

  // io.emit() is used to send events to all the connected clients
  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  // socket.on() is used to listen to the events. can be used both on client and server side
  socket.on("disconnect", () => {
    // console.log("user disconnected", socket.id);
    delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

module.exports = { app, io, server, getReceiverSocketId };