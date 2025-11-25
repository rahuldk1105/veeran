const Player = require('../models/Player');
const Team = require('../models/Team');

// @desc    Create a player
// @route   POST /api/players
// @access  Private/Admin
const createPlayer = async (req, res) => {
    try {
        const { name, dob, jerseyNumber, position, photoUrl, teamId } = req.body;

        if (!name || !dob || !jerseyNumber || !position || !teamId) {
            return res.status(400).json({ message: 'Please provide all required fields for the player.' });
        }

        const team = await Team.findById(teamId);
        if (!team) {
            return res.status(404).json({ message: 'Team not found.' });
        }

        const player = new Player({
            name,
            dob,
            jerseyNumber,
            position,
            photoUrl: photoUrl || (team.logoUrl || ''),
            team: teamId,
            category: team.category, // Auto-fill from team
        });

        const createdPlayer = await player.save();

        // Add player to team's player list
        team.players.push(createdPlayer._id);
        await team.save();

        res.status(201).json(createdPlayer);
    } catch (error) {
        // Handle duplicate key error for jersey number
        if (error.code === 11000) {
            return res.status(400).json({ message: 'Jersey number must be unique for this team.' });
        }
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Get all players
// @route   GET /api/players
// @access  Public
const getPlayers = async (req, res) => {
    try {
        const { teamId, category } = req.query;
        const filter = {};
        if (teamId) {
            filter.team = teamId;
        }
        if (category) {
            filter.category = category;
        }

        const players = await Player.find(filter).populate('team', 'name logoUrl');
        res.status(200).json(players);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Get a single player by ID
// @route   GET /api/players/:id
// @access  Public
const getPlayerById = async (req, res) => {
    try {
        const player = await Player.findById(req.params.id).populate('team', 'name');
        if (!player) {
            return res.status(404).json({ message: 'Player not found' });
        }
        res.status(200).json(player);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Update a player
// @route   PUT /api/players/:id
// @access  Private/Admin
const updatePlayer = async (req, res) => {
    try {
        const { name, dob, jerseyNumber, position, photoUrl } = req.body;
        const player = await Player.findById(req.params.id);

        if (!player) {
            return res.status(404).json({ message: 'Player not found' });
        }

        player.name = name || player.name;
        player.dob = dob || player.dob;
        player.jerseyNumber = jerseyNumber || player.jerseyNumber;
        player.position = position || player.position;
        player.photoUrl = photoUrl || player.photoUrl;

        const updatedPlayer = await player.save();
        res.status(200).json(updatedPlayer);
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ message: 'Jersey number must be unique for this team.' });
        }
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Delete a player
// @route   DELETE /api/players/:id
// @access  Private/Admin
const deletePlayer = async (req, res) => {
    try {
        const player = await Player.findById(req.params.id);

        if (!player) {
            return res.status(404).json({ message: 'Player not found' });
        }

        // Remove player from their team's player list
        const team = await Team.findById(player.team);
        if (team) {
            team.players.pull(player._id);
            await team.save();
        }

        await player.deleteOne();

        res.status(200).json({ message: 'Player deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

module.exports = {
    createPlayer,
    getPlayers,
    getPlayerById,
    updatePlayer,
    deletePlayer,
};
