const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const {
    getMessages,
    sendMessage,
    markAsRead,
    getConversations
} = require("../controllers/chatControllers");

router.get("/conversations", protect, getConversations);
router.get("/messages/:userId", protect, getMessages);
router.post("/send", protect, sendMessage);
router.put("/mark-read", protect, markAsRead);

module.exports = router;