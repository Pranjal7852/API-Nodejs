const {
  getEvents,
  createEvent,
  updateEvent,
  deleteEvent,
} = require('../controllers/events');
const { auth } = require('../middlewares/auth');
const { upload } = require('../middlewares/upload');
const { validate } = require('../middlewares/validate');
const {
  createEventSchema,
  updateEventsSchema,
  deleteEventsSchema,
  getEventSchema,
} = require('../validations/event');

const router = require('express').Router();

router.get('/', validate(getEventSchema), getEvents);
router.post(
  '/',
  auth,
  upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'pdf', maxCount: 1 },
  ]),
  validate(createEventSchema),
  createEvent
);

router.put(
  '/:id',
  auth,
  upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'pdf', maxCount: 1 },
  ]),
  validate(updateEventsSchema),
  updateEvent
);

router.delete('/:id', auth, validate(deleteEventsSchema), deleteEvent);
module.exports = router;
