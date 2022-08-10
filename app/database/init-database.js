'use strict';

require('dotenv').config();

//console.log(process.env); //si ejecutamos este js desde este directorio (consola: node initDB.js) no vemos las variables de entorno (que valoramos en el .env), por eso siempre hay que ejecutar desde la raiz del proyecto (consola: node db/initDB.js)

const mysqlPool = require ('../database/mysql-pool/mysql-pool');

async function main(){

    let connection = null;

    try{
        await mysqlPool.connect();
        connection = await mysqlPool.getConnection();

        console.log('Borrando tablas existentes');

        await connection.query('DROP TABLE IF EXISTS favorito');
        await connection.query('DROP TABLE IF EXISTS ejercicio');
        await connection.query('DROP TABLE IF EXISTS users');

        console.log("Creando tablas");

        await connection.query(`
        CREATE TABLE users (
            id INT UNSIGNED NOT NULL AUTO_INCREMENT,
            email VARCHAR(255) NOT NULL,
            password CHAR(60) NOT NULL,
            created_at DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
            PRIMARY KEY (id),
            UNIQUE INDEX email_UNIQUE (email),
            role VARCHAR(60) NOT NULL
          );
          `);

        await connection.query(`
        CREATE TABLE ejercicio (
            id INT UNSIGNED NOT NULL AUTO_INCREMENT,
            name VARCHAR(60) NOT NULL,
            description VARCHAR(255),
            image CHAR(255) NOT NULL,
            typology VARCHAR(60),
            muscle VARCHAR(60),
            created_at DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
            user_id INT UNSIGNED NOT NULL,
            PRIMARY KEY (id),
            UNIQUE INDEX image_UNIQUE (image),
            FOREIGN KEY (user_id)
            REFERENCES users (id)
              ON DELETE NO ACTION
              ON UPDATE NO ACTION
          );
          `);

        await connection.query(`
        CREATE TABLE favorito (
            user_id INT UNSIGNED NOT NULL,
            ejercicio_id INT UNSIGNED NOT NULL,
            created_at DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
            PRIMARY KEY (user_id, ejercicio_id),
            FOREIGN KEY (user_id)
            REFERENCES users (id)
              ON DELETE NO ACTION
              ON UPDATE NO ACTION,
            FOREIGN KEY (ejercicio_id)
            REFERENCES ejercicio (id)
              ON DELETE NO ACTION
              ON UPDATE NO ACTION
          );
          `);

    }catch(error){
        console.error(error);
        
    }finally{
        if(connection){
            connection.release();
        }
        process.exit();    
    }
}

main();