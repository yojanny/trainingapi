'use strict';

const mysqlPool = require('../../../database/mysql-pool/mysql-pool');
const { validateWorkoutId } = require('../../shared/validate-schemas');

async function deleteWorkout(req, res) {
  const { userId } = req.claims;
  const { workoutId } = req.params;

  try {
    const datosAvalidar = {
      workoutId,
    };
    await validateWorkoutId(datosAvalidar);
  } catch (e) {
    return res
      .status(400)
      .send([{ status: '400', message: e.details[0].message }]);
  }

  const query = `DELETE FROM ejercicio WHERE user_id = ? AND id = ?`;

  let connection = null;
  try {
    connection = await mysqlPool.getConnection();

    const [rows] = await connection.execute(query, [userId, workoutId]);

    connection.release();

    const { affectedRows } = rows;

    if (affectedRows === 0) {
      return res.status(404).send([
        { status: '404', message: "workout doesn't exist" },
        {
          workoutId,
        },
      ]);
    }

    return res
      .status(200)
      .send([{ status: '200', message: 'workout deleted' }, { workoutId }]);
  } catch (e) {
    if (connection) {
      connection.release();
    }

    console.error(e);
    return res.status(500).send([{ status: 500, message: e.message }]);
  }
}

module.exports = deleteWorkout;
