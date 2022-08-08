'use strict';

const path = require('path');

//const cors = require('cors');

const express = require('express');

const accountRouter = require('.router/account-router');

//Aqui irian el resto de routers

const app = express();

//Linea para imagenes

app.use(express.json());

app.use((req, res, next) => {
    console.log('1.entrando request', req.url);
    next();
});

app.use((req,res,next) =>{
    console.log('2.continuando request', req.url);

    next();
});

app.use('/api', accountRouter);

app.use((req,res,next) =>{
    console.log('AQUI NO ETRA NUNCA', req.url);

    return res.status(404).send();
});

async function listen(port){
    const server = await app.listen(port);

    return server;
}

module.exports ={
    listen,
};
