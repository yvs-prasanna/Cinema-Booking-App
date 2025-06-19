const express = require('express');
const router = express.Router();

const {getUsersAPI} = require('../controllers/userController');
const {isAdmin} = require('../middlewares/checkAdmin');

router.get('/', isAdmin, getUsersAPI);

module.exports = router;