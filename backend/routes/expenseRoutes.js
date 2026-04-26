const express = require('express');
const router = express.Router();
const { getExpenses, createExpense, deleteExpense } = require('../controllers/expenseController');
const { protect, authorize, hasHousehold } = require('../middleware/authMiddleware');

router.route('/').get(protect, hasHousehold, getExpenses).post(protect, hasHousehold, createExpense);
router.route('/:id').delete(protect, hasHousehold, authorize('admin', 'member'), deleteExpense);

module.exports = router;