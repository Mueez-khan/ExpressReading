const express = require("express");
const router = express.Router();

const { sendFellowRequest  , acceptFellowRequest , isFriend , myFriends , fellowRequests} = require("../../controllers/FriendshipControllers/FriendController");
const { authenticateUser } = require("../../middleware/AuthMiddleware");


router.post('/sendRequest/:receiverId' , authenticateUser , sendFellowRequest);
router.post('/acceptRequest/:receiverId' , authenticateUser , acceptFellowRequest);
router.post('/isFriend/:receiverId' , authenticateUser , isFriend);
router.get('/myFriends' , authenticateUser , myFriends);
router.get('/fellowRequests' , authenticateUser , fellowRequests);



module.exports = router;

