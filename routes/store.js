const express = require("express");
const router = express.Router();
const multer = require('multer');

const game_controller = require("../controllers/gameController");
const category_controller= require("../controllers/categoryController");
const upload = multer({dest: 'uploads/'})

// Home Page
router.get('/', game_controller.index)

// Routes for Game
router.get('/game/create', game_controller.create_get)
router.post('/game/create', upload.single('image'), game_controller.create_post)

router.get('/games/:id/delete', game_controller.delete_get);
router.post('/games/:id/delete', game_controller.delete_post)

router.get('/games/:id/update', game_controller.update_get);
router.post('/games/:id/update', upload.single('image'), game_controller.update_post);

router.get('/games/:id', game_controller.game_detail); 
router.get('/games', game_controller.game_list);

// Category Route
router.get('/category/create', category_controller.create_get)
router.post('/category/create', category_controller.create_post)


router.get('/categories/:id/delete', category_controller.delete_get);
router.post('/categories/:id/delete', category_controller.delete_post)

router.get('/categories/:id/update', category_controller.update_get); 
router.post('/categories/:id/update', category_controller.update_post);

router.get('/categories/:id', category_controller.category_detail); 
router.get('/categories', category_controller.category_list)

module.exports = router;    
