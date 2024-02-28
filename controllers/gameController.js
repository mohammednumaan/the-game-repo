const Game = require("../models/game");
const Category = require("../models/category")
const asyncHandler = require("express-async-handler");

exports.index = asyncHandler(async (req, res, next) => {
    const [gameCount, categoryCount] = await Promise.all([
        Game.countDocuments({}).exec(),
        Category.countDocuments({}).exec()
    ])

    res.render("index", {
        title: "The Game Repository",
        games: gameCount,
        categories: categoryCount
    })
}) 