const express = require('express');
const router = express.Router();
const {
  createMatch,
  getMatches,
  getMatchById,
  updateMatch,
  deleteMatch,
  getMatchEvents,
  createMatchEvent,
} = require('../controllers/matchController');
const { protect, admin, referee } = require('../middleware/authMiddleware');

// Public routes
router.route('/').get(getMatches);
router.route('/:id').get(getMatchById);
router.route('/:id/events').get(getMatchEvents);

// Admin only routes
router.route('/').post(protect, admin, createMatch);
router.route('/:id').delete(protect, admin, deleteMatch);

// Referee (or Admin) routes
router.route('/:id').put(protect, referee, updateMatch);
router.route('/:id/events').post(protect, referee, createMatchEvent);

module.exports = router;
