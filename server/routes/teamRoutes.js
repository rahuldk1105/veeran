const express = require('express');
const router = express.Router();
const {
  createTeam,
  getTeams,
  getTeamById,
  updateTeam,
  deleteTeam,
  addPlayerToTeam
} = require('../controllers/teamController');
const { protect, admin } = require('../middleware/authMiddleware');

// Public routes
router.route('/').get(getTeams);
router.route('/:id').get(getTeamById);

// Admin only routes
router.route('/').post(protect, admin, createTeam);
router.route('/:id').put(protect, admin, updateTeam).delete(protect, admin, deleteTeam);
router.route('/:id/players').post(protect, admin, addPlayerToTeam);

module.exports = router;
