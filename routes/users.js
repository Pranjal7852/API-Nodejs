const {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
} = require('../controllers/users');
const { validate } = require('../middlewares/validate');
const { auth } = require('../middlewares/auth');
const {
  createUserSchema,
  updateUserSchema,
  deleteUserSchema,
} = require('../validations/user');
const { upload } = require('../middlewares/upload');

const router = require('express').Router();

router.get('/', getUsers);
router.post(
  '/',
  auth,
  upload.fields([{ name: 'logo', maxCount: 1 }]),
  validate(createUserSchema),
  createUser
);
router.put(
  '/:username',
  auth,
  upload.fields([{ name: 'logo', maxCount: 1 }]),
  validate(updateUserSchema),
  updateUser
);

router.delete('/:username', auth, validate(deleteUserSchema), deleteUser);

module.exports = router;
