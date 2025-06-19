const express = require('express');
const router = express.Router();
const { createBookingAPI, getUsersBookingsAPI, getBookingByIdAPI, getBookedSeats} = require('../controllers/bookingController');
const {authorizeUser} = require('../middlewares/authorizeUser');

router.post('/create', authorizeUser, createBookingAPI);
router.get('/user-bookings', authorizeUser, getUsersBookingsAPI);
router.get('/booked-seats', authorizeUser, getBookedSeats);
router.get('/:bookingId', authorizeUser, getBookingByIdAPI);

module.exports = router;