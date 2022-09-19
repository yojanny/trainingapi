'use strict';

const mysqlPool = require('../../../database/mysql-pool/mysql-pool');

async function getWorkoutFilter(req, res) {
  const { workoutParam } = req.params;

  const query = `SELECT * FROM ejercicio WHERE muscle = ?`;

  let connection = null;
  try {
    connection = await mysqlPool.getConnection();

    const [workoutData] = await connection.execute(query, [workoutParam]);
    connection.release();

    return res
      .status(200)
      .send([{ status: 200, message: 'workouts filtered' }, workoutData]);
  } catch (e) {
    if (connection) {
      connection.release();
    }
    return res.status(500).send([{ status: 500, message: e.message }]);
  }
}

module.exports = getWorkoutFilter;
