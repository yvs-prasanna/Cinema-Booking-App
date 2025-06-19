const express = require('express');
const router = express.Router();

const {getSeatLayout, getSeatLayoutDetails} = require('../controllers/seatController');

const {authorizeUser} = require('../middlewares/authorizeUser');

// Route to get seat layout
router.get('/seat-layout', authorizeUser, getSeatLayout);
router.get('/seat-layout-details', authorizeUser, getSeatLayoutDetails);

module.exports = router;