const multer = require('multer');
const path = require('path');
const { CONFIG } = require('../config/config');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(CONFIG.uploadsDirectory));
  },
  filename: function (req, file, cb) {
    const name = `${file.fieldname}-${req.user?.username}-${
      req.body.name
    }--${Date.now()}${path.extname(file.originalname)}`;
    cb(null, name);
    console.log(`Created File: ${CONFIG.uploadsDirectory}/${name}`);
  },
});

exports.upload = multer({ storage: storage });
