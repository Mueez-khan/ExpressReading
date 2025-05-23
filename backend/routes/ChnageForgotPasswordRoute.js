const express = require("express");
const router = express.Router();
const { changePassword , forgotPassword , resetPassword} = require("../controllers/authController");
const { authenticateUser } = require("../middleware/AuthMiddleware");

router.post('/forgotPassword'  , forgotPassword );
router.post('/resetPassword'  , resetPassword );
router.post('/changePassword' , authenticateUser , changePassword);



module.exports = router;

