const express = require('express');
const router = express.Router();
const {
  createReferee,
  getReferees,
  getRefereeById,
  updateReferee,
  deleteReferee,
} = require('../controllers/refereeController');
const { protect, admin } = require('../middleware/authMiddleware');

// All routes are admin-only
router.use(protect, admin);

router.route('/').post(createReferee).get(getReferees);
router.route('/:id').get(getRefereeById).put(updateReferee).delete(deleteReferee);

module.exports = router;
