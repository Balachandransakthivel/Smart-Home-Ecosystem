const express = require('express');
const router = express.Router();
const { createHousehold, joinHousehold, getMembers, removeMember, updateMemberRole, getInviteCode } = require('../controllers/householdController');
const { protect, isAdmin } = require('../middleware/authMiddleware');

router.post('/create', protect, createHousehold);
router.post('/join', protect, joinHousehold);
router.get('/members', protect, getMembers);
router.post('/remove-member', protect, isAdmin, removeMember);
router.post('/update-role', protect, isAdmin, updateMemberRole);
router.get('/invite-code', protect, getInviteCode);

module.exports = router;