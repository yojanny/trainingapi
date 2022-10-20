'use strict';

const mysqlPool = require('../../../database/mysql-pool/mysql-pool');

async function getWorkouts(req, res) {
  //const query = `SELECT name, id, image, muscle FROM ejercicio`;
  const query = `
    SELECT ej.*, (SELECT COUNT(user_id) FROM favorito WHERE ejercicio_id = ej.id AND user_id=?) AS fav
    FROM ejercicio ej   
    `;

  let connection = null;
  try {
    connection = await mysqlPool.getConnection();

    const [workoutsList] = await connection.execute(query, [req.claims.userId]);
    connection.release();

    return res.status(200).send({ status: 'ok', data: workoutsList });
  } catch (e) {
    if (connection) {
      connection.release();
    }
    return res.status(500).send([{ status: 500, message: e.message }]);
  }
}

module.exports = getWorkouts;
