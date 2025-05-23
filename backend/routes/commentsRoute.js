const express = require("express");
const router = express.Router();
const { userComment  , replayToComment , deleteComment , updateComment , getComments} = require("../controllers/commentsController");

const { authenticateUser } = require("../middleware/AuthMiddleware");

router.post('/comment/:postId' , authenticateUser , userComment);
router.post('/commentReply' , authenticateUser , replayToComment);
router.put('/editComment' , authenticateUser , updateComment);
router.delete('/comment/delete/:commentID' , authenticateUser , deleteComment);
router.get('/comments/:postId' ,  getComments);



module.exports = router;

