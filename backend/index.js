const express = require('express');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
const dbConnection = require('./config/database');
const { cloudinaryConnection  } = require('./config/cloudinary'); // Import Cloudinary connection
// const app = express();
const cors = require('cors');
// const { initSocket } = require("./socket/socket");
// const http = require("http");
const { app , server } = require("./socket/socket");

const authRoutes = require("./routes/userRegisterLoginRoute");
const passwordRoutes = require("./routes/ChnageForgotPasswordRoute");
const deleteAccount = require("./routes/deleteAccount");
const postRoute = require("./routes/postRoutes");
const comment = require("./routes/commentsRoute");
const profileRoute = require("./routes/profileRoutes");
const likePost = require("./routes/likeRoutes");
const userRoutes = require("./routes/userRoutes");
const reviews = require("./routes/BookReview/bookReviewRoutes");
const messages = require("./routes/ChatRoutes/MesssageRoutes");
const friends = require("./routes/FriendRoutes/FriendShipRoutes");


app.use(
    cors({
      origin: ["http://localhost:5173"  ],
      methods: "GET, POST, PATCH, DELETE, PUT",
      allowedHeaders: ['Content-Type', 'Authorization'], 
      credentials: true,
    })
  );



cloudinaryConnection();

dotenv.config(); // Load environment variables

// Middleware
app.use(cookieParser()); // Parse cookies
app.use(express.json()); // Parse JSON requests
app.use(express.urlencoded({ extended: true }));

// Database connection
dbConnection();



// Routes
app.use("/api/v1", authRoutes); // Authentication-related routes
app.use("/api/v1", passwordRoutes); // User-related routes
app.use("/api/v1", deleteAccount); // Account-deleting-related routes
app.use("/api/v1/post", postRoute); // Post-related routes
app.use("/api/v1/post", comment); // comments-related routes
app.use("/api/v1/user", profileRoute ); // profile-related routes
app.use("/api/v1", likePost); // likeAndDislike-related routes
app.use("/api/v1/user", userRoutes); // profile-related routes
app.use("/api/v1/book", reviews); // BookReview-related routes
app.use("/api/v1/message", messages); // Messages-related routes
app.use("/api/v1/friend", friends); // Friends-related routes

// Home route
app.get("/", (req, res) => {
    res.send("The app is running fine");
});



// Start server
const port = process.env.PORT || 3000;
server.listen(port, () => {
    console.log(`The app is running on port ${port}`);
});
