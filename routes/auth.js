const { getAuthToken } = require('../controllers/auth');
const { validate } = require('../middlewares/validate');
const { getAuthTokenSchema } = require('../validations/auth');

const router = require('express').Router();

router.post('/', validate(getAuthTokenSchema), getAuthToken);

module.exports = router;
