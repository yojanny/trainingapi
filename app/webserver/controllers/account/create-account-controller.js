'use strict';

//para codificar las contraseñas y poder guardarlas en la base de datos
const bcrypt = require('bcrypt');
//validar el email y la contraseña
const Joi = require('joi');

const mysqlPool = require('../../../database/mysql-pool/mysql-pool');

async function validate(accountData){
    const schema = Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().alphanum().min(3).max(30).required(),
    });

    //Comprobar que un valor (accounData) coincide con el schema que nosotros definimos arriba
    Joi.assert(accounData, schema);
}

async function createAccount(req, res){

    const accounData = {...req.body};

    console.log(req.body);

    try{
        await validate(accounData);
    } catch(e){
        return res.status(400).send(e);
    }

    const now = new Date();
    const createdAt = now.toISOSstring().replace('T', '').substring(0,19);

    let connection = null;
    try{
        connection = await mysqlPool.getConnection();

        const securePassword = await bcrypt.hash (accounData.password, 10)

        const user = {
            email: accounData.email,
            password: securePassword,
            created_at: createdAt,
        };


    } catch (e){
        if (connection !== null){
            connection.release();
        }
    }
}