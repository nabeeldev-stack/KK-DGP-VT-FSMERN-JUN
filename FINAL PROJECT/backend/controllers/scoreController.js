const Score = require("../models/Score");
const User = require("../models/user");

const submitScore = async (req, res) => {

    try {

        const score = await Score.create({
            user: req.user._id,
            game: req.body.gameId,
            score: req.body.score
        });

        await User.findByIdAndUpdate(
            req.user._id,
            {
                $inc: {
                    totalScore: req.body.score
                }
            }
        );

        res.status(201).json(score);

    } catch (error) {

        res.status(500).json({
            message: "Server error",
            error: error.message
        });

    }
};

const getLeaderboard = async (req, res) => {

    try {

        const leaderboard = await Score.aggregate([

            {
                $group: {
                    _id: "$user",
                    bestScore: {
                        $max: "$score"
                    }
                }
            },

            {
                $lookup: {
                    from: "users",
                    localField: "_id",
                    foreignField: "_id",
                    as: "user"
                }
            },

            {
                $unwind: "$user"
            },

            {
                $project: {
                    username: "$user.username",
                    bestScore: 1
                }
            },

            {
                $sort: {
                    bestScore: -1
                }
            },

            {
                $limit: 10
            }

        ]);

        const rankedLeaderboard =
            leaderboard.map(
                (player, index) => ({
                    rank: index + 1,
                    username: player.username,
                    bestScore: player.bestScore
                })
            );

        res.json(rankedLeaderboard);

    } catch (error) {

        res.status(500).json({
            message: "Server error",
            error: error.message
        });

    }
};

module.exports = {
    submitScore,
    getLeaderboard
};