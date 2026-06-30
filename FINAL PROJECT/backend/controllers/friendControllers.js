const Friend = require("../models/friend");
const User = require("../models/user");

// Send friend request
const sendFriendRequest = async (req, res) => {
    try {
        const { recipientId } = req.body;
        const requesterId = req.user._id;

        if (requesterId.toString() === recipientId) {
            return res.status(400).json({ message: "You cannot send friend request to yourself" });
        }

        // Check if recipient exists
        const recipient = await User.findById(recipientId);
        if (!recipient) {
            return res.status(404).json({ message: "User not found" });
        }

        // Check if friendship already exists
        const existingFriend = await Friend.findOne({
            $or: [
                { requester: requesterId, recipient: recipientId },
                { requester: recipientId, recipient: requesterId }
            ]
        });

        if (existingFriend) {
            return res.status(400).json({ message: "Friend request already exists" });
        }

        const friendRequest = await Friend.create({
            requester: requesterId,
            recipient: recipientId,
            status: "pending"
        });

        res.status(201).json({
            message: "Friend request sent successfully",
            friendRequest
        });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Accept friend request
const acceptFriendRequest = async (req, res) => {
    try {
        const { requestId } = req.body;
        const userId = req.user._id;

        const friendRequest = await Friend.findById(requestId);
        
        if (!friendRequest) {
            return res.status(404).json({ message: "Friend request not found" });
        }

        if (friendRequest.recipient.toString() !== userId.toString()) {
            return res.status(403).json({ message: "Not authorized to accept this request" });
        }

        friendRequest.status = "accepted";
        await friendRequest.save();

        res.json({
            message: "Friend request accepted",
            friendRequest
        });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Reject friend request
const rejectFriendRequest = async (req, res) => {
    try {
        const { requestId } = req.body;
        const userId = req.user._id;

        const friendRequest = await Friend.findById(requestId);
        
        if (!friendRequest) {
            return res.status(404).json({ message: "Friend request not found" });
        }

        if (friendRequest.recipient.toString() !== userId.toString()) {
            return res.status(403).json({ message: "Not authorized to reject this request" });
        }

        friendRequest.status = "rejected";
        await friendRequest.save();

        res.json({
            message: "Friend request rejected",
            friendRequest
        });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Remove friend
const removeFriend = async (req, res) => {
    try {
        const { friendId } = req.body;
        const userId = req.user._id;

        const friendship = await Friend.findOne({
            _id: friendId,
            status: "accepted",
            $or: [
                { requester: userId },
                { recipient: userId }
            ]
        });

        if (!friendship) {
            return res.status(404).json({ message: "Friendship not found" });
        }

        await Friend.findByIdAndDelete(friendId);

        res.json({ message: "Friend removed successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Get friends list
const getFriends = async (req, res) => {
    try {
        const userId = req.user._id;

        const friendships = await Friend.find({
            status: "accepted",
            $or: [
                { requester: userId },
                { recipient: userId }
            ]
        }).populate("requester", "username avatar").populate("recipient", "username avatar");

        const friends = friendships.map(friendship => {
            const friend = friendship.requester._id.toString() === userId.toString() 
                ? friendship.recipient 
                : friendship.requester;
            return {
                id: friend._id,
                username: friend.username,
                avatar: friend.avatar,
                friendshipId: friendship._id
            };
        });

        res.json(friends);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Get pending friend requests
const getPendingRequests = async (req, res) => {
    try {
        const userId = req.user._id;

        const requests = await Friend.find({
            recipient: userId,
            status: "pending"
        }).populate("requester", "username avatar");

        res.json(requests);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Get sent friend requests
const getSentRequests = async (req, res) => {
    try {
        const userId = req.user._id;

        const requests = await Friend.find({
            requester: userId,
            status: "pending"
        }).populate("recipient", "username avatar");

        res.json(requests);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

module.exports = {
    sendFriendRequest,
    acceptFriendRequest,
    rejectFriendRequest,
    removeFriend,
    getFriends,
    getPendingRequests,
    getSentRequests
};