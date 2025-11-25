const mongoose = require('mongoose');

const teamSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  gender: {
    type: String,
    required: true,
    enum: ['Boys', 'Girls'],
  },
  category: {
    type: String,
    required: true,
    enum: [
      // Boys
      'U6', 'U7', 'U8', 'U10', 'U12', 'U14', 'U17',
      // Girls
      'U10', 'U12', 'U14', 'U17'
    ],
  },
  coachName: {
    type: String,
    required: true,
    trim: true,
  },
  logoUrl: {
    type: String,
    default: '',
  },
  players: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Player',
  }],
}, { timestamps: true });

// To avoid duplication, a team name should be unique within a category and gender.
teamSchema.index({ name: 1, category: 1, gender: 1 }, { unique: true });

const Team = mongoose.model('Team', teamSchema);

module.exports = Team;
