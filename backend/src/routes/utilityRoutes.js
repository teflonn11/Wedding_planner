const express = require('express');
const router = express.Router();
const utilityController = require('../controllers/utilityController');
const { auth, authorize } = require('../middleware/auth');
const { vendorProfileValidation, vendorServiceValidation } = require('../middleware/validators');

router.get('/categories', auth, authorize([1,2,3]), utilityController.getCategories);
router.get('/services', auth, authorize([1,2,3]), utilityController.getServices);

module.exports = router;