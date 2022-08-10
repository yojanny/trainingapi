'use strict';

const mysqlPool = require('../../../database/mysql-pool/mysql-pool');

async function getWorkouts( req, res){

    const query = `SELECT name FROM ejercicio`;

    let connection = null;
     try{
        connection = await mysqlPool.getConnection();

        const [workoutData] = await connection.execute(query);
        connection.release();

        if(!workoutData){
            return res.status(500).send();
        }

        return res.status(200).send(workoutData);
        

     }catch(e){
        if (connection){
            connection.release();
        }
        console.error(e);
        return res.status(500).send(e.message);
     }
}

module.exports = getWorkouts;