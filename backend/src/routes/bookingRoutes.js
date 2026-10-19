const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const { auth, authorize } = require('../middleware/auth');
const { bookingValidation } = require('../middleware/validators');

// Couple booking routes
router.get('/', auth, bookingController.getBookings);
router.post('/', auth, authorize([1]), bookingValidation, bookingController.createBooking);
router.get('/:id', auth, bookingController.getBookingDetails);
router.patch('/:id', auth, bookingController.updateBooking);
router.delete('/:id', auth, authorize([1,2,3]), bookingController.cancelBooking);
router.post('/complete/:id', auth, authorize([1,2,3]), bookingController.completeBooking);
router.post('/:id/review', auth, authorize([1]), bookingController.createReview);

module.exports = router;