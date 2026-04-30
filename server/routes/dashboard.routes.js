const router = require('express').Router();
const { getStats } = require('../controllers/dashboard.controller');
const { protect } = require('../middleware/auth.middleware');

router.get('/:eventId', protect, getStats);

module.exports = router;
