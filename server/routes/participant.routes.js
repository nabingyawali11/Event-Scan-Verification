const router = require('express').Router();
const { 
    getParticipantsByEvent, 
    uploadCSV, 
    resendEmail, 
    deleteParticipant 
} = require('../controllers/participant.controller');
const { protect } = require('../middleware/auth.middleware');
const upload = require('../middleware/upload.middleware');

router.get('/:eventId', protect, getParticipantsByEvent);
router.post('/upload', protect, upload.single('csv'), uploadCSV);
router.post('/:id/resend', protect, resendEmail);
router.delete('/:id', protect, deleteParticipant);

module.exports = router;
