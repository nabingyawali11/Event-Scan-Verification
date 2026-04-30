const router = require('express').Router();
const { getEvents, getEvent, createEvent, updateEvent, deleteEvent } = require('../controllers/event.controller');
const { protect } = require('../middleware/auth.middleware');

router.use(protect);

router.route('/')
  .get(getEvents)
  .post(createEvent);

router.route('/:id')
  .get(getEvent)
  .put(updateEvent)
  .delete(deleteEvent);

module.exports = router;
