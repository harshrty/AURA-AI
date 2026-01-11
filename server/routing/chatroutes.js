const express = require("express");
const router = express.Router()
const { sendmessage, getChatHistory} = require("../controllers/chatController");
const {protect } = require ("../middlewares/authmiddleware");

router.post("/send",protect,sendmessage);

router.get("/history", protect,getChatHistory)
module.exports = router;
