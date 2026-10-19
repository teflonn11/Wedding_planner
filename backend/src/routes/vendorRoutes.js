const express = require('express');
const router = express.Router();
const vendorController = require('../controllers/vendorController');
const { auth, authorize } = require('../middleware/auth');
const { vendorProfileValidation, vendorServiceValidation } = require('../middleware/validators');

// Vendor profile routes
router.get('/profile', auth, authorize([1,2]), vendorController.getProfile);
router.post('/profile', auth, authorize([2]), vendorProfileValidation, vendorController.createProfile);
router.patch('/profile', auth, authorize([2]), vendorController.updateProfile);


// Vendor availability
router.get('/availability', auth, authorize([1,2]), vendorController.getAvailability);
router.post('/availability', auth, authorize([2]), vendorController.setAvailability);
router.delete('/availability/:id', auth, authorize([2]), vendorController.deleteAvailability);

// Public routes for couples to view vendors
router.get('/', auth, authorize([1]), vendorController.listVendors);
router.get('/:id', auth, vendorController.getVendorDetails);
router.get('/:id/reviews', auth, authorize([1,2]), vendorController.getVendorReviews);

module.exports = router;