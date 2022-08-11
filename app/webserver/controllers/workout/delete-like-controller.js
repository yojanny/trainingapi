'use strict';

const Joi = require('joi');
const mysqlPool = require('../../../database/mysql-pool/mysql-pool');

async function validate(payload){
    const schema = Joi.object({
        workoutId: Joi.number().integer().positive().required(),
    });

    Joi.assert(payload, schema);
}

async function dislikeWorkout(req, res){
    const {userId} = req.claims;
    const workoutId = req.params.workoutId;

    try{
        const datosAvalidar ={
            workoutId,
        };
        await validate(datosAvalidar);
    }catch(e){
        return res.status(400).send(e);
    }

    let connection = null;
    try{
        const query = `DELETE FROM favorito WHERE user_id = ? AND ejercicio_id = ?`;
        connection = await mysqlPool.getConnection();
        await connection.execute(query,[userId, workoutId]);
        connection.release();

        return res.status(201).send();
    } catch(e){
        if(connection){
            connection.release();
        }

        console.error(e);
        return res.status(500).send(e.message);
    }
}

module.exports = dislikeWorkout;