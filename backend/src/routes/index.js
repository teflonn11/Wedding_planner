const express = require('express');
const router = express.Router();

const authRoutes = require('./authRoutes');
const userRoutes = require('./userRoutes');
const coupleRoutes = require('./coupleRoutes');
const vendorRoutes = require('./vendorRoutes');
const bookingRoutes = require('./bookingRoutes');
const paymentRoutes = require('./paymentRoutes');
const plannerRoutes = require('./plannerRoutes');
const UtilityRoutes = require('./utilityRoutes');

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/couples', coupleRoutes);
router.use('/vendors', vendorRoutes);
router.use('/bookings', bookingRoutes);
router.use('/payments', paymentRoutes);
router.use('/planners', plannerRoutes);
router.use('/utilities', UtilityRoutes);

module.exports = router;