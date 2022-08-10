'use strict';

const jwt = require('jsonwebtoken');

const authJwtSecret = process.env.AUTH_JWT_SECRET;

async function checkAccountSession(req, res, next) {

    const authorization = req.headers.authorization;

    if (!authorization) {
        return res.status(401).send();
    }

    const [prefix, token] = authorization.split(' ');
    if (prefix !== 'Bearer' || !token) { // token === '' || token === undefined
        return res.status(401).send();
    }

    try {
        const payload = jwt.verify(token, authJwtSecret);

        console.log(`userId: ${payload.userId}`);
        console.log(`user role: ${payload.role}`);

        req.claims = {
            userId: payload.userId,
            role: payload.role || null,
        };

        return next();
    } catch (e) {
        console.error(e);
        return res.status(401).send();
    }
}

module.exports = checkAccountSession;