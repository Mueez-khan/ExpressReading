const express = require("express");
const router = express.Router();
const { postLike , dislike , isLiked} = require("../controllers/likeController");
const { authenticateUser } = require("../middleware/AuthMiddleware");


router.post('/likePost' , postLike );
router.post('/dislike' , dislike );
router.post('/isLiked' , isLiked );




module.exports = router;

