const express = require('express');
const router = express.Router();
const { getLocationsAPI, getTheatersAPI } = require('../controllers/theaterController');
const { authorizeUser } = require('../middlewares/authorizeUser');

// Define the route for getting locations
router.get('/cities', authorizeUser, getLocationsAPI);  
router.get('/theaters', authorizeUser, getTheatersAPI); 

// Export the router
module.exports = router;