const { getGallery } = require('../controllers/gallery');

const router = require('express').Router();
// /gallery
router.get('/', getGallery);

module.exports = router;
