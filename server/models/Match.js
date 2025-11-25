const mongoose = require('mongoose');

const matchSchema = new mongoose.Schema({
  day: {
    type: Number,
    required: true,
    enum: [1, 2], // Day 1 or Day 2
  },
  gender: {
    type: String,
    required: true,
    enum: ['Boys', 'Girls'],
  },
  category: {
    type: String,
    required: true,
  },
  teamA: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Team',
    required: true,
  },
  teamB: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Team',
    required: true,
  },
  matchTime: {
    type: Date,
    required: true,
  },
  groundNumber: {
    type: String,
    trim: true,
  },
  referee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Referee',
    required: true,
  },
  status: {
    type: String,
    required: true,
    enum: ['Upcoming', 'Live', 'Paused', 'Completed'],
    default: 'Upcoming',
  },
  scoreA: {
    type: Number,
    default: 0,
  },
  scoreB: {
    type: Number,
    default: 0,
  },
  timer: {
    startTime: { type: Date },
    pauseTime: { type: Date },
    totalPausedDuration: { type: Number, default: 0 }, // in milliseconds
  },
  matchRating: {
    type: Number,
    min: 1,
    max: 5,
  },
}, { timestamps: true });

const Match = mongoose.model('Match', matchSchema);

module.exports = Match;
