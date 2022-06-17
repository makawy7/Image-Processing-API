import express from 'express';
import path from 'path';
import sizeOf from 'image-size';
import { promises as fsPromises } from 'fs';

const imagesPath = path.resolve(`./assets/images/`);

const files: string[] = [];
interface funType {
  (): void;
}

const alreadyExists = (
  req: express.Request,
  res: express.Response,
  next: funType
): void => {
  // get all images names inside the images folder
  fsPromises
    .readdir(imagesPath)
    .then((filenames) => {
      for (const filename of filenames) {
        files.push(filename);
      }

      // check if image was previously resized
      if (files.includes(`${req.query.filename}_thumb.jpg`)) {
        const width = parseInt(`${req.query.width}`);
        const height = parseInt(`${req.query.height}`);
        const size = sizeOf(`${imagesPath}/${req.query.filename}_thumb.jpg`);
        // check if image was previously resized to the same width and height
        if (size.width == width && size.height == height) {
          // read the existing Image and don't re-resize it
          fsPromises
            .readFile(`${imagesPath}/${req.query.filename}_thumb.jpg`)
            .then((c) => {
              res.status(202).end(c);
            });
        }
        // it's same picture but different sizes
        // resize to the new choosen size and override the current one
        next();
      } else {
        // the image was not previously resized
        next();
      }
    })
    .catch((err) => {
      res.send(err);
    });
};

export default alreadyExists;
