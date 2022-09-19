'use strict';

const mysqlPool = require('../../../database/mysql-pool/mysql-pool');

async function getWorkouts(req, res) {
  const query = `SELECT name, id FROM ejercicio`;

  let connection = null;
  try {
    connection = await mysqlPool.getConnection();

    const [workoutList] = await connection.execute(query);
    connection.release();

    return res
      .status(200)
      .send([{ status: 200, message: 'workouts listed' }, { workoutList }]);
  } catch (e) {
    if (connection) {
      connection.release();
    }
    return res.status(500).send([{ status: 500, message: e.message }]);
  }
}

module.exports = getWorkouts;
