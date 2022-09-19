'use strict';

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mysqlPool = require('../../../database/mysql-pool/mysql-pool.js');
const { validateEmailPassword } = require('../../shared/validate-schemas.js');

const authJwtSecret = process.env.AUTH_JWT_SECRET;
const jwtExpiresIn = +process.env.JWT_EXPIRES_IN;

async function login(req, res, next) {
  const accountData = { ...req.body };

  try {
    await validateEmailPassword(accountData);
  } catch (e) {
    return res
      .status(400)
      .send([{ status: '400', message: e.details[0].message }]);
  }

  const sqlQuery = `SELECT id, email, password, role
    FROM users
    WHERE email = '${accountData.email}'`;

  let connection = null;

  try {
    connection = await mysqlPool.getConnection();
    const [rows] = await connection.query(sqlQuery);
    connection.release();

    if (rows.length !== 1) {
      return res.status(404).send({
        status: '404',
        message: "target resource doesn't exist",
      });
    }

    const user = rows[0];

    const isPasswordOk = await bcrypt.compare(
      accountData.password,
      user.password
    );

    if (isPasswordOk === false) {
      return res.status(401).send({
        status: '401',
        message: 'invalid authentication credentials for the target resource',
      });
    }

    const payloadJwt = {
      userId: user.id,
      role: user.role,
    };

    const token = jwt.sign(payloadJwt, authJwtSecret, {
      expiresIn: jwtExpiresIn,
    });

    const userSession = {
      accesToken: token,
      expiresIn: 3600,
    };

    res.status(200).send([
      {
        status: '200',
        message: 'user logged',
      },
      { ...userSession },
    ]);
  } catch (e) {
    if (connection !== null) {
      connection.release();
    }

    return res.status(500).send({ status: '500', message: e.message });
  }
}

module.exports = login;
