'use strict';

const mysqlPool = require('../../../database/mysql-pool/mysql-pool');
const { validateWorkoutId } = require('../../shared/validate-schemas');

async function getWorkoutFav(req, res) {
  const { userId } = req.claims;
  const { workoutId } = req.params;

  try {
    const datosAvalidar = { workoutId };
    await validateWorkoutId(datosAvalidar);
  } catch (e) {
    return res
      .status(400)
      .send([{ status: '400', message: e.details[0].message }]);
  }

  const query = `SELECT ej.name, ej.image, ej.muscle, ej.typology, ej.description, ej.id, fav.ejercicio_id FROM  ejercicio ej INNER JOIN favorito fav ON ?=fav.ejercicio_id INNER JOIN users us ON ?=fav.user_id`;

  let connection = null;
  try {
    connection = await mysqlPool.getConnection();

    const [workoutsListFav] = await connection.execute(query, [
      workoutId,
      userId,
    ]);
    connection.release();

    return res.status(200).send({ status: 'ok', data: workoutsListFav });
  } catch (e) {
    if (connection) {
      connection.release();
    }
    return res.status(500).send([{ status: 500, message: e.message }]);
  }
}

module.exports = getWorkoutFav;
