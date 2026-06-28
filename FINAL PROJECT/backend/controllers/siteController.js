const Game = require("../models/Game");

// Get site statistics
const getSiteStats = async (req, res) => {
  try {
    const totalGames = await Game.countDocuments();
    const totalReviews = await Game.aggregate([
      { $project: { reviewCount: { $size: "$reviews" } } },
      { $group: { _id: null, totalReviews: { $sum: "$reviewCount" } } }
    ]);
    
    // Calculate average rating across all games
    const avgRating = await Game.aggregate([
      { $match: { rating: { $gt: 0 } } },
      { $group: { _id: null, avgRating: { $avg: "$rating" } } }
    ]);

    const stats = {
      totalGames: totalGames,
      totalReviews: totalReviews.length > 0 ? totalReviews[0].totalReviews : 0,
      avgRating: avgRating.length > 0 ? (avgRating[0].avgRating * 10).toFixed(0) : 98, // Convert to percentage
      totalPlayers: 5000000 // This would come from user count in production
    };

    res.json(stats);
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
};

// Get why choose us features (can be made dynamic later)
const getFeatures = async (req, res) => {
  try {
    // For now, return static features - can be made dynamic with a Feature model later
    const features = [
      {
        icon: "FaGamepad",
        title: "Massive Game Library",
        description:
          "Explore thousands of PC, PlayStation, Xbox, Nintendo and mobile games in one place.",
        color: "from-red-500 to-rose-600",
      },
      {
        icon: "FaUsers",
        title: "Gaming Community",
        description:
          "Follow other gamers, share reviews, build collections and discover hidden gems together.",
        color: "from-orange-500 to-amber-600",
      },
      {
        icon: "FaShieldAlt",
        title: "Trusted Reviews",
        description:
          "Read authentic reviews and ratings from real players before downloading or buying.",
        color: "from-green-500 to-emerald-600",
      },
      {
        icon: "FaRocket",
        title: "Fast & Modern",
        description:
          "Built with React, Node.js and MongoDB for a smooth, responsive gaming experience.",
        color: "from-pink-500 to-rose-600",
      },
    ];

    res.json(features);
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
};

module.exports = {
  getSiteStats,
  getFeatures
};