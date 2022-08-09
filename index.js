'use strict';

require('dotenv').config();

//Conectarse a mysql
const mysqlPool = require('./app/database/mysql-pool/mysql-pool.js');
//Inicializar el servidor web
const webServer = require('./app/webserver');

//Guardamos el valor de la varible de entorno PORT que tenemos valorada en el archivo .env
const port = process.env.PORT;

//Comprobar que la variable PORT tenga valor (que esté en el .env) sino imprimir error
if (!port){
    console.error('PORT must be defined as environment variable');
    process.exit(1);
}

//CUANDO HAGAMOS PETICION DESDE POSTMAN, COMPROBAR QUE SALTA EL ERROR
process.on('unhandledRejection', (err) => {
    console.error(err);
});

async function initApp(){
    try{
        await mysqlPool.connect();
        await webServer.listen(port);

        console.log(`webserver listening at port ${port}`);
    } catch (e){
        console.error(e);
        process.exit(1);
    }
}

initApp();