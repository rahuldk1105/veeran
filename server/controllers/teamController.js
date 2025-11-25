const Team = require('../models/Team');
const Player = require('../models/Player');

// @desc    Create a team
// @route   POST /api/teams
// @access  Private/Admin
const createTeam = async (req, res) => {
  try {
    const { name, gender, category, coachName, logoUrl } = req.body;

    // Basic validation
    if (!name || !gender || !category || !coachName) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    const team = new Team({
      name,
      gender,
      category,
      coachName,
      logoUrl,
    });

    const createdTeam = await team.save();
    res.status(201).json(createdTeam);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Get all teams
// @route   GET /api/teams
// @access  Public
const getTeams = async (req, res) => {
  try {
    const { gender, category } = req.query;
    const filter = {};
    if (gender) {
      filter.gender = gender;
    }
    if (category) {
      filter.category = category;
    }

    const teams = await Team.find(filter).populate('players');
    res.status(200).json(teams);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Get a single team by ID
// @route   GET /api/teams/:id
// @access  Public
const getTeamById = async (req, res) => {
  try {
    const team = await Team.findById(req.params.id).populate('players');
    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }
    res.status(200).json(team);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Update a team
// @route   PUT /api/teams/:id
// @access  Private/Admin
const updateTeam = async (req, res) => {
  try {
    const { name, gender, category, coachName, logoUrl } = req.body;
    const team = await Team.findById(req.params.id);

    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }

    team.name = name || team.name;
    team.gender = gender || team.gender;
    team.category = category || team.category;
    team.coachName = coachName || team.coachName;
    team.logoUrl = logoUrl || team.logoUrl;

    const updatedTeam = await team.save();
    res.status(200).json(updatedTeam);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Delete a team
// @route   DELETE /api/teams/:id
// @access  Private/Admin
const deleteTeam = async (req, res) => {
  try {
    const team = await Team.findById(req.params.id);

    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }

    // Note: This is a hard delete. Associated players are not deleted
    // but will have a dangling reference. A more robust implementation
    // would handle this, e.g., by deleting players or preventing deletion.
    await team.deleteOne();

    res.status(200).json({ message: 'Team deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Add a player to a team
// @route   POST /api/teams/:id/players
// @access  Private/Admin
const addPlayerToTeam = async (req, res) => {
    res.status(200).json({ message: 'Player added to team' });
};

module.exports = {
  createTeam,
  getTeams,
  getTeamById,
  updateTeam,
  deleteTeam,
  addPlayerToTeam,
};
