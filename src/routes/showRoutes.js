const express = require('express');

const router = express.Router();

const {getShowsAPI} = require('../controllers/showController'); 
const {getSeatLayout} = require('../controllers/seatController'); 
const {authorizeUser} = require('../middlewares/authorizeUser'); 
router.get('/', authorizeUser, getShowsAPI);
router.get('/:showId/seats', authorizeUser, getSeatLayout);

module.exports = router;