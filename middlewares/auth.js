const jwt = require('jsonwebtoken');
const db = require('../prisma/db');

/** @type {import("express").RequestHandler} */
exports.auth = async (req, res, next) => {
  try {
    const authorization = req.headers.authorization;
    const token = authorization.split(' ')[1];
    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await db.user.findUnique({
          where: {
            username: decoded.username,
          },
        });
        req.username = decoded.username;
        next();
      } catch (error) {
        res.status(401).json({
          message: 'Invalid token',
        });
      }
    } else {
      return res.status(401).json({
        message: 'No token provided',
      });
    }
  } catch (err) {
    return res.status(401).json({
      message: 'No token provided',
    });
  }
};
