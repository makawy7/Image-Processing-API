import express from 'express';
import path from 'path';
import { promises as fsPromises } from 'fs';

const imagesPath = path.resolve(`./assets/images/`);
const files: string[] = [];

interface funType {
  (): void;
}

const findImage = (
  req: express.Request,
  res: express.Response,
  next: funType
): void => {
  fsPromises
    .readdir(imagesPath)
    .then((filenames) => {
      for (const filename of filenames) {
        files.push(filename);
      }

      if (files.includes(`${req.query.filename}.jpg`)) {
        // image already exist in /assets/images/ folder
        next();
      } else {
        // image non existent
        res.status(404).send('Image not found!');
      }
    })
    .catch((err) => {
      res.send(err);
    });
};

export default findImage;
