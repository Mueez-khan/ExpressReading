const User = require("../../models/userSchema");
const Friend = require("../../models/FriendsSchema");


exports.sendFellowRequest = async (req , res) =>{


    try{

        const senderId = req.user.id;
        const {receiverId} = req.params;

        const userData = await User.findById(senderId);

        // console.log("UserData , friendController" , userData);

        if(!receiverId){
            return res.status(403).json({
                success : false,
                message : "Server did't get receiver id try again."
            })
        }



         const requestSend = await Friend.create({
            senderId,
            receiverId
         })

        //  console.log("REquestSend , friendController" , requestSend);

        
         return res.status(200).json({
            success : true,
            message : "Request Send successfully"
         })







    }
    catch(err){
        console.log("Error while sending fellow request" , err);
        return res.status(500).json({

            success : false,
            message : "Error while sending fellow request"

        })
    }


}



exports.acceptFellowRequest = async (req , res) =>{


    try{

        const senderId = req.user.id;
        const {receiverId} = req.params;

        const Sender = await User.findById(senderId);
        const Receiver = await User.findById(receiverId);

        // console.log("Sender" , Sender);
        // console.log("Receiver" , Receiver);

        const userData = await Friend.findOne({
            $or :[
                { senderId : senderId , receiverId : receiverId },
                {senderId : receiverId  , receiverId : senderId}
            ]
        });

        // console.log("UserData , friendController" , userData);

        if(!userData){
            return res.status(404).json({
                success : false,
                message : "Request not found"
            })
        }

        if(!receiverId){
            return res.status(403).json({
                success : false,
                message : "Server did't get receiver id try again."
            })
        }


        userData.status = "accepted"
        const response =  await userData.save();

        


        Sender.friends.push(Receiver._id)
        await Sender.save();

        Receiver.friends.push(Sender._id)
        await Receiver.save()


        
         return res.status(200).json({
            success : true,
            message : "Request Send successfully"
         })







    }
    catch(err){
        console.log("Error while accepting fellow request" , err);
        return res.status(500).json({

            success : false,
            message : "Error while accepting fellow request"

        })
    }


}

exports.rejectFellowRequest = async (req , res) =>{


    try{

        const senderId = req.user.id;
        const {receiverId} = req.params;

        const Sender = await User.findById(senderId);
        const Receiver = await User.findById(receiverId);

        // console.log("Sender" , Sender);
        // console.log("Receiver" , Receiver);

        const userData = await Friend.findOne({
            $or :[
                { senderId : senderId , receiverId : receiverId },
                {senderId : receiverId  , receiverId : senderId}
            ]
        });

        // console.log("UserData , friendController" , userData);

        if(!userData){
            return res.status(404).json({
                success : false,
                message : "Request not found"
            })
        }

        if(!receiverId){
            return res.status(403).json({
                success : false,
                message : "Server did't get receiver id try again."
            })
        }


        if(userData){

        }


        
         return res.status(200).json({
            success : true,
            message : "Request Send successfully"
         })







    }
    catch(err){
        console.log("Error while accepting fellow request" , err);
        return res.status(500).json({

            success : false,
            message : "Error while accepting fellow request"

        })
    }


}




exports.isFriend = async (req , res) =>{


    try{

        const senderId = req.user.id;
        const {receiverId} = req.params;

        console.log("Sender" , senderId)
        console.log("Receiver" , receiverId)

        const userData = await Friend.findOne({
            $or :[
                { senderId : senderId , receiverId : receiverId },
                {senderId : receiverId  , receiverId : senderId}
            ]
        });
        console.log("UserData" , userData?.status);


        if(userData?.status === "pending"){
            return res.status(200).json({
                success : true,
                message : "The request is in pending state",
                status : "pending",
                userData
            })
        }

        

        // if(userData)

        if(!userData){
            return res.status(200).json({
                success : false,
                message : "Not friend",
                status : "NotFriend"
             })
        }
        
         return res.status(200).json({
            success : true,
            message : "Request Send successfully",
            data : userData
         })







    }
    catch(err){
        console.log("Error while checking  fellow request" , err);
        return res.status(500).json({

            success : false,
            message : "Error while checking fellow request"

        })
    }


}



exports.myFriends = async (req , res ) =>{


    try{


        const senderId = req.user.id;
        // const {receiverId} = req.params;
        console.log(senderId)
        const myFriendList = await User.findOne({ _id: senderId })
        .select("-password")
      .populate({
        path: "friends",
        select: "-password",
      })
      .lean();

      
        console.log("Friends" , myFriendList);

        return res.status(200).json({
            success : true,
            message : "Friends fetched",
            data :  myFriendList
        })


    }
    catch(err){
        console.log("Error while checking  fellow request" , err);
        return res.status(500).json({

            success : false,
            message : "Error while checking fellow request"

        })
    }


}



exports.fellowRequests = async (req , res ) => {


    
    try{


        const senderId = req.user.id;
        // const {receiverId} = req.params;

        const myFellowRequests  =  await Friend.find({
            receiverId : senderId,
            status: "pending"
        }).populate("senderId" , "-password").lean();

        // const myFriendList = await User.findById(senderId).select("-password").populate({
        //     path : "friends",
        //     select : "-password"
        // }).lean();

        console.log("Fellow requests" , myFellowRequests);

        if(myFellowRequests){
            return res.status(200).json({
                success : true,
                message : "Fellow requests fetched",
                data : myFellowRequests
            })
        }else{

            return res.status(200).json({
                success : true,
                message : "No_Request",
            })
        }



    }
    catch(err){
        console.log("Error while Fetching fellow requests  request" , err);
        return res.status(500).json({

            success : false,
            message : "Error while Fetching fellow requests  request"

        })
    }


}