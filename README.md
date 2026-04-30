# 🎫 Event Verification Portal

A full-stack MERN application for event check-in via unique QR codes.

## Features
- Organizer Dashboard with analytics
- CSV Upload for bulk participant registration
- Automatic QR Code generation & Emailing (powered by Resend)
- Real-time QR Scanner for event check-in
- Multi-event support

## Setup Instructions

### 1. Prerequisites
- Node.js & npm
- MongoDB (Local or Atlas)
- Resend API Key (Sign up at [resend.com](https://resend.com))

### 2. Environment Variables
Create `.env` files in both `server/` and `client/` directories.

**server/.env**
```env
PORT=5000
MONGO_URI=your_mongodb_uri
CLIENT_URL=http://localhost:5173
JWT_SECRET=your_jwt_secret

# Email (Resend)
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxxxxx
RESEND_FROM_EMAIL=onboarding@resend.dev
```

**client/.env**
```env
VITE_API_URL=http://localhost:5000/api
```

### 3. Installation
```bash
# Install root dependencies
npm install

# Install backend dependencies
cd server
npm install

# Install frontend dependencies
cd ../client
npm install
```

### 4. Run Application
From the root directory:
```bash
npm run dev
```
This will start both the backend server (on port 5000) and the frontend (on port 5173).

## CSV Format
Your CSV should have at least the following headers:
- `Name` or `Full Name`
- `Email` or `Email Address`

## Troubleshooting
- **Camera Access**: The QR scanner requires HTTPS when deployed. On `localhost`, it works without HTTPS.
- **Email Errors**: Ensure your `RESEND_API_KEY` is valid. For local testing, use `onboarding@resend.dev` as the from address; it only sends to the email you signed up with on Resend.
- **CORS Errors**: Ensure `CLIENT_URL` in `server/.env` exactly matches your frontend URL.
