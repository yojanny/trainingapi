const path = require('path');
const sharp = require('sharp');
const { v4 } = require('uuid');
const fs = require('fs/promises');

const POST_VALID_FORMATS = ['jpeg', 'png'];
const MAX_IMAGE_WIDTH = 600;

const PROJECT_MAIN_FOLDER_PATH = process.cwd();
const POST_FOLDER_PATH = path.join(
  PROJECT_MAIN_FOLDER_PATH,
  'public',
  'uploads',
  'workouts'
);

async function validateImage(file, res, userId) {
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
}

module.exports = validateImage;
