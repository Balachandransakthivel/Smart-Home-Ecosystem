const express = require('express');
const router = express.Router();
const { getCleaningTasks, createCleaningTask, updateCleaningTask, deleteCleaningTask } = require('../controllers/cleaningController');
const { protect, hasHousehold } = require('../middleware/authMiddleware');

router.route('/').get(protect, hasHousehold, getCleaningTasks).post(protect, hasHousehold, createCleaningTask);
router.route('/:id').put(protect, hasHousehold, updateCleaningTask).delete(protect, hasHousehold, deleteCleaningTask);

module.exports = router;