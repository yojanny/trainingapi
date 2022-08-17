'use strict';

const express = require('express');
const accountRouter = require('./routes/account-router');
const authRouter = require('./routes/auth-router');
const workoutRouter = require('./routes/workout-router');

const app = express();

app.use(express.json());

app.use((req,res,next) => {
    console.log('1.entrando request', req.url);

    next();
});

app.use((req,res,next) => {
    console.log('2.continuando request', req.url);

    next();
});

app.use('/api', accountRouter);
app.use('/api', authRouter);
app.use('/api', workoutRouter);


app.use((req,res,next) => {
    console.log('AQUÍ NO ENTRA NUNCA', req.url);

    return res.status(404).send();
});

async function listen(port){
    const server = await app.listen(port);

    return server;
}

module.exports = {
    listen,
};
