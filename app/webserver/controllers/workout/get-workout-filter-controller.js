'use strict';

const mysqlPool = require('../../../database/mysql-pool/mysql-pool');

async function getWorkoutFilter(req, res){

    const workoutParam = req.params.workoutParam;

    const query = `SELECT * FROM ejercicio WHERE muscle = ?`;

    let connection = null;

    try{
        connection = await mysqlPool.getConnection();

        const [workoutData] = await connection.execute(query, [workoutParam]);

        connection.release();

        if(!workoutData){
            return res.status(500).send();
        }

        return res.status(200).send(workoutData);
    }catch(e){
        if(connection){
            connection.release();
        }

        console.error(e);
        return res.status(500).sens(e.message);
    }


}

module.exports= getWorkoutFilter;