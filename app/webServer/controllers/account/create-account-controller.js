'user strict'

//para codificar las contraseñas y poder guardarlas en la base de datos
const bcrypt = require('bcrypt');
//validar el email y la contraseña
const joi = require('joi');

const mysqlPool = require('../../../database/mysql-pool/mysql-pool');

async function validate(accountData){
    const schema = joi.object({
        email: joi.string().email().require(),
        password: joi.string().alphanum().min(3).max(30).require(),

    });

    // comprobar que un valor (accounData) coincide con el schema que nosotros definimos arriba
    joi.assert(accountData, schema);
}

async function createAccount(req, res){
    const accounData = {...req.body};

    console.log(req.body);

    try{
        await validate(accounData);
    }catch(e){
        return res.status(400).send(e);
    }

    const now = new Date();
    const createAt = now.toISOString().replace('T', '').substring(0,19);

    let connection = null;
    try {
        connection = await mysqlPool.getConnection();
        const securePassword = awaitbcrypy.hash(accounData.password, 10)

        const user ={
            email: accounData.email,
            password: securePassword,
            create_at: createAt,
        };

    }catch (e){
        if (connection !== null){
            connection.release();
        }
    }
}
