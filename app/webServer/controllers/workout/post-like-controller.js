'use strict';

const Joi = require('joi');
const mysqlPool = require('../../../database/mysql-pool/mysql-pool');

async function postLike(req, res){
    const {userId} = req.claims;
    const workoutId = req.params.workoutId;

    //validar datos

    let connection = null;

    try{
        const now = new Date();
        const createAt = now.toISOString().replace('T', ' ').substring(0, 19);
        const query =`INSERT INTO favorito SET ?`;

        const workoutData = {
            user_id: userId,
            ejercicio_id: workoutId,
            created_at: createAt,
        };
        
        connection = await mysqlPool.getConnection();
        await connection.query(query,workoutData);
        connection.release();

        return res.status(201).send();

    }catch(e){
        if(connection){
            connection.release();
        }

        if(e.code ==='ER_DUP_ENTRY'){
            return res.status(201).send();
        }

        console.error(e);
        return res.status(500).send(e.message);
    }
}

module.exports = postLike;