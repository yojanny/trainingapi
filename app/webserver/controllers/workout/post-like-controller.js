'use strict';

const mysqlPool = require('../../../database/mysql-pool/mysql-pool');
const { validateWorkoutId } = require('../../shared/validate-schemas');

async function postLike(req, res) {
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

  const query = `INSERT INTO favorito SET ?`;

  let connection = null;
  try {
    const now = new Date();
    const createdAt = now.toISOString().replace('T', ' ').substring(0, 19);

    const workoutData = {
      user_id: userId,
      ejercicio_id: workoutId,
      created_at: createdAt,
    };

    connection = await mysqlPool.getConnection();
    await connection.query(query, workoutData);
    connection.release();

    return res
      .status(201)
      .send([
        { status: '201', message: 'workout like created' },
        { workoutId },
      ]);
  } catch (e) {
    if (connection) {
      connection.release();
    }

    if (e.code === 'ER_DUP_ENTRY') {
      return res
        .status(409)
        .send({ status: '409', message: 'duplicate entry' });
    }

    return res.status(500).send({ status: '500', message: e.message });
  }
}

module.exports = postLike;
