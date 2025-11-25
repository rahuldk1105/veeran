const Match = require('../models/Match');
const Referee = require('../models/Referee');

// @desc    Get matches assigned to the logged-in referee
// @route   GET /api/referee/matches
// @access  Private/Referee
const getMyMatches = async (req, res) => {
    try {
        // req.user.id is the supabase user id, attached from the 'protect' middleware
        const refereeProfile = await Referee.findOne({ supabaseUserId: req.user.id });

        if (!refereeProfile) {
            return res.status(404).json({ message: "Referee profile not found." });
        }

        const matches = await Match.find({ referee: refereeProfile._id })
            .populate('teamA', 'name')
            .populate('teamB', 'name')
            .sort({ matchTime: 'asc' });
        
        res.status(200).json(matches);

    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

module.exports = {
    getMyMatches,
};
