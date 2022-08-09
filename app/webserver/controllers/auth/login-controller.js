'use strict';

const bcrypt = require('bcrypt');
const Joi = require('joi');
const jwt = require('jsonwebtoken');
const mysqlPool = require('../../../database/mysql-pool/mysql-pool.js');

const authJwtSecret = process.env.AUTH_JWT_SECRET;
const jwtExpiresIn = +process.env.JWT_EXPIRES_IN;

async function validate (payload){
    const schema = Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().alphanum().min(3).max(30).required(),
    });

    Joi.assert(payload, schema);
}

async function login(req, res, next){
    
    const accountData = { ...req.body};

    try{
        await validate(accountData);
    }catch(e){
        return res.status(400).send(e);
    }

    const sqlQuery = `SELECT id, email, password
    FROM users
    WHERE email = '${accountData.email}'`;

    let connection = null;

    try{
        connection = await mysqlPool.getConnection();
        const [rows] = await connection.query(sqlQuery);
        connection.release();

        if (rows.length !==1){
            return res.status(401).send();
        }

        const user = rows[0];

        const isPasswordOk = await bcrypt.compare (accountData.password, user.password);

        if(isPasswordOk === false){
            return res.status(401).send();
        }

        const payloadJwt = {
            userId: user.id,
        };

        const token = jwt.sign(payloadJwt, authJwtSecret, {expiresIn: jwtExpiresIn});

        const userSession ={
            accesToken: token,
            expiresIn: 3600,
        };

        res.send(userSession);

    }catch(e){
        if(connection !== null){
            connection.release();
        }

        console.error(e);

        return res.status(500).send(e);
    }

}

module.exports = login;