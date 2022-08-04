'use strict';

require('dotenv').config();

//conectarse a mysql
const mysqlPool = require('./app/database/mysql-pool');

//Inicializando el servidor web
const webServer = require('./app/webServer');

//guardamos el valor de la variable de entorno PORT que tenemos valorada que tenemos valorado en el archivo .env
const port = process.env.PORT;

//Comprobar que la variable PORT tenga valor (que este en el .env) sino imprimir error
if (!port){
    console.error('PORT must be defined as environment variable');
    process.exit(1);
}

//Cuando hagamos peticion desde el postman, comprobar que salta el error
process.on('unhandledRejection',
(err) =>{
    console.error(err);
});


async function initApp(){
    try{
        await mysqlPool.connect();
        await webServer.listen(port);

        console.log(`webserver listen at port ${port}`);
    }catch (e){
        console.error(e);
        process.exit(1);
    }
}

initApp();