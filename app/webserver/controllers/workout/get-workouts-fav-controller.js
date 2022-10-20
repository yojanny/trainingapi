'use strict';

const mysqlPool = require('../../../database/mysql-pool/mysql-pool');

async function getWorkoutsFav(req, res) {
  const { userId } = req.claims;
  const query = `SELECT ej.name, ej.image, ej.muscle, ej.typology, ej.description, ej.id, fav.ejercicio_id FROM  ejercicio ej INNER JOIN favorito fav ON ej.id=fav.ejercicio_id INNER JOIN users us ON ?=fav.user_id`;

  let connection = null;
  try {
    connection = await mysqlPool.getConnection();

    const [workoutsListFav] = await connection.execute(query, [userId]);
    connection.release();

    return res.status(200).send({ status: 'ok', data: workoutsListFav });
  } catch (e) {
    if (connection) {
      connection.release();
    }
    return res.status(500).send([{ status: 500, message: e.message }]);
  }
}

module.exports = getWorkoutsFav;
