const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

const sendTicketEmail = async ({ participant, event, qrDataUrl }) => {
  const base64Data = qrDataUrl.replace(/^data:image\/png;base64,/, '');
  const qrBuffer = Buffer.from(base64Data, 'base64');

  const fromAddress = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev';

  await resend.emails.send({
    from: `${event.name} <${fromAddress}>`,
    to: participant.email,
    subject: `🎟️ Your Entry Ticket: ${event.name}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          .body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f7f9; margin: 0; padding: 40px 0; }
          .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.05); }
          .header { background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%); padding: 30px 20px; text-align: center; color: white; }
          .header h1 { margin: 0; font-size: 24px; font-weight: 700; letter-spacing: -0.5px; }
          .content { padding: 40px; color: #374151; line-height: 1.6; text-align: center; }
          .greeting { font-size: 22px; font-weight: 600; color: #111827; margin-bottom: 16px; }
          .qr-section { margin-top: 32px; padding-top: 32px; border-top: 1px solid #f3f4f6; }
          .qr-container { background: white; display: inline-block; padding: 20px; border: 1px solid #e5e7eb; border-radius: 16px; box-shadow: 0 4px 12px rgba(0,0,0,0.03); }
          .qr-image { width: 240px; height: 240px; display: block; }
          .footer { text-align: center; padding: 32px; font-size: 14px; color: #9ca3af; background-color: #f9fafb; }
          .important-note { font-size: 13px; color: #6b7280; margin-top: 20px; }
        </style>
      </head>
      <body>
        <div class="body">
          <div class="container">
            <div class="header">
              <h1>${event.name}</h1>
            </div>
            <div class="content">
              <div class="greeting">Hello, ${participant.name}! 👋</div>
              <p style="font-size: 16px;">Your entry ticket for <strong>${event.name}</strong> is ready.</p>
              
              <div class="qr-section">
                <div class="qr-container">
                  <img src="cid:qrcode" alt="QR Code" class="qr-image"/>
                </div>
                <p class="important-note">Please show this QR code at the entry gate.</p>
              </div>
            </div>
            <div class="footer">
              <p>&copy; ${new Date().getFullYear()} ${event.name}. All rights reserved.</p>
            </div>
          </div>
        </div>
      </body>
      </html>
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

