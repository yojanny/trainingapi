'use strict';


const mysqlPool = require('../../../database/mysql-pool/mysql-pool');

async function updateWorkout(req, res, next){
    //const {userId} = req.claims;
    const workoutId = req.params.workoutId;

    console.log(req.params, " valor");

    const name = req.body.name;
    const description = req.body.description;
    const muscle = req.body.muscle;
    const typology = req.body.typology;

    const now = new Date();
    const created_at = now.toISOString().replace('T', ' ').substring(0,19);

    const workout = {
        name,
        description,
        muscle,
        typology,
        created_at,
    };

    let query = '';

    Object.keys(workout).forEach(key =>{

        if(workout[key]){
            query+= `${key} = '${workout[key]}', `;

        }   

    });

    console.log(workout, "valor");

    let connection = null;
    try{

        connection = await mysqlPool.getConnection();

        // remove last comma:
        const removeLastComma = query.slice(0, query.length - 2);

        await connection.query(`UPDATE ejercicio SET ${removeLastComma} WHERE id = ?`, +workoutId);
        
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