// routes/paymentRoutes.js
const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const { auth, authorize } = require('../middleware/auth');
const { paymentValidation } = require('../middleware/validators');

// Get all payments
router.get('/', auth, authorize([1]), paymentController.getAllPayments);

// Get payment by ID
router.get('/:id', auth, authorize([1]), paymentController.getPaymentById);

// Get payments by booking ID
router.get('/booking/:bookingId', auth, authorize([1]), paymentController.getPaymentsByBookingId);

// Create new payment
router.post('/', auth, authorize([1]), paymentValidation, paymentController.createPayment);

// Update payment status
router.patch('/:id/status', auth, authorize([1]), paymentController.updatePaymentStatus);

// Process refund
router.post('/:id/refund', auth, authorize([1,2,3]), paymentController.processRefund);

// Delete payment (admin only)
router.delete('/:id', auth, authorize([1]), paymentController.deletePayment);

module.exports = router;