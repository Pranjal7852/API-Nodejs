const fs = require('fs/promises');
const path = require('path');
const { CONFIG } = require('../config/config');

/** @type {import("express").RequestHandler} */
exports.getGallery = async (req, res) => {
  const GALLERY_FOLDER = path.join(CONFIG.staticDirectory, 'images', 'gallery');
  const PUBLIC_URL = 'https://api.hillfairnith.com/images/gallery/'; // change urls accordingly
  try {
    const data = [];
    const galleries = await fs.readdir(GALLERY_FOLDER);
    for (const folder of galleries) {
      const galleryPath = path.join(GALLERY_FOLDER, folder);
      const files = await fs.readdir(galleryPath);
      const urls = files.map((file) => `${PUBLIC_URL}${folder}/${file}`);
      data.push({ folder, files, urls });
    }
    res.json(data);
  } catch (error) {
    console.log('controllers/gallery : ', error);
    res.status(500).json({ error: { message: 'Something went Wrong' } });
  }
};
