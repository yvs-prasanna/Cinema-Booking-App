const express = require('express');
const router = express.Router();
const {getFnbMenu, addFnbOrder} = require('../controllers/fnbController');

router.get('/menu', getFnbMenu);
router.post('/order', addFnbOrder);

module.exports = router;