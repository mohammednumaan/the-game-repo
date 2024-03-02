const Game = require("../models/game");
const Category = require("../models/category")
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");


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


exports.create_get = asyncHandler(async (req, res, next) => {
    res.render("category_form", {
        title: 'Create A New Category'
    })
})  

exports.create_post = [
    body("category-name", "Category Name Must Not Be Empty.")
        .trim()
        .isLength({min : 3})
        .withMessage("There Needs To Be Atleast 3 Characters")
        .escape(),
    
    body("category-desc", "Category Desc Must Not Be Empty.")
        .trim()
        .isLength({min : 1})
        .withMessage("There Needs To Be Atleast 1 Character.")
        .escape(),

    asyncHandler(async (req, res, next) => {

        const errors = validationResult(req);

        const category = new Category({
            name: req.body["category-name"],
            description: req.body["category-desc"]
        })

        if (!errors.isEmpty()){
            res.render("category_form", {
                title: "Create A New Category",
                category: category,
                errors: errors.array()
            })
        }

        else{
            await category.save()
            res.redirect(category.url)
        }
    })

    

]
