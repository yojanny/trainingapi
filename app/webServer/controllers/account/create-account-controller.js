'user strict'

//para codificar las contraseñas y poder guardarlas en la base de datos
const bcrypt = require('bcrypt');
//validar el email y la contraseña
const joi = require('joi');

const mysqlPool = require('../../../database/mysql-pool/mysql-pool');

async function validate(accountData){
    const schema = joi.object({
        email: joi.string().email(),
        password: joi.string().alphanum().min(3).max(30),

    });

    // comprobar que un valor (accounData) coincide con el schema que nosotros definimos arriba
    joi.assert(accountData, schema);
}

 async function createAccount(req, res){
    const accounData = {...req.body};
    console.log(req.body, 'data 2');
    try{
        await validate(accounData);
    }catch(e){
        return res.status(400).send(e);
    }

    const now = new Date(Date.now());
    const createAt = now.toISOString();

    let connection = null;
    try {
        connection = await mysqlPool.getConnection();
        const securePassword = await bcrypt.hash(accounData.password, 10)

        const user ={
            email: accounData.email,
            password: securePassword,
            created_at: createAt,
        };

        await connection.query('INSERT INTO users SET ?', user);
        connection.release();

        return res.status(201).send();

    }catch (e){
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
