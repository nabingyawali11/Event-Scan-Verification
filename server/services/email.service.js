const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

const sendTicketEmail = async ({ participant, event, qrDataUrl }) => {
  const base64Data = qrDataUrl.replace(/^data:image\/png;base64,/, '');
  const qrBuffer = Buffer.from(base64Data, 'base64');

  const fromAddress = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev';

  await resend.emails.send({
    from: `${event.name} <${fromAddress}>`,
    to: participant.email,
    subject: `Your Entry Ticket — ${event.name}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee; padding: 20px; border-radius: 10px;">
        <h2 style="color: #333;">Hello, ${participant.name}! 👋</h2>
        <p>You are registered for <strong>${event.name}</strong>.</p>
        <div style="background: #f9f9f9; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 5px 0;"><strong>Date:</strong> ${new Date(event.date).toDateString()}</p>
            <p style="margin: 5px 0;"><strong>Venue:</strong> ${event.venue}</p>
        </div>
        <hr style="border: 0; border-top: 1px solid #eee;"/>
        <p style="text-align: center;">Please show this QR code at the entry gate:</p>
        <div style="text-align: center; margin: 20px 0;">
            <img src="cid:qrcode" alt="Your QR Code" style="width:250px; height:250px; border: 1px solid #ccc; padding: 10px; background: white;"/>
        </div>
        <p style="color:#888; font-size:12px; text-align: center;">This QR code is unique to you and can only be used once.</p>
      </div>
    `,
    attachments: [{
      filename: 'ticket-qr.png',
      content: qrBuffer.toString('base64'),
      contentType: 'image/png',
      contentId: 'qrcode'
    }],
  });
};

module.exports = { sendTicketEmail };
