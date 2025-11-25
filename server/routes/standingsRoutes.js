const express = require('express');
const router = express.Router();
const { getStandings } = require('../controllers/standingsController');

// All routes are prefixed with /api/standings
router.route('/').get(getStandings);

module.exports = router;
