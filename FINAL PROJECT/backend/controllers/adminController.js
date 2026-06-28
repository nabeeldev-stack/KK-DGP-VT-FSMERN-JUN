const User = require("../models/user");
const Game = require("../models/Game");

const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({}).select("-password");
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

const getStats = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const totalGames = await Game.countDocuments();
        
        // Calculate total reviews
        const games = await Game.find({}, 'reviews');
        const totalReviews = games.reduce((sum, game) => sum + game.reviews.length, 0);

        res.json({ totalUsers, totalGames, totalReviews });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

const deleteUser = async (req, res) => {
    try {
        const userId = await User.findById(req.params.id);

        if (!userId) {
            return res.status(404).json({ message: "User not found" });
        }

        await User.findByIdAndDelete(req.params.id);
        res.json({ message: "User deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

const banUser = async (req, res) => {
    try {
        const userId = await User.findById(req.params.id);

        if (!userId) {
            return res.status(404).json({ message: "User not found" });
        }

        userId.isBanned = true;
        await userId.save();
        res.json({ message: "User banned successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

const unbanUser = async (req, res) => {
    try {
        const userId = await User.findById(req.params.id);

        userId.isBanned = false;
        await userId.save();
        res.json({ message: "User unbanned successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

const createGame = async (req, res) => {
    try {
        const { title, description } = req.body;

        const game = await Game.create({ title, description });
        res.status(201).json(game);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

const deleteGame = async (req, res) => {
    try {
        const gameId = await Game.findById(req.params.id);

        if (!gameId) {
            return res.status(404).json({ message: "Game not found" });
        }
        await Game.findByIdAndDelete(req.params.id);
        res.json({ message: "Game deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

module.exports = { getAllUsers, getStats, deleteUser, banUser, unbanUser, createGame, deleteGame };