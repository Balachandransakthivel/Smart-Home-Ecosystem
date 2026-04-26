const Expense = require('../models/Expense');
const mongoose = require('mongoose');

// @desc    Get all expenses with filtering
// @route   GET /api/expenses
// @access  Private
const getExpenses = async (req, res) => {
  try {
    const { category, startDate, endDate } = req.query;
    const query = { householdId: req.user.householdId };

    if (category) {
      query.category = category;
    }

    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }

    const expenses = await Expense.find(query).sort({ date: -1 }).populate('userId', 'name');
    
    // Calculate total spending for the current month
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    
    const monthlyTotalResult = await Expense.aggregate([
      {
        $match: {
          householdId: req.user.householdId,
          date: { $gte: startOfMonth }
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$amount' }
        }
      }
    ]);

    const monthlyTotal = monthlyTotalResult.length > 0 ? monthlyTotalResult[0].total : 0;

    res.json({
      expenses,
      monthlyTotal
    });
  } catch (error) {
    console.error('getExpenses Error:', error);
    res.status(500).json({ message: 'Server error while fetching expenses' });
  }
};

// @desc    Create new expense
// @route   POST /api/expenses
// @access  Private
const createExpense = async (req, res) => {
  try {
    const { title, amount, category, date } = req.body;

    if (!title || !amount) {
      return res.status(400).json({ message: 'Please provide title and amount' });
    }

    const expense = await Expense.create({
      title,
      amount,
      category: category || 'Other',
      date: date || Date.now(),
      userId: req.user._id,
      householdId: req.user.householdId
    });

    res.status(201).json(expense);
  } catch (error) {
    console.error('createExpense Error:', error);
    res.status(500).json({ message: 'Server error while creating expense' });
  }
};

// @desc    Delete expense
// @route   DELETE /api/expenses/:id
// @access  Private (Admin or Owner)
const deleteExpense = async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);

    if (!expense) {
      return res.status(404).json({ message: 'Expense not found' });
    }

    // Role-based check: Only owner or household admin can delete
    const isAdmin = req.user.role === 'admin';
    const isOwner = expense.userId.toString() === req.user._id.toString();

    if (!isAdmin && !isOwner) {
      return res.status(403).json({ message: 'Not authorized to delete this expense' });
    }

    await Expense.deleteOne({ _id: req.params.id });
    res.json({ message: 'Expense removed' });
  } catch (error) {
    console.error('deleteExpense Error:', error);
    res.status(500).json({ message: 'Server error while deleting expense' });
  }
};

// Helper function for internal use (auto-sync)
const createInternalExpense = async ({ title, amount, category, userId, householdId, metadata }) => {
  try {
    return await Expense.create({
      title,
      amount,
      category,
      userId,
      householdId,
      metadata
    });
  } catch (error) {
    console.error('Internal Expense Creation Error:', error);
    return null;
  }
};

module.exports = { 
  getExpenses, 
  createExpense, 
  deleteExpense,
  createInternalExpense 
};