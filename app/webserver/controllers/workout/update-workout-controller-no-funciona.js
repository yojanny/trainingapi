'use strict';

const Joi = require('joi');
const mysqlPool = require('../../../database/mysql-pool/mysql-pool');

/* async function validateSchema(payload) {
    const schema = Joi.object({
        name: Joi.string().trim().min(1).max(255).required(),
        description: Joi.string().trim().min(1).max(65536).required(),
        typology: Joi.string().trim().min(1).max(255).required(),
        muscle: Joi.string().trim().min(1).max(255).required(),
        workoutId: Joi.string(),
        userId: Joi.string(),
    });

    Joi.assert(payload, schema);
} */

async function updateWorkout(req, res, next) {
    const { workoutId } = req.params;
    const userId = req.claims.userId;
    const name = req.body.name;
    const description = req.body.description;
    const typology = req.body.typology;
    const muscle = req.body.muscle;
    const workoutData = {
        name,
        description,
        typology,
        muscle,
    };

    /* try {
        await validateSchema(workoutData);
    } catch (e) {
        console.error(e);
        return res.status(400).send(e);
    } */

    let connection;
    try {
    connection = await mysqlPool.getConnection();
    /* const now = new Date().toISOString().replace('T', ' ').substring(0, 19); */
    /**
     * Exercise: modify upated_at column to keep track when this record was modified
     */
    const sqlUpdateNote = `UPDATE ejercicio
        SET name = ?,
        description = ?
        WHERE id = ?
        AND user_id = ?`;

    /**
     * Exercise: return 404 if the update was not possible
     */
    await connection.query(sqlUpdateNote, [
    workoutData.name,
    workoutData.description,
    workoutId,
    userId,
    ]);
    connection.release();

    return res.status(204).send();
    } catch (e) {
    if (connection) {
        connection.release();
    }

    console.error(e);
    return res.status(500).send({
        message: e.message,
    });
    }
}

module.exports = updateWorkout;
