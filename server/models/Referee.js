const mongoose = require('mongoose');

const refereeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  supabaseUserId: {
    type: String, // This will store the UUID from Supabase auth
    required: true,
    unique: true,
  },
  categoryExpertise: [{
    type: String,
    enum: [
      'U6', 'U7', 'U8', 'U10', 'U12', 'U14', 'U17'
    ],
  }],
}, { timestamps: true });

const Referee = mongoose.model('Referee', refereeSchema);

module.exports = Referee;
