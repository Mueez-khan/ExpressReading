const express = require("express");
const router = express.Router();

const { updateUserProfile } = require("../controllers/profileController");

const { authenticateUser } = require("../middleware/AuthMiddleware");

const upload = require("../middleware/multer");


router.post('/profile' , authenticateUser , upload.fields([{name : "coverImage" } , {name :"profileImage"}]) , updateUserProfile );



module.exports = router;

