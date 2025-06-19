const express = require('express');
const router = express.Router();
const { initializePayment } = require('../controllers/paymentController');

router.post('/initiate', initializePayment);

module.exports = router;