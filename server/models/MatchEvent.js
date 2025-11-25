const mongoose = require('mongoose');

const matchEventSchema = new mongoose.Schema({
  match: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Match',
    required: true,
  },
  team: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Team',
    required: true,
  },
  player: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Player',
    required: true,
  },
  type: {
    type: String,
    required: true,
    enum: ['Goal', 'Yellow Card', 'Red Card', 'Foul', 'Self Goal'],
  },
  minute: {
    type: Number,
    required: true,
  },
}, { timestamps: true });

matchEventSchema.index({ match: 1 });

const MatchEvent = mongoose.model('MatchEvent', matchEventSchema);

module.exports = MatchEvent;
