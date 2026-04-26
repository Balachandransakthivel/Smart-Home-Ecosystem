const express = require('express');
const router = express.Router();
const { getMaintenanceTasks, createMaintenanceTask, updateMaintenanceTask, deleteMaintenanceTask } = require('../controllers/maintenanceController');
const { protect, authorize, hasHousehold } = require('../middleware/authMiddleware');

router.route('/').get(protect, hasHousehold, getMaintenanceTasks).post(protect, hasHousehold, createMaintenanceTask);
router.route('/:id').put(protect, hasHousehold, authorize('admin', 'member'), updateMaintenanceTask).delete(protect, hasHousehold, authorize('admin'), deleteMaintenanceTask);

module.exports = router;