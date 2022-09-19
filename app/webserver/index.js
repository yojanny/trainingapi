'use strict';

const path = require('path');
const cors = require('cors');
const express = require('express');
const morgan = require('morgan');
const accountRouter = require('./routes/account-router');
const authRouter = require('./routes/auth-router');
const workoutRouter = require('./routes/workout-router');

const app = express();
app.use(cors());

app.use(express.static(path.join(process.cwd(), 'public')));

app.use(morgan('dev'));

app.use(express.json());

app.use('/api', accountRouter);
app.use('/api', authRouter);
app.use('/api', workoutRouter);

app.use((req, res) => {
  return res.status(404).send({
    status: 'error',
    message: 'not found',
  });
});

async function listen(port) {
  const server = await app.listen(port);

  return server;
}

module.exports = {
  listen,
};
