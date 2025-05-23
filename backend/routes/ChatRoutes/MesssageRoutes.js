const express = require("express");
const router = express.Router();
const upload = require("../../middleware/multer");

const { authenticateUser } = require("../../middleware/AuthMiddleware");
const { sendMessageController , getUserChats , getUserMessages , deleteMessage , updateMessage} = require("../../controllers/ChatControllers/MessageController");

router.post('/sendMessage/:receiverId'  , authenticateUser , upload.array("media", 10) , sendMessageController);
router.get('/getChat' , authenticateUser , getUserChats);
router.get('/userMessage/:receiverId' , authenticateUser , getUserMessages);
router.delete('/deleteMessage/:messageId' , authenticateUser , deleteMessage);
router.put('/updateMessage/:messageId' , authenticateUser , updateMessage);


module.exports = router;

