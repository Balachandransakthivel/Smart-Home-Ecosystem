const express = require('express');
const router = express.Router();
const { getAlerts, markRead, markAllRead, triggerEmergency } = require('../controllers/alertController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, getAlerts);
router.post('/emergency', protect, triggerEmergency);
router.put('/read-all', protect, markAllRead);
router.put('/:id/read', protect, markRead);

module.exports = router;