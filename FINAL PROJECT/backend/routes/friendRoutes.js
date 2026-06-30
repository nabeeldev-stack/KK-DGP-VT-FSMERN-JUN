const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const {
    sendFriendRequest,
    acceptFriendRequest,
    rejectFriendRequest,
    removeFriend,
    getFriends,
    getPendingRequests,
    getSentRequests
} = require("../controllers/friendControllers");

// Send friend request
router.post("/send-request", protect, sendFriendRequest);

// Accept friend request
router.post("/accept-request", protect, acceptFriendRequest);

// Reject friend request
router.post("/reject-request", protect, rejectFriendRequest);

// Remove friend
router.post("/remove-friend", protect, removeFriend);

// Get friends list
router.get("/friends", protect, getFriends);

// Get pending requests
router.get("/pending-requests", protect, getPendingRequests);

// Get sent requests
router.get("/sent-requests", protect, getSentRequests);

module.exports = router;