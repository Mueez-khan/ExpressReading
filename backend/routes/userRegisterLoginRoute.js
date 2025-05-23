const express = require("express");
const router = express.Router();
const {register  , login , sendOtp} = require("../controllers/authController");


router.post('/register' , register );
router.post('/otp' , sendOtp);
router.post('/login' , login );



module.exports = router;

