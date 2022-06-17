import express from 'express';
import sharp from 'sharp';
import path from 'path';
import urlValidator from '../../middleware/urlValidator';
import alreadyExists from '../../middleware/alreadyExists';
import findImage from '../../middleware/findImage';
import { promises as fsPromises } from 'fs';

const img = express.Router();

// fixed images folder path
const imgDir = `./assets/images/`;
const imagesPath = path.resolve(imgDir);

// image full path
const imgPath = (imgName: string) => {
  return `${imgDir}${imgName}.jpg`;
};

// the new resized image desired full path
const newImgPath = (imgName: string) => {
  return path.resolve(`${imagesPath}/${imgName}_thumb.jpg`);
};

//  save the image buffer from sharp into the new resized image path
const writeImage = async (newImgPath: string, image: Buffer) => {
  await fsPromises.writeFile(newImgPath, image);
};

img.use([urlValidator, findImage, alreadyExists]).get('/img', (req, res) => {
  const imageName = req.query.filename;
  const newImgFullPath = newImgPath(`${imageName}`);
  const width = parseInt(`${req.query.width}`);
  const height = parseInt(`${req.query.height}`);

  // use sharp package to resize the image
  sharp(imgPath(`${imageName}`))
    // get the width and height from url
    .resize(width, height)
    .jpeg({ mozjpeg: true })
    .toBuffer()
    .then((data) => {
      async function readImage() {
        await writeImage(newImgFullPath, data);
        // read the current resized image and display it
        fsPromises.readFile(newImgFullPath).then((c) => {
          res.status(201).end(c);
        });
      }

      readImage();
    })
    .catch((err) => {
      res.end(err);
    });
});

export default img;
