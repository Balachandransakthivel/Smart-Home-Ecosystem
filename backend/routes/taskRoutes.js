const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const { getTasks, createTask, updateTask, deleteTask } = require('../controllers/taskController');
const { protect, authorize, hasHousehold } = require('../middleware/authMiddleware');

router.route('/')
  .get(protect, hasHousehold, getTasks)
  .post(protect, hasHousehold, [check('title').notEmpty()], createTask);

router.route('/:id')
  .put(protect, hasHousehold, updateTask)
  .delete(protect, hasHousehold, authorize('admin', 'member'), deleteTask);

module.exports = router;