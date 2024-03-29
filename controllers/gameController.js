const Game = require("../models/game");
const Category = require("../models/category");
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const fs = require("fs");

const adminPassword = "admin001";

exports.index = asyncHandler(async (req, res, next) => {
  const [gameCount, categoryCount] = await Promise.all([
    Game.countDocuments({}).exec(),
    Category.countDocuments({}).exec(),
  ]);

  res.render("index", {
    title: "Inventory",
    games: gameCount,
    categories: categoryCount,
  });
});

exports.game_list = asyncHandler(async (req, res, next) => {
  const allGames = await Game.find()
    .sort({ name: 1 })
    .populate("category")
    .exec();

  res.render("game_list", {
    title: "Available Games",
    games: allGames,
  });
});

exports.game_detail = asyncHandler(async (req, res, next) => {
  const game = await Game.findById(req.params.id).populate("category").exec();

  if (game === null) {
    const err = new Error("Game Not Found");
    err.status = 404;
    return next(err);
  }

  res.render("game_detail", {
    title: game.name,
    game: game,
  });
});

exports.create_get = asyncHandler(async (req, res, next) => {
  const allCategories = await Category.find().sort({ name: 1 }).exec();

  res.render("game_form", {
    title: "Create A New Game",
    categories: allCategories,
  });
});

exports.create_post = [
  (req, res, next) => {
    if (!Array.isArray(req.body.category)) {
      req.body.category =
        typeof req.body.category === "undefined" ? [] : [req.body.category];
    }
    next();
  },

  body("name", "Game Name must not be empty.")
    .trim()
    .isLength({ min: 3 })
    .withMessage("Game Name Must Be Atleast 3 Characters.")
    .escape(),
  body("dev", "GameDeveloper must not be empty.")
    .trim()
    .isLength({ min: 3 })
    .withMessage("Game Developer Must Be Atleast 3 Characters.")
    .escape(),
  body("desc", "Game Description must not be empty.")
    .trim()
    .isLength({ min: 3 })
    .withMessage("Game Description Must Be Atleast 3 Characters.")
    .escape(),

  body("price", "Game Price must not be empty")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("stock", "Game Stock must not be empty")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("category.*").escape(),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    const game = new Game({
      name: req.body.name,
      developer: req.body.dev,
      description: req.body.desc,
      price: req.body.price,
      category: req.body.category,
      stock: req.body.stock,
      img: { data: fs.readFileSync("uploads/" + req.file.filename) },
    });

    if (!errors.isEmpty()) {
      const allCategories = await Category.find({}).sort({ name: 1 }).exec();

      allCategories.forEach((category) => {
        if (game.category.includes(category._id)) category.checked = "true";
      });

      res.render("game_form", {
        title: "Create A New Game",
        game: game,
        categories: allCategories,
        errors: errors.array(),
      });
    } else {
      await game.save();
      res.redirect(game.url);
    }
  }),
];

exports.update_get = asyncHandler(async (req, res, next) => {
  const [game, categories] = await Promise.all([
    Game.findById(req.params.id).exec(),
    Category.find({}).sort({ name: 1 }).exec(),
  ]);

  if (game === null) {
    const err = new Error("Game Not Found");
    err.status = 404;
    return next(err);
  }

  categories.forEach((category) => {
    if (game.category.includes(category._id)) category.checked = "true";
  });

  res.render("game_form", {
    title: `Update ${game.name}`,
    game: game,
    categories: categories,
    show: true,
    admin: true,
  });
});

exports.update_post = [
  (req, res, next) => {
    if (!Array.isArray(req.body.category)) {
      req.body.category =
        typeof req.body.category === "undefined" ? [] : [req.body.category];
    }
    next();
  },

  body("name", "Name must not be empty.").trim().isLength({ min: 3 }).escape(),
  body("dev", "Developer must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("desc", "Description must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),

  body("price", "Price must not be empty").trim().isLength({ min: 1 }).escape(),
  body("stock", "Stock must not be empty").trim().isLength({ min: 1 }).escape(),
  body("category.*").escape(),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    const [currentGame, allCategories] = await Promise.all([
      Game.findById(req.params.id).exec(),
      Category.find().exec(),
    ]);

    const game = new Game({
      name: req.body.name,
      developer: req.body.dev,
      description: req.body.desc,
      price: req.body.price,
      category: req.body.category,
      stock: req.body.stock,
      img: req.file
        ? {
            data: fs.readFileSync("uploads/" + req.file.filename),
            contentType: req.file.mimetype,
          }
        : currentGame.img,
      _id: req.params.id,
    });

    if (req.body.admin !== adminPassword) {
      res.render("game_form", {
        title: `Update ${game.name}`,
        game: game,
        categories: allCategories,
        show: true,
        admin: false,
      });
    } else if (!errors.isEmpty()) {
      const allCategories = await Category.find({}).sort({ name: 1 }).exec();

      allCategories.forEach((category) => {
        if (game.category.includes(category._id)) category.checked = "true";
      });

      res.render("game_form", {
        title: `Update ${game.name}`,
        game: game,
        categories: allCategories,
        errors: errors.array(),
        show: true,
        admin: true,
      });
    } else {
      await Game.findByIdAndUpdate(req.params.id, game);
      res.redirect(game.url);
    }
  }),
];

exports.delete_get = asyncHandler(async (req, res, next) => {
  const game = await Game.findById(req.params.id).exec();

  if (game === null) res.redirect("/store/games");

  res.render("game_delete", {
    title: `Delete ${game.name}`,
    game: game,
    permDenied: false,
  });
});

exports.delete_post = asyncHandler(async (req, res, next) => {
  const game = await Game.findById(req.params.id).exec();

  if (req.body.admin !== adminPassword) {
    res.render("game_delete", {
      title: `Delete ${game.name}`,
      game: game,
      permDenied: true,
    });
  } else {
    await Game.findByIdAndDelete(req.body.gameid);
    res.redirect("/store/games");
  }
});
