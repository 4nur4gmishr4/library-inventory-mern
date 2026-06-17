const express = require('express');
const router = express.Router();
const { getMembers, createMember, updateMember, deleteMember } = require('../controllers/memberController');
const { protect } = require('../middleware/authMiddleware');

// All member routes require authentication
router.route('/').get(protect, getMembers).post(protect, createMember);
router.route('/:id').put(protect, updateMember).delete(protect, deleteMember);

module.exports = router;
