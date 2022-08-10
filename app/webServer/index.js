'use strict';

//modulo para que cambie el caracter de separacion de las rutas segun el sistema operativo
//const path = require('path');

//const cors = require('cors');

const express = require('express');

const app = express();

//const router = require('./router/accountRouter');
const router = require('./router/accountRouter');
const authRouter = require('./router/auth-router');
const workoutRouter = require('./router/workout-router');
/* 
Aqui irian el resto de routers
*/

//Aqui irian el resto de routers



/* Linea para imagenes */

app.use(express.json());

// app.use('/api', router);

app.use('/api', router);
app.use('/api', authRouter);
app.use('/api', workoutRouter);



async function listen(port){
const server = await app.listen(port);

return server;
}

module.exports = {
listen,
}; 
