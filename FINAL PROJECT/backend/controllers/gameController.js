const Game = require("../models/Game")

const createGame = async(req, res) => {

    const game = await Game.create(req.body);

    res.status(201).json(game);
};

const getGames = async(req, res) => {
    const games = await Game.find();
    res.json(games);
};

module.exports = {
    createGame, getGames
};