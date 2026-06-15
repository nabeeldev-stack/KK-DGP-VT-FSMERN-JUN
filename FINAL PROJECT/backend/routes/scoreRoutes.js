const express = require('express');
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const { submitScore, getLeaderboard } = require('../controllers/scoreController');

router.post("/", protect, submitScore);
router.get("/leaderboard",getLeaderboard);

module.exports = router;