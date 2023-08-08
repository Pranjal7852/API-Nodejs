const db = require('../prisma/db');
const fs = require('fs/promises');
const { getStaticUrl, getRelativePath } = require('../helpers/string');

/** @type {import("express").RequestHandler} */
exports.getSponsors = async (req, res) => {
  try {
    const sponsors = await db.sponsor.findMany({});
    res.json(sponsors);
  } catch (error) {
    res
      .status(error.status || 500)
      .json({ error: { ...error, message: error.message } });
  }
};

/** @type {import("express").RequestHandler} */
exports.createSponsors = async (req, res) => {
  try {
    let { id, name, image, description, website, level } = req.body;

    level = level ? parseInt(level) : undefined;

    const imagePath = req.files.image?.[0].path;
    if (imagePath) image = getStaticUrl(imagePath);
    else image = undefined;

    if (!(req.user.role == 'ADMIN' || req.username == 'finance')) {
      const error = new Error('You are not authorized to do this action');
      error.status = 401;
      throw error;
    }

    const sponsor = await db.sponsor.create({
      data: {
        id,
        name,
        image,
        website,
        description,
        level,
      },
    });

    res.json(sponsor);
  } catch (error) {
    console.log(error);
    const imagePath = req.files.image?.[0]?.path;
    if (imagePath)
      fs.unlink(imagePath)
        .then((val) => console.log(`Deleted File ${imagePath} ${val}`))
        .catch((err) => console.log(err));
    res
      .status(error.status || 500)
      .json({ error: { ...error, message: error.message } });
  }
};

/** @type {import("express").RequestHandler} */
exports.updateSponsors = async (req, res) => {
  try {
    let { id } = req.params;
    id = parseInt(id);
    const existingSponsor = await db.sponsor.findUnique({
      where: { id },
    });

    if (!existingSponsor) {
      const error = new Error('Sponsor not found');
      error.status = 404;
      throw error;
    }
    if (!(req.user.role == 'ADMIN' || req.username == 'finance')) {
      let error = new Error('You are not authorized to do this action');
      error.status = 401;
      throw error;
    }

    let { name, image, description, website, level } = req.body;
    level = level ? parseInt(level) : undefined;

    const imagePath = req.files.image?.[0]?.path;

    if (imagePath) {
      image = getStaticUrl(imagePath);
      // remove old file
      fs.unlink(getRelativePath(existingSponsor.image))
        .then(() => console.log('Deleted File ' + existingSponsor.image))
        .catch((err) => console.log(err));
    } else image = undefined;

    const sponsor = await db.sponsor.update({
      where: { id },
      data: {
        id: parseInt(id),
        name,
        image,
        website,
        description,
        level,
      },
    });

    res.json(sponsor);
  } catch (error) {
    console.log(error);
    const imagePath = req.files.image?.[0].path;
    fs.unlink(imagePath)
      .then((val) => console.log(`Deleted File ${imagePath} ${val}`))
      .catch((err) => console.log(err));
    res
      .status(error.status || 500)
      .json({ error: { ...error, message: error.message } });
  }
};

/** @type {import("express").RequestHandler} */
exports.deleteSponsors = async (req, res) => {
  try {
    let { id } = req.params;
    id = parseInt(id);
    const existingSponsor = await db.sponsor.findUnique({
      where: { id },
    });

    if (!existingSponsor) {
      return res.status(404).json({
        error: 'Sponsor not found',
      });
    }
    if (!(req.user.role == 'ADMIN' || req.username == 'finance')) {
      return res.status(401).json({
        error: { message: 'You are not authorized to do this action' },
      });
    }

    const sponsor = await db.sponsor.delete({
      where: { id },
    });

    console.log('Deleted Sponsor', existingSponsor);
    // remove old file
    fs.unlink(getRelativePath(existingSponsor.image))
      .then(() => console.log('Deleted File ' + existingSponsor.image))
      .catch((err) => console.log(err));

    res.json(sponsor);
  } catch (error) {
    console.log(error);
    res
      .status(error.status || 500)
      .json({ error: { ...error, message: error.message } });
  }
};
