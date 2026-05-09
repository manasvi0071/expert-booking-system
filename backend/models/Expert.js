const mongoose = require('mongoose');

const expertSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true },
  experience: { type: Number, required: true },
  rating: { type: Number, default: 4.5 },
  bio: { type: String },
  availableSlots: [{
    date: { type: String, required: true },
    slots: [{ type: String }]
  }]
}, { timestamps: true });

module.exports = mongoose.model('Expert', expertSchema);