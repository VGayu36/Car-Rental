const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/BookingController');


router.post('/bookings', bookingController.createBooking);

router.get('/bookings/user', bookingController.getAllUsers);

router.get('/confirmpayment', bookingController.confirmPayment);

router.get('/bookings/user/:userId', bookingController.getUserById);

module.exports = router;
