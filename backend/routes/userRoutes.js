const express = require("express");
const router = express.Router();
const { getUserDetailsById } = require("../controllers/userController");


router.get('/userDetails/:userId' , getUserDetailsById);



module.exports = router;

