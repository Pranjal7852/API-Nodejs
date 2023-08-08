const db = require('../prisma/db');
const bcrypt = require('bcrypt');
const fs = require('fs/promises');
const { getStaticUrl, getRelativePath } = require('../helpers/string');

/** @type {import("express").RequestHandler} */
exports.getUsers = async (req, res) => {
  try {
    const users = await db.user.findMany({});
    res.json(users);
  } catch (error) {
    res
      .status(error.status || 500)
      .json({ error: { ...error, message: error.message } });
  }
};

/** @type {import("express").RequestHandler} */
exports.createUser = async (req, res) => {
  try {
    let { name, username, password, email, logo, website, description } =
      req.body;

    const logoPath = req.files.logo?.[0].path;
    if (req.files.logo) logo = getStaticUrl(logoPath);
    else logo = undefined;

    if (req.user.role !== 'ADMIN') {
      const error = new Error('You are not authorized to do this action');
      error.status = 401;
      throw error;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await db.user.create({
      data: {
        name,
        username,
        password: hashedPassword,
        email,
        logo,
        website,
        description,
      },
    });

    res.json(user);
  } catch (error) {
    console.log(error);
    const logoPath = req.files.logo?.[0].path;
    fs.unlink(logoPath)
      .then((val) => console.log(`Deleted File ${logoPath} ${val}`))
      .catch((err) => console.log(err));

    res
      .status(error.status || 500)
      .json({ error: { ...error, message: error.message } });
  }
};

/** @type {import("express").RequestHandler} */
exports.updateUser = async (req, res) => {
  try {
    const { username } = req.params;
    const existingUser = await db.user.findUnique({
      where: { username },
    });

    if (!existingUser) {
      const error = new Error('User not found');
      error.status = 404;
      throw error;
    }

    let { name, password, email, logo, website, description } = req.body;

    const logoPath = req.files.logo?.[0].path;

    if (req.user.username !== username && req.user.role !== 'ADMIN') {
      let error = new Error('You are not authorized to do this action');
      error.status = 401;
      throw error;
    }

    if (req.files.logo) {
      logo = getStaticUrl(logoPath);
      // remove old file
      fs.unlink(getRelativePath(existingUser.logo))
        .then(() => console.log('Deleted File ' + existingUser.logo))
        .catch((err) => console.log(err));
    } else logo = undefined;

    let hashedPassword;
    if (password) hashedPassword = await bcrypt.hash(password, 10);

    const user = await db.user.update({
      where: { username },
      data: {
        name,
        password: hashedPassword,
        email,
        logo,
        website,
        description,
      },
    });

    res.json(user);
  } catch (error) {
    console.log(error);
    const logoPath = req.files.logo?.[0].path;
    fs.unlink(logoPath)
      .then((val) => console.log(`Deleted File ${logoPath} ${val}`))
      .catch((err) => console.log(err));
    res
      .status(error.status || 500)
      .json({ error: { ...error, message: error.message } });
  }
};

/** @type {import("express").RequestHandler} */
exports.deleteUser = async (req, res) => {
  try {
    const { username } = req.params;
    const existingUser = await db.user.findUnique({
      where: { username },
    });

    if (!existingUser) {
      return res.status(404).json({
        error: 'User not found',
      });
    }

    if (req.user.username !== username && req.user.role !== 'ADMIN') {
      return res.status(401).json({
        error: 'You are not authorized to do this action',
      });
    }

    const user = await db.user.delete({
      where: { username },
    });

    console.log('Deleted User', existingUser);
    // remove old file
    fs.unlink(getRelativePath(existingUser.logo))
      .then(() => console.log('Deleted File ' + existingUser.logo))
      .catch((err) => console.log(err));

    res.json(user);
  } catch (error) {
    console.log(error);
    res
      .status(error.status || 500)
      .json({ error: { ...error, message: error.message } });
  }
};
