'use strict';

const bcrypt = require('bcrypt');
const mysqlPool = require('../../../database/mysql-pool/mysql-pool');
const { validateEmailPassword } = require('../../shared/validate-schemas');

async function createAccount(req, res) {
  const accountData = { ...req.body };

  try {
    await validateEmailPassword(accountData);
  } catch (e) {
    return res
      .status(400)
      .send([{ status: '400', message: e.details[0].message }]);
  }

  const now = new Date();
  const createdAt = now.toISOString().replace('T', ' ').substring(0, 19);

  let connection = null;
  try {
    connection = await mysqlPool.getConnection();

    const securePassword = await bcrypt.hash(accountData.password, 10);

    const user = {
      email: accountData.email,
      password: securePassword,
      created_at: createdAt,
      role: 'admin',
      //role: 'member',
    };

    await connection.query('INSERT INTO users SET ?', user);
    connection.release();

    return res.status(201).send({ status: '201', message: 'account created' });
  } catch (e) {
    if (connection) {
      connection.release();
    }

    if (e.code === 'ER_DUP_ENTRY') {
      return res.status(409).send({ status: '409', message: e.message });
    }

    return res.status(500).send({ status: '500', message: e.message });
  }
}

module.exports = createAccount;
