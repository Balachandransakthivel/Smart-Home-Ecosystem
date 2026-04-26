const express = require('express');
const router = express.Router();
const { getSuggestions, getDeviceRecommendations } = require('../controllers/aiController');
const { protect } = require('../middleware/authMiddleware');

router.post('/suggestions', protect, getSuggestions);
router.post('/recommend', protect, getDeviceRecommendations);

module.exports = router;
