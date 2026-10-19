const express = require('express');
const router = express.Router();
const budgetController = require('../controllers/budgetController');
const { auth, authorize } = require('../middleware/auth');

router.get('/categories', auth, budgetController.getCategories);
router.get('/', auth, authorize([1]), budgetController.getBudget);
router.post('/', auth, authorize([1]), budgetController.createBudgetItem);
router.put('/:id', auth, authorize([1]), budgetController.updateBudgetItem);
router.delete('/:id', auth, authorize([1]), budgetController.deleteBudgetItem);
router.get('/summary', auth, authorize([1]), budgetController.getBudgetSummary);

module.exports = router;