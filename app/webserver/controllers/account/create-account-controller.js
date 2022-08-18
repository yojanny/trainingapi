'use strict';

const bcrypt = require('bcrypt');
const Joi = require('joi');

const mysqlPool = require('../../../database/mysql-pool/mysql-pool');

async function validate(accountData){
    const schema = Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().alphanum().min(3).max(30).required(),
    });

    Joi.assert(accountData, schema);
}

async function createAccount(req, res){

    const accountData = {...req.body};

    console.log(req.body);

    try{
        await validate(accountData);
    } catch(e){
        return res.status(400).send(e);
    }

    const now = new Date();
    const createdAt = now.toISOString().replace('T', ' ').substring(0,19);

    let connection = null;
    try{
        connection = await mysqlPool.getConnection();

        const securePassword = await bcrypt.hash (accountData.password, 10)

        
        const user = {
            email: accountData.email,
            password: securePassword,
            created_at: createdAt,
            //en el objeto user, que son los datos del usuario que se insertan en la base de datos, se debe descomentar la linea 45 y comentar la linea 46 del atributo "role" si se quiera insertar un administrador
            //role:"admin",
            role:"member",
        };

        await connection.query('INSERT INTO users SET ?', user);
        connection.release();

        return res.status(201).send();

    } catch (e){
        if (connection !== null){
            connection.release();
        }

        console.error(e);

        if(e.code === 'ER_DUP_ENTRY'){
            return res.status(409).send(e);
        }

        return res.status(500).send(e);
    }
}

module.exports = createAccount;