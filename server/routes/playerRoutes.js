const express = require('express');
const router = express.Router();
const {
  createPlayer,
  getPlayers,
  getPlayerById,
  updatePlayer,
  deletePlayer,
} = require('../controllers/playerController');
const { protect, admin } = require('../middleware/authMiddleware');

// Public routes
router.route('/').get(getPlayers);
router.route('/:id').get(getPlayerById);

// Admin only routes
router.route('/').post(protect, admin, createPlayer);
router.route('/:id').put(protect, admin, updatePlayer).delete(protect, admin, deletePlayer);

module.exports = router;
