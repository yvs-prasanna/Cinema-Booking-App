const express = require('express');
const router = express.Router();
const {isAdmin} = require('../middlewares/checkAdmin');
const {addMovie, createShow, updateShow} = require('../controllers/adminController');

router.post('/movie', isAdmin, addMovie);
router.post('/show', isAdmin, createShow);
router.put('/show/:id', isAdmin, updateShow);

module.exports = router;