'use strict'

const { object } = require('joi');
const mysqlPool = require('../../../database/mysql-pool/mysql-pool');

async function updateWorkout(req, res){
    //const {userId} = req.claims;
    const workoutId = req.params.workoutId;
    console.log(req. params, " valor");

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
       

        //const query = `UPDATE ejercicio`
         
        connection = await mysqlPool.getConnection();

        // remove last comma:
        const removeLastComma = query.slice(0, query.length - 2);

        await connection.query(`UPDATE ejercicio SET ${removeLastComma} WHERE id = ?`, +workoutId); 
        // await connection.query(`UPDATE ejercicio SET name = 'modificado prueba', description = 'prueba'  WHERE id = 3`); 

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