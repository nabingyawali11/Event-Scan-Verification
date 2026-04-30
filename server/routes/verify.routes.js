const router = require('express').Router();
const { verifyToken } = require('../controllers/verify.controller');
const rateLimit = require('express-rate-limit');

const scanLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,   // 1 minute
  max: 60,                    // 60 scans per minute per IP
  message: { valid: false, message: 'Too many scan attempts' },
});

router.get('/:token', scanLimiter, verifyToken);

module.exports = router;
