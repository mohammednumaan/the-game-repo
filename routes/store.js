const express = require("express");
const router = express.Router()

const game_controller = require("../controllers/gameController");
const category_controller= require("../controllers/categoryController");

// Home Page
router.get('/', game_controller.index)

// Routes for Game
// router.get('/game/create', game_controller.create_get)
// router.post('/game/create', game_controller.create_post) 
router.get('/games', game_controller.game_list)

// Category Route
router.get('/categories', category_controller.category_list)

module.exports = router;    
