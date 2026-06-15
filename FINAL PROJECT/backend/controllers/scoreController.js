const Score = require("../models/score");

const submitScore = async (req, res) => {

const score = await Score.create({
    user:req.user._id,
    game:req.body.gameId,
    score:req.body.score
});
res.status(201).json(score);
};

const getLeaderboard = async (req, res) => {
    const Leaderboard = await Score.find().populate("user", "username").sort({ score: -1 }).limit(10);

    res.json(Leaderboard);
};

module.exports = { submitScore, getLeaderboard };