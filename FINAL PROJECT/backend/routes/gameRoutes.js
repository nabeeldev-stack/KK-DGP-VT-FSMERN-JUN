const express = require("express");
const { admin } = require("../middleware/adminMiddleware");
const { protect } = require("../middleware/authMiddleware");
const router = express.Router();

const{
    createGame,
    getGameById,
    getGames,
    deleteGame,
    updateGame,
    getTopGames,
    addReview
} = require("../controllers/gameController");
router.post("/", protect, admin, createGame);
router.get("/", getGames);
router.get("/top", getTopGames);
router.get("/:id", getGameById);
router.post("/:id/reviews", protect, addReview);
router.delete("/:id", protect, admin, deleteGame);
router.put("/:id", protect, admin, updateGame);

module.exports = router;