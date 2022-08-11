'use strict';

const mysqlPool = require('../../../database/mysql-pool/mysql-pool');

async function updateWorkout(req, res){
    //const {userId} = req.claims;
    const workoutId = req.params.workoutId;

    let connection = null;
    try{
        const now = new Date();
        const createdAt = now.toISOString().replace('T', ' ').substring(0,19);

        const workout ={
            created_at: createdAt,
        };

        console.log(workout);

        /* const query = `UPDATE ejercicio SET ? WHERE ?`; */
        
        connection = await mysqlPool.getConnection();
        /* await connection.execute(query,[workout, workoutId]); */
        await connection.query(`UPDATE ejercicio SET ? WHERE ?`, [workout, workoutId]);
        connection.release();

        return res.status(201).send();
    }catch(e){
        if(connection){
            connection.release();
        }

        console.error(e);
        return res.status(500).send(e.message);
    }
}

module.exports = updateWorkout;