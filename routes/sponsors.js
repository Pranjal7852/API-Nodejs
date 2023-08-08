const {
  getSponsors,
  createSponsors,
  updateSponsors,
  deleteSponsors,
} = require('../controllers/sponsors');
const { validate } = require('../middlewares/validate');
const { auth } = require('../middlewares/auth');
const {
  createSponsorSchema,
  updateSponsorSchema,
  deleteSponsorSchema,
} = require('../validations/sponsors');
const { upload } = require('../middlewares/upload');

const router = require('express').Router();

router.post(
  '/',
  auth,
  upload.fields([{ name: 'image', maxCount: 1 }]),
  validate(createSponsorSchema),
  createSponsors
);
router.put(
  '/:id',
  auth,
  upload.fields([{ name: 'image', maxCount: 1 }]),
  validate(updateSponsorSchema),
  updateSponsors
);

router.delete('/:id', auth, validate(deleteSponsorSchema), deleteSponsors);

router.get('/', getSponsors);

module.exports = router;
