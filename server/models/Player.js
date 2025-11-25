const mongoose = require('mongoose');

const playerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  dob: {
    type: Date,
    required: true,
  },
  jerseyNumber: {
    type: Number,
    required: true,
  },
  position: {
    type: String,
    required: true,
    enum: ['Goalkeeper', 'Defender', 'Midfielder', 'Forward'],
  },
  photoUrl: {
    type: String,
    default: '',
  },
  team: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Team',
    required: true,
  },
  // Denormalized from team for easier filtering
  category: {
      type: String,
      required: true,
  },
  // Stats
  goals: {
    type: Number,
    default: 0,
  },
  yellowCards: {
    type: Number,
    default: 0,
  },
  redCards: {
    type: Number,
    default: 0,
  },
  fouls: {
    type: Number,
    default: 0,
  },
}, { timestamps: true });

// A player's jersey number should be unique within a team.
playerSchema.index({ team: 1, jerseyNumber: 1 }, { unique: true });

const Player = mongoose.model('Player', playerSchema);

module.exports = Player;
