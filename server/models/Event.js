const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema({
  name:        { type: String, required: true },
  description: { type: String },
  date:        { type: Date, required: true },
  venue:       { type: String },
  organizer:   { type: mongoose.Schema.Types.ObjectId, ref: 'Organizer' },
  isActive:    { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('Event', EventSchema);
