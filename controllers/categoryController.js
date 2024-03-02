const Game = require("../models/game");
const Category = require("../models/category")
const asyncHandler = require("express-async-handler");

exports.category_list = asyncHandler(async (req, res, next) => {
    const allCategories = await Category.find().sort({name: 1}).exec()

    res.render("category_list", {
        title: "Available Categories",
        categories: allCategories
    })
})

exports.category_detail = asyncHandler(async (req, res, next) => {
    const [category, games] = await Promise.all([
        Category.findById(req.params.id).exec(),
        Game.find({category: req.params.id}).exec()
    ])

    if (category === null){
        const err = new Error('Category Not Found');
        err.status = 404;
        return next(err)
    }

    res.render("category_detail", {
        category: category,
        games: games
    })
})