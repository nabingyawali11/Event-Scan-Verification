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
const authRoutes = require('./routes/auth.routes');
const eventRoutes = require('./routes/event.routes');
const participantRoutes = require('./routes/participant.routes');
const verifyRoutes = require('./routes/verify.routes');
const dashboardRoutes = require('./routes/dashboard.routes');

app.use('/api/auth',         authRoutes);
app.use('/api/events',       eventRoutes);
app.use('/api/participants', participantRoutes);
app.use('/api/verify',       verifyRoutes);
app.use('/api/dashboard',    dashboardRoutes);

// Health check
app.get('/health', (req, res) => res.json({ status: 'ok' }));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
