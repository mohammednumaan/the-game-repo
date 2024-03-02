const Game = require("../models/game");
const Category = require("../models/category")
const asyncHandler = require("express-async-handler");

exports.index = asyncHandler(async (req, res, next) => {
    const [gameCount, categoryCount] = await Promise.all([
        Game.countDocuments({}).exec(),
        Category.countDocuments({}).exec()
    ])

    res.render("index", {
        games: gameCount,
        categories: categoryCount
    })
})

exports.game_list = asyncHandler(async (req, res, next) => {
    const allGames = await Game.find().sort({name: 1}).populate("category").exec()

    res.render("game_list", {
        title: "Available Games",
        games: allGames
    })
})

exports.game_detail = asyncHandler(async (req, res, next) => {
    const game = await Game.findById(req.params.id).populate("category").exec()
    
    if (game === null){
        const err = new Error('Game Not Found');
        err.status = 404;
        return next(err)
    }

    res.render("game_detail", {
        game: game
    })
})