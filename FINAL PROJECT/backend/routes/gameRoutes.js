const express = require("express");

const router = express.Router();

const{
    createGame,
    getGames
} = require("../controllers/gameController");
router.post("/", createGame);
router.get("/", getGames);

module.exports = router;