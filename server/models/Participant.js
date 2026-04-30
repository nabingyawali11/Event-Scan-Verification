const mongoose = require('mongoose');

const ParticipantSchema = new mongoose.Schema({
  name:        { type: String, required: true },
  email:       { type: String, required: true },
  phone:       { type: String },
  extraFields: { type: Map, of: String },
  event:       { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
  token:       { type: String, unique: true },
  qrImageUrl:  { type: String },
  emailSent:   { type: Boolean, default: false },
  emailSentAt: { type: Date },
  checkedIn:   { type: Boolean, default: false },
  checkedInAt: { type: Date },
  checkedInBy: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Participant', ParticipantSchema);
