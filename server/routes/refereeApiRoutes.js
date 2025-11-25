const express = require('express');
const router = express.Router();
const { getMyMatches } = require('../controllers/refereeApiController');
const { protect, referee } = require('../middleware/authMiddleware');

// All routes are prefixed with /api/referee
// This is for the logged-in referee's own data
router.route('/matches').get(protect, referee, getMyMatches);

module.exports = router;
