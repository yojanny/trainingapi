'use strict';

require('dotenv').config();

const mysqlPool = require('./app/database/mysql-pool/mysql-pool.js');
const webServer = require('./app/webserver');

const port = process.env.PORT;

if (!port) {
  console.error('PORT must be defined as environment variable');
  process.exit(1);
}

process.on('unhandledRejection', (err) => {
  console.error(err);
});

async function initApp() {
  try {
    await mysqlPool.connect();
    await webServer.listen(port);

    console.log(`webserver listening at port ${port}`);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}

initApp();
