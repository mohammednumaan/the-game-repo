const express = require("express");
const router = express.Router()

const game_controller = require("../controllers/gameController");

// Home Page
router.get('/', game_controller.index)

// Routes for Game
// router.get('/game/create', game_controller.create_get)
// router.post('/game/create', game_controller.create_post) 

module.exports = router;    
