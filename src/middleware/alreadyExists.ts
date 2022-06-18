import express from 'express';
import path from 'path';
import sizeOf from 'image-size';
import { promises as fsPromises } from 'fs';
import fs from 'fs';

const imagesPath: string = path.resolve(`./assets/images/`);

interface funType {
  (): void;
}

const alreadyExists = (
  req: express.Request,
  res: express.Response,
  next: funType
): void => {
  // check if image was previously resized
  if (fs.existsSync(`${req.query.filename}_thumb.jpg`)) {
    const width = parseInt(`${req.query.width}`);
    const height = parseInt(`${req.query.height}`);
    const size = sizeOf(`${imagesPath}/${req.query.filename}_thumb.jpg`);
    // check if image was previously resized to the same width and height
    if (size.width == width && size.height == height) {
      // read the existing Image and don't re-resize it
      fsPromises
        .readFile(`${imagesPath}/${req.query.filename}_thumb.jpg`)
        .then((c) => {
          // return the image
          res.status(202).end(c);
        });
    } else {
      // it's same picture but different sizes
      // resize to the new choosen size and override the current one
      next();
    }
  } else {
    // the image was not previously resized
    next();
  }
};

export default alreadyExists;
