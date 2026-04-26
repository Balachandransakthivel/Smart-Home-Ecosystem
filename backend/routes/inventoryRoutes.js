const express = require('express');
const router = express.Router();
const { getInventory, createInventoryItem, updateInventoryItem, deleteInventoryItem } = require('../controllers/inventoryController');
const { protect, authorize, hasHousehold } = require('../middleware/authMiddleware');

router.route('/').get(protect, hasHousehold, getInventory).post(protect, hasHousehold, createInventoryItem);
router.route('/:id').put(protect, hasHousehold, updateInventoryItem).delete(protect, hasHousehold, authorize('admin', 'member'), deleteInventoryItem);

module.exports = router;