const express = require("express");
const router = express.Router();
const { deleteAccount } = require("../controllers/deleteAccount");
const { authenticateUser } = require("../middleware/AuthMiddleware");

router.post('/deleteAccount' , authenticateUser , deleteAccount );



module.exports = router;

