const Match = require('../models/Match');
const MatchEvent = require('../models/MatchEvent');
const Player = require('../models/Player');
const { broadcast } = require('../services/websocket');

// @desc    Create a match
// @route   POST /api/matches
// @access  Private/Admin
const createMatch = async (req, res) => {
    try {
        const { day, gender, category, teamA, teamB, matchTime, groundNumber, referee } = req.body;

        if (!day || !gender || !category || !teamA || !teamB || !matchTime || !referee) {
            return res.status(400).json({ message: 'Please provide all required fields for the match.' });
        }

        if (teamA === teamB) {
            return res.status(400).json({ message: 'A team cannot play against itself.' });
        }

        const match = new Match({
            day,
            gender,
            category,
            teamA,
            teamB,
            matchTime,
            groundNumber,
            referee,
        });

        const createdMatch = await match.save();
        res.status(201).json(createdMatch);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Get all matches
// @route   GET /api/matches
// @access  Public
const getMatches = async (req, res) => {
    try {
        const { day, category, gender, status } = req.query;
        const filter = {};
        if (day) filter.day = day;
        if (category) filter.category = category;
        if (gender) filter.gender = gender;
        if (status) filter.status = status;

        const matches = await Match.find(filter)
            .populate('teamA', 'name logoUrl')
            .populate('teamB', 'name logoUrl')
            .populate('referee', 'name')
            .sort({ matchTime: 'asc' });

        res.status(200).json(matches);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Get a single match by ID
// @route   GET /api/matches/:id
// @access  Public
const getMatchById = async (req, res) => {
    try {
        const match = await Match.findById(req.params.id)
            .populate({
                path: 'teamA',
                populate: {
                    path: 'players',
                    model: 'Player'
                }
            })
            .populate({
                path: 'teamB',
                populate: {
                    path: 'players',
                    model: 'Player'
                }
            })
            .populate('referee', 'name');

        if (!match) {
            return res.status(404).json({ message: 'Match not found' });
        }
        res.status(200).json(match);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Update a match (for scores, status, etc.)
// @route   PUT /api/matches/:id
// @access  Private/Admin or Private/Referee
const updateMatch = async (req, res) => {
    try {
        const match = await Match.findById(req.params.id);

        if (!match) {
            return res.status(404).json({ message: 'Match not found' });
        }

        // Update fields from request body
        Object.assign(match, req.body);

        const updatedMatch = await match.save();

        // Broadcast general match updates (like timer start/stop, status change)
        broadcast({
            type: 'match-update',
            payload: {
                matchId: updatedMatch._id,
                status: updatedMatch.status,
                scoreA: updatedMatch.scoreA,
                scoreB: updatedMatch.scoreB,
                timer: updatedMatch.timer,
            }
        });
        
        res.status(200).json(updatedMatch);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Delete a match
// @route   DELETE /api/matches/:id
// @access  Private/Admin
const deleteMatch = async (req, res) => {
    try {
        const match = await Match.findById(req.params.id);

        if (!match) {
            return res.status(404).json({ message: 'Match not found' });
        }

        // Also delete all events associated with this match
        await MatchEvent.deleteMany({ match: req.params.id });

        await match.deleteOne();

        res.status(200).json({ message: 'Match and associated events deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Get all events for a specific match
// @route   GET /api/matches/:id/events
// @access  Public
const getMatchEvents = async (req, res) => {
    try {
        const events = await MatchEvent.find({ match: req.params.id })
            .populate('player', 'name jerseyNumber')
            .populate('team', 'name')
            .sort({ createdAt: 'asc' });

        res.status(200).json(events);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Create a match event
// @route   POST /api/matches/:id/events
// @access  Private/Referee
const createMatchEvent = async (req, res) => {
    try {
        const { type, player, team, minute } = req.body;
        const matchId = req.params.id;

        if (!type || !player || !team || !minute) {
            return res.status(400).json({ message: 'Please provide all event details.' });
        }

        const match = await Match.findById(matchId);
        if (!match) {
            return res.status(404).json({ message: 'Match not found.' });
        }

        // 1. Create and save the event
        const newEvent = new MatchEvent({
            match: matchId,
            type,
            player,
            team,
            minute,
        });
        await newEvent.save();

        const playerDoc = await Player.findById(player);

        // 2. Update player and match stats
        switch(type) {
            case 'Goal':
                playerDoc.goals += 1;
                if (match.teamA.toString() === team) match.scoreA += 1;
                else match.scoreB += 1;
                break;
            case 'Self Goal':
                // Self-goal is a goal for the opposing team
                if (match.teamA.toString() === team) match.scoreB += 1;
                else match.scoreA += 1;
                break;
            case 'Yellow Card':
                playerDoc.yellowCards += 1;
                break;
            case 'Red Card':
                playerDoc.redCards += 1;
                break;
            case 'Foul':
                playerDoc.fouls += 1;
                break;
        }

        await playerDoc.save();
        await match.save();
        
        // 3. Broadcast updates
        // Broadcast the specific event
        broadcast({
            type: 'event-update',
            payload: {
                matchId,
                event: newEvent,
            }
        });

        // Broadcast the score change
        broadcast({
            type: 'score-update',
            payload: {
                matchId,
                scoreA: match.scoreA,
                scoreB: match.scoreB,
            }
        });

        res.status(201).json(newEvent);

    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};


module.exports = {
    createMatch,
    getMatches,
    getMatchById,
    updateMatch,
    deleteMatch,
    getMatchEvents,
    createMatchEvent,
};