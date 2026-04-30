const Participant = require('../models/Participant');

exports.verifyToken = async (req, res) => {
  try {
    const { token } = req.params;
    const participant = await Participant.findOne({ token }).populate('event');

    if (!participant) {
      return res.status(404).json({ 
        valid: false, 
        message: '❌ Invalid QR Code. Not registered.' 
      });
    }

    if (participant.checkedIn) {
      return res.status(400).json({
        valid: false,
        message: `⚠️ Already checked in at ${new Date(participant.checkedInAt).toLocaleTimeString()}`,
        participant: { name: participant.name, email: participant.email },
      });
    }

    // Mark as checked in
    participant.checkedIn   = true;
    participant.checkedInAt = new Date();
    await participant.save();

    return res.json({
      valid:  true,
      message: '✅ Verified! Welcome.',
      participant: {
        name:  participant.name,
        email: participant.email,
        event: participant.event.name,
      },
    });
  } catch (err) {
    res.status(500).json({ valid: false, message: 'Server error' });
  }
};
