# 🎫 Event Verification Portal — Complete Build Guide

> A full-stack MERN application for event check-in via unique QR codes.  
> Stack: **MongoDB · Express.js · React · Node.js**

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Tech Stack & Libraries](#2-tech-stack--libraries)
3. [Complete File Structure](#3-complete-file-structure)
4. [Database Schema](#4-database-schema)
5. [Backend — Step-by-Step Setup](#5-backend--step-by-step-setup)
6. [Frontend — Step-by-Step Setup](#6-frontend--step-by-step-setup)
7. [Core Features — How to Build Each](#7-core-features--how-to-build-each)
8. [API Endpoints Reference](#8-api-endpoints-reference)
9. [Environment Variables](#9-environment-variables)
10. [Deployment Guide](#10-deployment-guide)
11. [Common Errors & Fixes](#11-common-errors--fixes)

---

## 1. Project Overview

### What This System Does

| Step | Who | Action |
|------|-----|--------|
| 1 | Organizer | Exports Google Form responses as CSV |
| 2 | Organizer | Uploads CSV to this portal |
| 3 | System | Parses CSV, saves participants to MongoDB |
| 4 | System | Generates a **unique QR code** per participant |
| 5 | System | Sends **customized email** with QR to each participant |
| 6 | Organizer | Scans QR at event entry using mobile/tablet |
| 7 | System | Verifies participant, marks as **checked-in** (one-time use) |
| 8 | Organizer | Views **live dashboard** with attendance stats |

---

## 2. Tech Stack & Libraries

### Backend (Node.js + Express)

```bash
npm install express mongoose dotenv cors helmet morgan
npm install multer csv-parser
npm install qrcode uuid
npm install nodemailer @sendgrid/mail
npm install jsonwebtoken bcryptjs
npm install express-rate-limit express-validator
npm install --save-dev nodemon
```

| Package | Purpose |
|---------|---------|
| `express` | Web server & routing |
| `mongoose` | MongoDB ODM |
| `multer` | Handle CSV file uploads |
| `csv-parser` | Parse CSV files row by row (streaming) |
| `qrcode` | Generate QR code as PNG buffer or Data URL |
| `uuid` | Generate unique tokens (v4) |
| `nodemailer` | Send emails via SMTP |
| `@sendgrid/mail` | Alternative — SendGrid email API (more reliable) |
| `jsonwebtoken` | JWT auth for organizer login |
| `bcryptjs` | Hash organizer passwords |
| `helmet` | Secure HTTP headers |
| `morgan` | HTTP request logging |
| `express-rate-limit` | Prevent scanner endpoint abuse |
| `express-validator` | Input validation |

### Frontend (React + Vite)

```bash
npm create vite@latest client -- --template react
cd client
npm install axios react-router-dom
npm install html5-qrcode
npm install react-dropzone
npm install react-hot-toast
npm install @tanstack/react-query
npm install recharts
npm install react-hook-form
```

| Package | Purpose |
|---------|---------|
| `axios` | HTTP requests to backend |
| `react-router-dom` | Page routing |
| `html5-qrcode` | QR code scanner (uses device camera) |
| `react-dropzone` | Drag-and-drop CSV upload |
| `react-hot-toast` | Success/error notifications |
| `@tanstack/react-query` | Server state management & caching |
| `recharts` | Charts for dashboard |
| `react-hook-form` | Form handling for organizer login |

---

## 3. Complete File Structure

```
event-verification-portal/
│
├── server/                          # Backend (Node.js + Express)
│   ├── .env                         # Environment variables (never commit!)
│   ├── .env.example                 # Template for env vars
│   ├── package.json
│   ├── server.js                    # Entry point
│   │
│   ├── config/
│   │   ├── db.js                    # MongoDB connection
│   │   └── mailer.js                # Nodemailer / SendGrid setup
│   │
│   ├── models/
│   │   ├── Event.js                 # Event schema
│   │   ├── Participant.js           # Participant + QR schema
│   │   └── Organizer.js             # Organizer auth schema
│   │
│   ├── routes/
│   │   ├── auth.routes.js           # POST /login, POST /register
│   │   ├── event.routes.js          # CRUD for events
│   │   ├── participant.routes.js    # Upload CSV, list, resend email
│   │   ├── verify.routes.js         # GET /verify/:token (QR scan)
│   │   └── dashboard.routes.js      # Stats & analytics
│   │
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   ├── event.controller.js
│   │   ├── participant.controller.js
│   │   ├── verify.controller.js
│   │   └── dashboard.controller.js
│   │
│   ├── middleware/
│   │   ├── auth.middleware.js       # JWT verification
│   │   ├── upload.middleware.js     # Multer config for CSV
│   │   └── rateLimit.middleware.js  # Limit scan attempts
│   │
│   ├── services/
│   │   ├── csv.service.js           # Parse & validate CSV rows
│   │   ├── qr.service.js            # Generate QR code images
│   │   └── email.service.js         # Build & send emails
│   │
│   └── utils/
│       ├── generateToken.js         # UUID token generator
│       └── apiResponse.js           # Standardized API responses
│
├── client/                          # Frontend (React + Vite)
│   ├── .env                         # VITE_API_URL=http://localhost:5000
│   ├── package.json
│   ├── vite.config.js
│   ├── index.html
│   │
│   └── src/
│       ├── main.jsx                 # App entry point
│       ├── App.jsx                  # Router setup
│       │
│       ├── api/
│       │   └── axios.js             # Axios instance with base URL + auth header
│       │
│       ├── context/
│       │   └── AuthContext.jsx      # Organizer login state
│       │
│       ├── hooks/
│       │   ├── useParticipants.js   # React Query hooks
│       │   └── useDashboard.js
│       │
│       ├── pages/
│       │   ├── Login.jsx            # Organizer login page
│       │   ├── Dashboard.jsx        # Stats overview
│       │   ├── Events.jsx           # Event list + create
│       │   ├── EventDetail.jsx      # Single event view
│       │   ├── Upload.jsx           # CSV upload page
│       │   ├── Participants.jsx     # Participant table
│       │   └── Scanner.jsx          # QR scanner (mobile-friendly)
│       │
│       ├── components/
│       │   ├── layout/
│       │   │   ├── Navbar.jsx
│       │   │   └── Sidebar.jsx
│       │   ├── upload/
│       │   │   ├── CsvDropzone.jsx  # Drag-drop upload
│       │   │   └── ColumnMapper.jsx # Map CSV columns to fields
│       │   ├── participants/
│       │   │   ├── ParticipantTable.jsx
│       │   │   └── ParticipantRow.jsx
│       │   ├── scanner/
│       │   │   ├── QrReader.jsx     # Camera scanner component
│       │   │   └── ScanResult.jsx   # Green/red result display
│       │   └── dashboard/
│       │       ├── StatsCard.jsx
│       │       └── AttendanceChart.jsx
│       │
│       └── utils/
│           └── formatDate.js
│
├── .gitignore
└── README.md
```

---

## 4. Database Schema

### Organizer Model (`models/Organizer.js`)

```js
const OrganizerSchema = new mongoose.Schema({
  name:         { type: String, required: true },
  email:        { type: String, required: true, unique: true },
  password:     { type: String, required: true },   // bcrypt hashed
  organization: { type: String },
}, { timestamps: true });
```

### Event Model (`models/Event.js`)

```js
const EventSchema = new mongoose.Schema({
  name:        { type: String, required: true },
  description: { type: String },
  date:        { type: Date, required: true },
  venue:       { type: String },
  organizer:   { type: mongoose.Schema.Types.ObjectId, ref: 'Organizer' },
  isActive:    { type: Boolean, default: true },
}, { timestamps: true });
```

### Participant Model (`models/Participant.js`)

```js
const ParticipantSchema = new mongoose.Schema({
  // From CSV
  name:        { type: String, required: true },
  email:       { type: String, required: true },
  phone:       { type: String },
  extraFields: { type: Map, of: String },   // Any extra CSV columns stored here

  // Linked event
  event:       { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },

  // QR verification
  token:       { type: String, unique: true },   // UUID v4
  qrImageUrl:  { type: String },                 // Path or base64

  // Email status
  emailSent:   { type: Boolean, default: false },
  emailSentAt: { type: Date },

  // Check-in status
  checkedIn:   { type: Boolean, default: false },
  checkedInAt: { type: Date },
  checkedInBy: { type: String },   // Device/organizer ID

}, { timestamps: true });
```

> **Key design decision:** The `token` field is what's encoded inside the QR code — NOT the participant's `_id`. This adds a layer of security and makes tokens easy to revoke and regenerate.

---

## 5. Backend — Step-by-Step Setup

### Step 1: Initialize & Connect MongoDB

**`server/config/db.js`**
```js
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected');
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
```

**`server/server.js`**
```js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const connectDB = require('./config/db');

const app = express();
connectDB();

app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_URL }));
app.use(express.json());
app.use(morgan('dev'));

// Routes
app.use('/api/auth',         require('./routes/auth.routes'));
app.use('/api/events',       require('./routes/event.routes'));
app.use('/api/participants', require('./routes/participant.routes'));
app.use('/api/verify',       require('./routes/verify.routes'));
app.use('/api/dashboard',    require('./routes/dashboard.routes'));

app.listen(process.env.PORT || 5000, () => {
  console.log(`Server running on port ${process.env.PORT || 5000}`);
});
```

---

### Step 2: CSV Upload & Parsing

**`server/middleware/upload.middleware.js`**
```js
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename:    (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});

const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  if (ext !== '.csv') return cb(new Error('Only CSV files allowed'), false);
  cb(null, true);
};

module.exports = multer({ storage, fileFilter, limits: { fileSize: 5 * 1024 * 1024 } });
```

**`server/services/csv.service.js`**
```js
const fs = require('fs');
const csv = require('csv-parser');

const parseCSV = (filePath) => {
  return new Promise((resolve, reject) => {
    const results = [];
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (row) => results.push(row))
      .on('end', () => {
        fs.unlinkSync(filePath);   // Delete temp file after parsing
        resolve(results);
      })
      .on('error', reject);
  });
};

module.exports = { parseCSV };
```

---

### Step 3: QR Code Generation

**`server/services/qr.service.js`**
```js
const QRCode = require('qrcode');
const { v4: uuidv4 } = require('uuid');

// Generate a unique token
const generateToken = () => uuidv4();

// Generate QR as base64 PNG (can be embedded in email)
const generateQRCode = async (token) => {
  const url = `${process.env.CLIENT_URL}/verify/${token}`;
  const qrDataUrl = await QRCode.toDataURL(url, {
    errorCorrectionLevel: 'H',
    width: 300,
    margin: 2,
  });
  return qrDataUrl;   // Returns: "data:image/png;base64,..."
};

module.exports = { generateToken, generateQRCode };
```

> **Important:** The QR code encodes a URL pointing to your scanner page. When the organizer scans it, the browser opens that URL, and your backend verifies the token.

---

### Step 4: Email Service

**`server/services/email.service.js`**
```js
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const sendTicketEmail = async ({ participant, event, qrDataUrl }) => {
  // Convert base64 Data URL to buffer for inline attachment
  const base64Data = qrDataUrl.replace(/^data:image\/png;base64,/, '');
  const qrBuffer = Buffer.from(base64Data, 'base64');

  const mailOptions = {
    from:    `"${event.name}" <${process.env.SMTP_USER}>`,
    to:      participant.email,
    subject: `Your Entry Ticket — ${event.name}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Hello, ${participant.name}! 👋</h2>
        <p>You are registered for <strong>${event.name}</strong>.</p>
        <p><strong>Date:</strong> ${new Date(event.date).toDateString()}</p>
        <p><strong>Venue:</strong> ${event.venue}</p>
        <hr/>
        <p>Please show this QR code at the entry gate:</p>
        <img src="cid:qrcode" alt="Your QR Code" style="width:250px; height:250px;"/>
        <p style="color:#888; font-size:12px;">This QR code is unique to you and can only be used once.</p>
      </div>
    `,
    attachments: [{
      filename: 'ticket-qr.png',
      content:  qrBuffer,
      cid:      'qrcode',   // Referenced as src="cid:qrcode" in HTML above
    }],
  };

  await transporter.sendMail(mailOptions);
};

module.exports = { sendTicketEmail };
```

---

### Step 5: Participant Controller (Upload Flow)

**`server/controllers/participant.controller.js`** — core upload handler:
```js
const { parseCSV } = require('../services/csv.service');
const { generateToken, generateQRCode } = require('../services/qr.service');
const { sendTicketEmail } = require('../services/email.service');
const Participant = require('../models/Participant');
const Event = require('../models/Event');

exports.uploadCSV = async (req, res) => {
  try {
    const { eventId } = req.body;
    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ message: 'Event not found' });

    const rows = await parseCSV(req.file.path);
    const results = { success: 0, failed: 0, errors: [] };

    for (const row of rows) {
      try {
        const token = generateToken();
        const qrDataUrl = await generateQRCode(token);

        const participant = await Participant.create({
          name:  row['Name'] || row['name'] || row['Full Name'],
          email: row['Email'] || row['email'] || row['Email Address'],
          phone: row['Phone'] || row['phone'] || '',
          event: eventId,
          token,
          qrImageUrl: qrDataUrl,
        });

        await sendTicketEmail({ participant, event, qrDataUrl });

        await Participant.findByIdAndUpdate(participant._id, {
          emailSent: true, emailSentAt: new Date(),
        });

        results.success++;
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
```

---

### Step 6: Verification Endpoint (QR Scan)

**`server/controllers/verify.controller.js`**
```js
const Participant = require('../models/Participant');
const rateLimit = require('express-rate-limit');

exports.verifyToken = async (req, res) => {
  try {
    const { token } = req.params;
    const participant = await Participant.findOne({ token }).populate('event');

    if (!participant) {
      return res.status(404).json({ valid: false, message: '❌ Invalid QR Code. Not registered.' });
    }

    if (participant.checkedIn) {
      return res.status(400).json({
        valid: false,
        message: `⚠️ Already checked in at ${participant.checkedInAt.toLocaleTimeString()}`,
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
```

**Route with rate limiting:**
```js
// routes/verify.routes.js
const router = require('express').Router();
const { verifyToken } = require('../controllers/verify.controller');
const rateLimit = require('express-rate-limit');

const scanLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,   // 1 minute
  max: 60,                    // 60 scans per minute per IP
  message: 'Too many scan attempts',
});

router.get('/:token', scanLimiter, verifyToken);

module.exports = router;
```

---

## 6. Frontend — Step-by-Step Setup

### Axios Instance

**`client/src/api/axios.js`**
```js
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
```

---

### CSV Upload Component

**`client/src/components/upload/CsvDropzone.jsx`**
```jsx
import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import api from '../../api/axios';
import toast from 'react-hot-toast';

export default function CsvDropzone({ eventId, onSuccess }) {
  const [uploading, setUploading] = useState(false);

  const onDrop = useCallback(async (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('csv', file);
    formData.append('eventId', eventId);

    setUploading(true);
    try {
      const { data } = await api.post('/participants/upload', formData);
      toast.success(`Done! ${data.results.success} emails sent.`);
      onSuccess?.(data.results);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  }, [eventId]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'text/csv': ['.csv'] },
    maxFiles: 1,
  });

  return (
    <div {...getRootProps()} style={{
      border: '2px dashed #ccc', borderRadius: 8,
      padding: 40, textAlign: 'center', cursor: 'pointer',
      background: isDragActive ? '#f0f4ff' : 'white',
    }}>
      <input {...getInputProps()} />
      {uploading
        ? <p>Uploading & sending emails...</p>
        : isDragActive
          ? <p>Drop the CSV here...</p>
          : <p>Drag & drop CSV here, or click to select</p>
      }
    </div>
  );
}
```

---

### QR Scanner Component

**`client/src/components/scanner/QrReader.jsx`**
```jsx
import { useEffect, useRef, useState } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import api from '../../api/axios';

export default function QrReader() {
  const [result, setResult] = useState(null);
  const scannerRef = useRef(null);

  useEffect(() => {
    const scanner = new Html5QrcodeScanner('qr-reader', {
      fps: 10,
      qrbox: { width: 250, height: 250 },
    });

    scanner.render(
      async (decodedText) => {
        // Extract token from URL
        const token = decodedText.split('/').pop();
        try {
          const { data } = await api.get(`/verify/${token}`);
          setResult({ ...data, type: data.valid ? 'success' : 'warning' });
        } catch (err) {
          setResult({
            type:    'error',
            message: err.response?.data?.message || 'Scan failed',
          });
        }
      },
      (error) => console.warn(error)
    );

    scannerRef.current = scanner;
    return () => scanner.clear().catch(() => {});
  }, []);

  const colors = { success: '#16a34a', warning: '#d97706', error: '#dc2626' };

  return (
    <div>
      <div id="qr-reader" style={{ width: '100%' }} />
      {result && (
        <div style={{
          marginTop: 16, padding: 20, borderRadius: 8,
          background: colors[result.type], color: 'white',
          fontSize: 20, fontWeight: 600, textAlign: 'center',
        }}>
          {result.message}
          {result.participant && (
            <p style={{ fontSize: 14, fontWeight: 400, marginTop: 8 }}>
              {result.participant.name} — {result.participant.email}
            </p>
          )}
          <button onClick={() => setResult(null)} style={{
            marginTop: 12, padding: '8px 20px', borderRadius: 6,
            border: 'none', background: 'white', color: colors[result.type],
            cursor: 'pointer', fontWeight: 600,
          }}>
            Scan Next
          </button>
        </div>
      )}
    </div>
  );
}
```

---

## 7. Core Features — How to Build Each

### Feature 1: Multi-Event Support

Each CSV upload is linked to an `eventId`. Create events first, then upload participants to that event. The organizer dashboard can filter by event.

### Feature 2: Resend Email

Add a `POST /participants/:id/resend` endpoint that regenerates the QR (optional) and resends the email. Useful if someone didn't receive it.

```js
exports.resendEmail = async (req, res) => {
  const participant = await Participant.findById(req.params.id).populate('event');
  await sendTicketEmail({ participant, event: participant.event, qrDataUrl: participant.qrImageUrl });
  await Participant.findByIdAndUpdate(req.params.id, { emailSent: true, emailSentAt: new Date() });
  res.json({ message: 'Email resent' });
};
```

### Feature 3: Live Dashboard Stats

**`GET /api/dashboard/:eventId`**
```js
exports.getStats = async (req, res) => {
  const { eventId } = req.params;
  const total      = await Participant.countDocuments({ event: eventId });
  const checkedIn  = await Participant.countDocuments({ event: eventId, checkedIn: true });
  const emailsSent = await Participant.countDocuments({ event: eventId, emailSent: true });

  res.json({ total, checkedIn, notArrived: total - checkedIn, emailsSent });
};
```

### Feature 4: Bulk Email with Queue (Production)

For large events (1000+ participants), sending emails in a for-loop will time out. Use a job queue:

```bash
npm install bull redis
```

```js
// services/emailQueue.js
const Queue = require('bull');
const emailQueue = new Queue('emails', { redis: process.env.REDIS_URL });

emailQueue.process(async (job) => {
  const { participant, event, qrDataUrl } = job.data;
  await sendTicketEmail({ participant, event, qrDataUrl });
});

// In controller, replace direct email call with:
await emailQueue.add({ participant, event, qrDataUrl });
```

### Feature 5: Export Attendance Report

```js
// GET /api/participants/export/:eventId
const { Parser } = require('json2csv');

exports.exportCSV = async (req, res) => {
  const participants = await Participant.find({ event: req.params.eventId });
  const fields = ['name', 'email', 'phone', 'checkedIn', 'checkedInAt', 'emailSent'];
  const parser = new Parser({ fields });
  const csv = parser.parse(participants);

  res.header('Content-Type', 'text/csv');
  res.attachment(`attendance-${req.params.eventId}.csv`);
  res.send(csv);
};
```

---

## 8. API Endpoints Reference

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | No | Register organizer |
| POST | `/api/auth/login` | No | Login, get JWT |
| GET | `/api/events` | Yes | List all events |
| POST | `/api/events` | Yes | Create event |
| DELETE | `/api/events/:id` | Yes | Delete event |
| POST | `/api/participants/upload` | Yes | Upload CSV for event |
| GET | `/api/participants/:eventId` | Yes | List participants |
| POST | `/api/participants/:id/resend` | Yes | Resend ticket email |
| GET | `/api/verify/:token` | No | Verify QR token (scan) |
| GET | `/api/dashboard/:eventId` | Yes | Live stats |
| GET | `/api/participants/export/:eventId` | Yes | Download attendance CSV |

---

## 9. Environment Variables

**`server/.env`**
```env
# Server
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173

# MongoDB
MONGO_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/event-portal

# JWT
JWT_SECRET=your_super_secret_key_here
JWT_EXPIRES_IN=7d

# Email (SMTP — e.g. Gmail or any SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_USER=youremail@gmail.com
SMTP_PASS=your_app_password_here

# Optional: Redis for email queue (production)
REDIS_URL=redis://localhost:6379
```

> **Gmail tip:** Enable 2FA on your Google account and generate an **App Password** at myaccount.google.com/apppasswords. Use that as `SMTP_PASS`.

**`client/.env`**
```env
VITE_API_URL=http://localhost:5000/api
```

---

## 10. Deployment Guide

### Option A: Free / Low Cost

| Service | What to deploy |
|---------|---------------|
| **Railway** or **Render** | Backend (Node.js) |
| **MongoDB Atlas** (free tier) | Database |
| **Vercel** or **Netlify** | Frontend (React) |
| **Brevo** (formerly Sendinblue) | 300 free emails/day |

### Option B: Production (VPS)

```bash
# On Ubuntu VPS (e.g. DigitalOcean Droplet)
npm install -g pm2
pm2 start server.js --name event-portal
pm2 startup    # Auto-restart on reboot
pm2 save

# Nginx as reverse proxy
# Point domain to VPS IP, use Certbot for HTTPS
```

### Build Frontend for Production

```bash
cd client
npm run build          # Creates /dist folder
# Deploy /dist to Vercel or Netlify
```

---

## 11. Common Errors & Fixes

| Error | Cause | Fix |
|-------|-------|-----|
| `ECONNREFUSED` on MongoDB | Wrong URI or IP not whitelisted | Add `0.0.0.0/0` in MongoDB Atlas Network Access |
| Emails going to spam | No SPF/DKIM records | Use SendGrid or Brevo with domain verification |
| QR scanner not working | HTTPS required for camera | Deploy to HTTPS or test on `localhost` only |
| CSV columns not mapping | Column headers differ from expected | Add flexible column mapping in `csv.service.js` |
| Timeout on large CSV | Sending emails synchronously | Use Bull queue (see Feature 4 above) |
| CORS error on frontend | `CLIENT_URL` mismatch | Match exact origin in `cors({ origin })` |

---

## Quick Start Commands

```bash
# Clone and set up
git clone <your-repo>

# Backend
cd server
npm install
cp .env.example .env   # Fill in your values
mkdir uploads          # Multer needs this folder
npm run dev            # Uses nodemon

# Frontend (new terminal)
cd client
npm install
npm run dev            # Vite dev server on :5173
```

---

*Built with MERN Stack · Made for event organizers who mean business* 🎫
