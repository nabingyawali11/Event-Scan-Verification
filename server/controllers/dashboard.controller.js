const Participant = require('../models/Participant');
const Event = require('../models/Event');

exports.getStats = async (req, res) => {
  try {
    const { eventId } = req.params;
    
    // Security check: Ensure the event belongs to the organizer
    const event = await Event.findOne({ _id: eventId, organizer: req.user.id });
    if (!event) return res.status(404).json({ message: 'Event not found' });

    const total      = await Participant.countDocuments({ event: eventId });
    const checkedIn  = await Participant.countDocuments({ event: eventId, checkedIn: true });
    const emailsSent = await Participant.countDocuments({ event: eventId, emailSent: true });

    res.json({ 
        total, 
        checkedIn, 
        notArrived: total - checkedIn, 
        emailsSent,
        eventName: event.name 
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
