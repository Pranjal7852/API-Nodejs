const bcyrpt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../prisma/db');

/** @type {import('express').RequestHandler} */
exports.getAuthToken = async (req, res) => {
  try {
    const { username, password } = req.body;
    console.log(req.body);
    const user = await db.user.findUnique({ where: { username } });
    if (!user) {
      const error = new Error('Invalid credentials');
      error.status = 401;
      throw error;
    }
    const isMatch = await bcyrpt.compare(password, user.password);
    if (!isMatch) {
      const error = new Error('Invalid credentials');
      error.status = 401;
      throw error;
    }
    const token = jwt.sign(
      { username: user.username },
      process.env.JWT_SECRET,
      {
        expiresIn: '1h',
      }
    );
    return res.status(200).json({ token, user });
  } catch (error) {
    console.log(error);
    res
      .status(error.status || 500)
      .json({ error: { ...error, message: error.message } });
  }
};
