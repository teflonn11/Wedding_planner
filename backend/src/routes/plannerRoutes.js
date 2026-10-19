const express = require('express');
const router = express.Router();
const plannerController = require('../controllers/plannerController');
const { auth, authorize } = require('../middleware/auth');
const { plannerProfileValidation } = require('../middleware/validators');

// Planner Profile Routes
router.get('/profile', auth, authorize([3]), plannerController.getPlannerProfile);
router.post('/profile', auth, authorize([3]), plannerProfileValidation, plannerController.createProfile);
router.patch('/profile', auth, authorize([3]), plannerController.updatePlannerProfile);
router.get('/', auth, authorize([1]), plannerController.listPlanners);
router.get('/:id', auth, plannerController.getPlannerDetails);


module.exports = router;