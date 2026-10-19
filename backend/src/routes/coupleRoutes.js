const express = require('express');
const router = express.Router();
const coupleController = require('../controllers/coupleController');
const { auth, authorize } = require('../middleware/auth');
const { coupleValidation } = require('../middleware/validators');

// Couple profile routes
router.get('/profile', auth, authorize([1]), coupleController.getProfile);
router.post('/profile', auth, authorize([1]), coupleValidation, coupleController.createProfile);
router.patch('/profile', auth, authorize([1]), coupleController.updateProfile);
router.post('/sendRsvpEmail', auth, authorize([1]), coupleController.sendRsvpEmail);
router.get('/sendOTP', auth, authorize([1]), coupleController.sendOTP);
module.exports = router;