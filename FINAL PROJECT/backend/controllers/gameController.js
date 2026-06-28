const Game = require("../models/Game");

const createGame = async (req, res) => {
    try {
        const {
    title,
    name,
    description,
    genre,
    imageUrl
} = req.body;
        const gameTitle = title || name;

        if (!gameTitle || !gameTitle.trim()) {
            return res.status(400).json({ message: "Game title is required" });
        }

        const game = await Game.create({
    title: gameTitle.trim(),
    description,
    genre,
    imageUrl,
});

        res.status(201).json(game);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

const getGameById = async (req, res) => {
    try {
        const game = await Game.findById(req.params.id);
        
        if (!game) {
            return res.status(404).json({ message: "Game not found" });
        }
        
        res.json(game);
    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};

const getGames = async (req, res) => {
    try {

        const keyword = req.query.search
            ? {
                  title: {
                      $regex: req.query.search,
                      $options: "i"
                  }
              }
            : {};

        const games = await Game.find(keyword);

        res.json(games);

    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};

const deleteGame = async (req, res) => {
    try {
        const game = await Game.findById(req.params.id);

        if (!game) {
            return res.status(404).json({ message: "Game not found" });
        }

        await Game.findByIdAndDelete(req.params.id);
        res.json({ message: "Game deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

const updateGame = async (req, res) => {
    try {

        const game = await Game.findById(
            req.params.id
        );

        if (!game) {
            return res.status(404).json({
                message: "Game not found"
            });
        }

        game.title =
            req.body.title || game.title;

        game.description =
            req.body.description ||
            game.description;

        game.genre =
            req.body.genre || game.genre;

        game.imageUrl =
            req.body.imageUrl ||
            game.imageUrl;

        await game.save();

        res.json(game);

    } catch (error) {

        res.status(500).json({
            message: "Server error",
            error: error.message
        });

    }
};

const getTopGames = async (req, res) => {
    try {
        const games = await Game.find({})
            .sort({ rating: -1, numReviews: -1 })
            .limit(10);

        res.json(games);
    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};

const addReview = async (req, res) => {
    try {
        const { rating, comment } = req.body;
        const game = await Game.findById(req.params.id);
        
        if (!game) {
            return res.status(404).json({ message: "Game not found" });
        }
        
        const review = {
            user: req.user._id,
            username: req.user.username,
            rating: Number(rating),
            comment
        };
        
        game.reviews.push(review);
        
        // Update rating
        const totalRating = game.reviews.reduce((sum, r) => sum + r.rating, 0);
        game.rating = totalRating / game.reviews.length;
        game.numReviews = game.reviews.length;
        
        await game.save();
        
        res.status(201).json(review);
    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};

module.exports = {
    createGame,
    getGameById,
    getGames,
    deleteGame,
    updateGame,
    getTopGames,
    addReview
};
