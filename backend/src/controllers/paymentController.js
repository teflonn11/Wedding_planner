// controllers/paymentController.js
const { error } = require('winston');
const db = require('../config/database');
const logger = require('../utils/logger');
const { validationResult } = require('express-validator');

// Get all payments
exports.getAllPayments = async (req, res) => {
    try {
        const payments = await db.query(`
            SELECT p.payment_id paymentId, p.booking_id bookingId, p.amount, p.payment_date paymentDate, p.payment_method paymentMethod, p.transaction_id transactionId, p.status, b.booking_date bookingDate, b.vendor_id vendorId, b.couple_id coupleId 
            FROM payments p
            JOIN bookings b ON p.booking_id = b.booking_id
            ORDER BY p.payment_date DESC
        `);

        res.status(200).json({
            status: 'success',
            results: payments.length,
            data: payments
        });
    } catch (error) {
        logger.error('Error fetching payments:', error);
        res.status(500).json({
            status: 'error',
            error: 'Failed to fetch payments'
        });
    }
};

// Get payment by ID
exports.getPaymentById = async (req, res) => {
    try {
        const payment = await db.query(`
            SELECT p.payment_id paymentId, p.booking_id bookingId, p.amount, p.payment_date paymentDate, p.payment_method paymentMethod, p.transaction_id transactionId, p.status, b.booking_date bookingDate, b.vendor_id vendorId, b.couple_id coupleId
            
            FROM payments p
            JOIN bookings b ON p.booking_id = b.booking_id
            WHERE p.payment_id = ?
        `, [req.params.id]);

        if (payment.length === 0) {
            return res.status(404).json({
                status: 'fail',
                error: 'Payment not found'
            });
        }

        res.status(200).json({
            status: 'success',
            data: payment[0]
        });
    } catch (error) {
        logger.error('Error fetching payment:', error);
        res.status(500).json({
            status: 'error',
            error: 'Failed to fetch payment'
        });
    }
};

// Get payments by booking ID
exports.getPaymentsByBookingId = async (req, res) => {
    try {
        const payments = await db.query(`
            SELECT payment_id paymentId, booking_id bookingId, amount, payment_date paymentDate, payment_method paymentMethod, transaction_id transactionId, status FROM payments
            WHERE booking_id = ?
            ORDER BY payment_date DESC
        `, [req.params.bookingId]);

        res.status(200).json({
            status: 'success',
            results: payments.length,
            data: payments
        });
    } catch (error) {
        logger.error('Error fetching payments for booking:', error);
        res.status(500).json({
            status: 'error',
            error: 'Failed to fetch payments for booking'
        });
    }
};

// Create new payment
exports.createPayment = async (req, res) => {
    try {
        // const errors = validationResult(req);
        // if (!errors.isEmpty()) {
        //     return res.status(400).json({
        //         status: 'fail',
        //         error: errors.array()
        //     });
        // }

        const { bookingId, amount, paymentMethod, transactionId, cardDetails } = req.body;
        // First check if booking exists
        const bookingCheck = await db.query('SELECT * FROM bookings WHERE booking_id = ?', [bookingId]);
        if (bookingCheck.length === 0) {
            return res.status(404).json({
                status: 'fail',
                error: 'Booking not found'
            });
        }

        // if(bookingCheck[0].total_price != amount) {
        //     return res.status(400).json({
        //         status: 'fail',
        //         error: 'Payment amount does not match booking total price'
        //     });
        // }

        // Insert payment
        const result = await db.query(`
            INSERT INTO payments 
            (booking_id, amount, payment_method, transaction_id, status, card_details) 
            VALUES (?, ?, ?, ?, ?, ?)
        `, [bookingId, amount, paymentMethod, transactionId, 'completed', cardDetails]);

        // Get the created payment
        const payment = await db.query('SELECT * FROM payments WHERE payment_id = ?', [result.insertId]);

        // Update booking status if needed
        await db.query('UPDATE bookings SET status = ? WHERE booking_id = ?', ['confirmed', bookingId]);

        res.status(201).json({
            status: 'success',
            message: 'Payment created successfully',
            data: payment[0]
        });
    } catch (error) {
        logger.error('Error creating payment:', error);
        res.status(500).json({
            status: 'error',
            error: 'Failed to create payment'
        });
    }
};

// Update payment status
exports.updatePaymentStatus = async (req, res) => {
    try {
        const { status } = req.body;

        if (!['pending', 'completed', 'failed', 'refunded'].includes(status)) {
            return res.status(400).json({
                status: 'fail',
                error: 'Invalid payment status'
            });
        }

        // Check if payment exists
        const paymentCheck = await db.query('SELECT * FROM payments WHERE payment_id = ?', [req.params.id]);
        if (paymentCheck.length === 0) {
            return res.status(404).json({
                status: 'fail',
                error: 'Payment not found'
            });
        }

        // Update payment status
        await db.query('UPDATE payments SET status = ? WHERE payment_id = ?', [status, req.params.id]);

        // If refunded or failed, update booking status accordingly
        if (status === 'refunded' || status === 'failed') {
            await db.query('UPDATE bookings SET status = ? WHERE booking_id = ?', ['cancelled', paymentCheck[0].booking_id]);
        }

        res.status(200).json({
            status: 'success',
            message: 'Payment status updated successfully'
        });
    } catch (error) {
        logger.error('Error updating payment status:', error);
        res.status(500).json({
            status: 'error',
            error: 'Failed to update payment status'
        });
    }
};

// Process refund
exports.processRefund = async (req, res) => {
    const connection = await db.getConnection();
    try {
        // Start a transaction
        await connection.beginTransaction();

        // Get payment details
        const payment = await db.query('SELECT * FROM payments WHERE payment_id = ?', [req.params.id]);

        if (payment.length === 0) {
            await connection.rollback();
            return res.status(404).json({
                status: 'fail',
                error: 'Payment not found'
            });
        }

        if (payment[0].status === 'refunded') {
            await connection.rollback();
            return res.status(400).json({
                status: 'fail',
                error: 'Payment has already been refunded'
            });
        }

        // Here you would normally connect to your payment gateway's API to process the actual refund
        // This is a placeholder for that integration

        // Update payment status to refunded
        await connection.execute('UPDATE payments SET status = ? WHERE payment_id = ?', ['refunded', req.params.id]);

        // Update the booking status
        await connection.execute('UPDATE bookings SET status = ? WHERE booking_id = ?', ['cancelled', payment[0].booking_id]);

        // Commit the transaction
        await connection.commit();

        res.status(200).json({
            status: 'success',
            message: 'Refund processed successfully'
        });
    } catch (error) {
        // Rollback in case of error
        await connection.rollback();
        logger.error('Error processing refund:', error);
        res.status(500).json({
            status: 'error',
            error: 'Failed to process refund'
        });
    } finally {
        connection.release(); // Release connection back to pool
    }
};

// Delete payment (admin only)
exports.deletePayment = async (req, res) => {
    try {
        // Check if payment exists
        const payment = await db.query('SELECT * FROM payments WHERE payment_id = ?', [req.params.id]);

        if (payment.length === 0) {
            return res.status(404).json({
                status: 'fail',
                error: 'Payment not found'
            });
        }

        // Delete the payment
        await db.query('DELETE FROM payments WHERE payment_id = ?', [req.params.id]);

        res.status(200).json({
            status: 'success',
            message: 'Payment deleted successfully'
        });
    } catch (error) {
        logger.error('Error deleting payment:', error);
        res.status(500).json({
            status: 'error',
            error: 'Failed to delete payment'
        });
    }
};