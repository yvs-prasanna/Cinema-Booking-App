const express = require('express');
const router = express.Router();
const { initializePayment, confirmPayment } = require('../controllers/paymentController');
const { authorizeUser } = require('../middlewares/authorizeUser');

router.post('/initiate', authorizeUser, initializePayment);
router.post('/confirm', authorizeUser, confirmPayment);

module.exports = router;