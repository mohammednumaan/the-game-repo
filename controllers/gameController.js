const Game = require("../models/game");
const Category = require("../models/category")
const asyncHandler = require("express-async-handler");

exports.index = asyncHandler(async (req, res, next) => {
    const [gameCount, categoryCount] = await Promise.all([
        Game.countDocuments({}).exec(),
        Category.countDocuments({}).exec()
    ])

    res.render("index", {
        heading: "The Game Repository",
        games: gameCount,
        categories: categoryCount
    })
})

exports.game_list = asyncHandler(async (req, res, next) => {
    const allGames = await Game.find().sort({name: 1}).populate("category").exec()

    res.render("game_list", {
        heading: "The Game Repository",
        title: "Available Games",
        games: allGames
    })
})