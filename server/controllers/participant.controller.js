const Participant = require('../models/Participant');
const Event = require('../models/Event');
const { parseCSV } = require('../services/csv.service');
const { generateToken, generateQRCode } = require('../services/qr.service');
const { sendTicketEmail } = require('../services/email.service');
const { uploadQRCode } = require('../services/cloudinary.service');

exports.getParticipantsByEvent = async (req, res) => {
  try {
    const participants = await Participant.find({ event: req.params.eventId }).sort('-createdAt');
    res.json(participants);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.uploadCSV = async (req, res) => {
  try {
    const { eventId } = req.body;
    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ message: 'Event not found' });

    if (!req.file) return res.status(400).json({ message: 'Please upload a CSV file' });

    const rows = await parseCSV(req.file.path);
    const results = { success: 0, failed: 0, errors: [] };

    for (const row of rows) {
      try {
        const email = row['Email'] || row['email'] || row['Email Address'];
        const name = row['Name'] || row['name'] || row['Full Name'];
        const phone = row['Phone'] || row['phone'] || '';

        if (!email || !name) {
          throw new Error('Name or Email missing in row');
        }

        const token = generateToken();
        const qrBase64 = await generateQRCode(token);
        
        // Upload to Cloudinary
        const qrCloudinaryUrl = await uploadQRCode(qrBase64, `event_${eventId}`);

        const participant = await Participant.create({
          name,
          email,
          phone,
          event: eventId,
          token,
          qrImageUrl: qrCloudinaryUrl,
        });

        // Try to send email
        try {
          await sendTicketEmail({ participant, event, qrDataUrl: participant.qrImageUrl });
          await Participant.findByIdAndUpdate(participant._id, {
            emailSent: true, emailSentAt: new Date(),
          });
          results.success++;
        } catch (emailErr) {
          console.error(`Failed to send email to ${email}:`, emailErr.message);
          results.failed++;
          results.errors.push({ row, error: `Email error: ${emailErr.message}` });
        }
      } catch (err) {
        results.failed++;
        results.errors.push({ row, error: err.message });
      }
    }

    res.json({ message: 'Upload complete', results });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.resendEmail = async (req, res) => {
  try {
    const participant = await Participant.findById(req.params.id).populate('event');
    if (!participant) return res.status(404).json({ message: 'Participant not found' });

    let qrUrl = participant.qrImageUrl;

    // Handle legacy base64 data
    if (qrUrl && qrUrl.startsWith('data:image')) {
      qrUrl = await uploadQRCode(qrUrl, `event_${participant.event._id}`);
      await Participant.findByIdAndUpdate(req.params.id, { qrImageUrl: qrUrl });
    }

    await sendTicketEmail({ 
        participant, 
        event: participant.event, 
        qrDataUrl: qrUrl 
    });

    await Participant.findByIdAndUpdate(req.params.id, { 
        emailSent: true, 
        emailSentAt: new Date() 
    });

    res.json({ message: 'Email resent' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.bulkSendEmails = async (req, res) => {
  try {
    const { eventId } = req.params;
    const { force } = req.query; // Add force parameter to send to everyone
    
    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ message: 'Event not found' });

    // Build query: if force is true, get all. Otherwise, only get those not sent.
    const query = { event: eventId };
    if (force !== 'true') {
      query.emailSent = { $ne: true };
    }

    const participants = await Participant.find(query);

    if (participants.length === 0) {
      return res.json({ 
        message: force === 'true' ? 'No participants found to send to' : 'No pending emails to send', 
        count: 0 
      });
    }

    const results = { success: 0, failed: 0 };

    for (const participant of participants) {
      try {
        let qrUrl = participant.qrImageUrl;

        // If for some reason it's still base64 (legacy data), upload it now
        if (qrUrl && qrUrl.startsWith('data:image')) {
          qrUrl = await uploadQRCode(qrUrl, `event_${eventId}`);
          await Participant.findByIdAndUpdate(participant._id, { qrImageUrl: qrUrl });
        }

        await sendTicketEmail({ 
          participant, 
          event, 
          qrDataUrl: qrUrl 
        });

        await Participant.findByIdAndUpdate(participant._id, { 
          emailSent: true, 
          emailSentAt: new Date() 
        });
        results.success++;
      } catch (err) {
        console.error(`Bulk send failed for ${participant.email}:`, err.message);
        results.failed++;
      }
    }

    res.json({ 
      message: `Bulk sending complete: ${results.success} tickets sent, ${results.failed} failed.`, 
      results 
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


exports.deleteParticipant = async (req, res) => {

  try {
    await Participant.findByIdAndDelete(req.params.id);
    res.json({ message: 'Participant deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
