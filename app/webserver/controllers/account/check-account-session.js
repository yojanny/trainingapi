'use strict';

const jwt = require('jsonwebtoken');

const authJwtSecret = process.env.AUTH_JWT_SECRET;

async function checkAccountSession(req, res, next) {
  const authorization = req.headers.authorization;

  if (!authorization) {
    return res.status(404).send([
      {
        status: '404',
        message: 'authorization not found',
      },
    ]);
  }

  const [prefix, token] = authorization.split(' ');
  if (prefix !== 'Bearer' || !token) {
    return res.status(401).send([
      {
        status: '401',
        message: 'invalid authentication credentials for the target resource',
      },
    ]);
  }

  try {
    const payload = jwt.verify(token, authJwtSecret);

    req.claims = {
      userId: payload.userId,
      role: payload.role,
    };

    return next();
  } catch (e) {
    return res.status(401).send([
      {
        status: '401',
        message: 'invalid authentication credentials for the target resource',
      },
    ]);
  }
}

module.exports = checkAccountSession;
