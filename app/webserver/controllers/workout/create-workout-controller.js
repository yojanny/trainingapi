'use strict';

const fs = require('fs/promises');
const path = require('path');
const sharp = require('sharp');
const { v4 } = require('uuid');
const mysqlPool = require('../../../database/mysql-pool/mysql-pool');

const { validateWorkout } = require('../../shared/validate-schemas');

const POST_VALID_FORMATS = ['jpeg', 'png', 'gif'];
const MAX_IMAGE_WIDTH = 600;

const PROJECT_MAIN_FOLDER_PATH = process.cwd();
const POST_FOLDER_PATH = path.join(
  PROJECT_MAIN_FOLDER_PATH,
  'public',
  'uploads',
  'workouts'
);

async function createWorkout(req, res, next) {
  const { userId } = req.claims;
  const { description, name, typology, muscle } = req.body || null;
  const { file } = req;

  const workoutData = { description, name, typology, muscle };

  try {
    await validateWorkout(workoutData);
  } catch (e) {
    return res
      .status(400)
      .send([{ status: '400', message: e.details[0].message }]);
  }

  if (!file || !file.buffer) {
    return res.status(400).send([
      {
        status: '400',
        message: 'photo not found',
      },
    ]);
  }

  let imageFileName = null;
  let metadata = null;
  let image = sharp(file.buffer);
  try {
    metadata = await image.metadata();
    if (!POST_VALID_FORMATS.includes(metadata.format)) {
      throw new Error();
    }
  } catch (e) {
    return res.status(400).send([
      {
        status: '400',
        message: `image format must be one of these: ${POST_VALID_FORMATS}`,
      },
    ]);
  }

  try {
    if (metadata.width > MAX_IMAGE_WIDTH) {
      image.resize(MAX_IMAGE_WIDTH);
    }

    imageFileName = `${v4()}.${metadata.format}`;
    const imageUploadPath = path.join(POST_FOLDER_PATH, userId.toString());

    await fs.mkdir(imageUploadPath, { recursive: true });
    await image.toFile(path.join(imageUploadPath, imageFileName));
  } catch (e) {
    return res.status(500).send([
      {
        status: '500',
        message: `Error creating folder to store the image: ${e.message}`,
      },
    ]);
  }

  const now = new Date();
  const created_at = now.toISOString().replace('T', ' ').substring(0, 19);

  const workout = {
    ...workoutData,
    image: imageFileName,
    created_at,
    user_id: userId,
  };

  const query = 'INSERT INTO ejercicio SET ?';

  let connection = null;
  try {
    connection = await mysqlPool.getConnection();
    await connection.query(query, workout);
    connection.release();

    res.header(
      'Location',
      `${process.env.HTTP_SERVER_DOMAIN}/uploads/workout/${userId}/${imageFileName}`
    );
    const { user_id, ...workoutCopy } = workout;
    return res
      .status(201)
      .send([
        { status: '201', message: 'workout created' },
        { ...workoutCopy },
      ]);
  } catch (e) {
    if (connection) {
      connection.release();
    }
    return res.status(500).send([{ status: '500', message: e.message }]);
  }
}

module.exports = createWorkout;
