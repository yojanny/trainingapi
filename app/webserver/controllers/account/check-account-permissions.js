'use strict';

async function checkAccountPermissions(req, res, next) {
  const role = req.claims.role;

  if (role !== 'admin') {
    return res.status(403).send({
      status: '403',
      message: 'permissions required',
    });
  }

  next();
}

module.exports = checkAccountPermissions;
