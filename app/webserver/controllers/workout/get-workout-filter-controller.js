'use strict';

const mysqlPool = require('../../../database/mysql-pool/mysql-pool');

async function getWorkoutFilter(req, res) {
  const { workoutFilter } = req.params;
  const { workoutParam } = req.params;

  let connection = null;
  try {
    connection = await mysqlPool.getConnection();

    const workoutFiltered = await connection.query(
      `SELECT * FROM ejercicio WHERE ${workoutFilter} LIKE ?`,
      `%${workoutParam}%`
    );

    /* const [workoutData] = await connection.execute(
      query,
      [workoutFilter],
      [workoutParam]
    ); */
    connection.release();

    return res.status(200).send({ status: 'ok', data: workoutFiltered[0] });
  } catch (e) {
    if (connection) {
      connection.release();
    }
    return res.status(500).send([{ status: 500, message: e.message }]);
  }
}

module.exports = getWorkoutFilter;
