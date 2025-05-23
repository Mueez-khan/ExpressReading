const express = require("express");
const router = express.Router();
const { createPost  , updatePost , deletePost , getAllPosts , getPostById , getPostByUserId} = require("../controllers/postController");
const { authenticateUser } = require("../middleware/AuthMiddleware");
const upload = require("../middleware/multer");


router.post('/createPost' , authenticateUser  , upload.array("postImage", 10) , createPost );
router.delete('/delete/:postId' , authenticateUser , deletePost );
router.put('/editPost/:postId' , authenticateUser , upload.array("postImage", 10)  , updatePost );
router.get('/allPosts' , getAllPosts );
router.get('/getPost/:postId' , getPostById );
router.get('/getUserPost/:userId' , getPostByUserId );



module.exports = router;

