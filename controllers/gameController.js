const mongoose = require("mongoose");
const Game = require("../models/game");
const asyncHandler = require("express-async-handler");

exports.index = asyncHandler(async (req, res, next) => {
    res.send('Welcome to The game REPO!')
}) 