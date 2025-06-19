const express = require('express');
const router = express.Router();

const {authorizeUser} = require('../middlewares/authorizeUser');

const {getMoviesAPI, getMovieByIdAPI, upcomingMoviesAPI, addMovieAPI, updateMovieAPI, deleteMovieAPI} = require('../controllers/movieController');

router.get('/', authorizeUser, getMoviesAPI);
router.get('/upcoming', authorizeUser, upcomingMoviesAPI);
router.get('/:id', authorizeUser, getMovieByIdAPI);


module.exports = router;