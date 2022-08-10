'use strict';

const fs = require('fs/promises');
const path = require('path');
const sharp = require('sharp');
const v4 = require('uuid').v4; // const { v4 } = require('uuid');
const mysqlPool = require('../../../database/mysql-pool/mysql-pool');

const POST_VALID_FORMATS = ['jpeg', 'png'];
const MAX_IMAGE_WIDTH = 600;

const PROJECT_MAIN_FOLDER_PATH = process.cwd(); // donde esta el folder principal (vamos, donde esta el index.js principal y la carpeta public)
const POST_FOLDER_PATH = path.join(PROJECT_MAIN_FOLDER_PATH, 'public', 'uploads', 'posts');

async function createWorkout(req, res, next) {
  const userId = req.claims.userId; // const { userId } = req.claims;
  const file = req.file; // const { file } = req;
  const description = req.body.description || null;
  const name = req.body.name;
  const typology = req.body.typology;
  const muscle = req.body.muscle;

  /**
   * 1. validar datos (imagen)
   * 2. guardar foto en disco duro
   * 3. Insertar post en la bbdd
   */

  if (!file || !file.buffer) {
    return res.status(400).send({
      message: 'invalid message',
    });
  }

  // 2. guardar imagen en disco duro Y redimensionar si es mayor a 600px
  let imageFileName = null;
  try {
    const image = sharp(file.buffer);
    const metadata = await image.metadata();

    if (!POST_VALID_FORMATS.includes(metadata.format)) {
      return res.status(400).send(`Error, iamge format must be one of: ${POST_VALID_FORMATS}`);
    }

    if (metadata.width > MAX_IMAGE_WIDTH) {
      image.resize(MAX_IMAGE_WIDTH);
    }

    /**
     * Para el nombre de la foto, usaremos un uuid v4 concatenado con la extension de la imagen
     */
    imageFileName = `${v4()}.${metadata.format}`;
    const imageUploadPath = path.join(POST_FOLDER_PATH, userId.toString());
    
    // dir_principal/public/uploads/posts/$userId
    await fs.mkdir(imageUploadPath, { recursive: true });
    await image.toFile(path.join(imageUploadPath, imageFileName));
  } catch (e) {
    return res.status(500).send({
      message: `Error creating folder to store the image: ${e.message}`,
    });
  }

  // paso 3: insertar el post en la bbdd

  let connection;
  try {
    const now = new Date();
    const workout = {
      name,
      description,  // description: caption
      image: imageFileName,
      typology,
      muscle,
      created_at: now,
      user_id: userId,
    };

    connection = await mysqlPool.getConnection();
    await connection.query('INSERT INTO ejercicio SET ?', workout);
    connection.release();

    res.header('Location', `${process.env.HTTP_SERVER_DOMAIN}/uploads/workout/${userId}/${imageFileName}`);
    return res.status(201).send();
  } catch (e) {
    if (connection) {
      connection.release();
    }

    console.log(e);
    return res.status(500).send(e.message);
  }
}

module.exports = createWorkout;
