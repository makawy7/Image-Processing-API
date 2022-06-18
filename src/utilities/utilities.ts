import sharp from 'sharp';
import path from 'path';
import { promises as fsPromises } from 'fs';
import express from 'express';

// fixed images folder path
const imgDir = `./assets/images/`;
const imagesPath: string = path.resolve(imgDir);

//  save the image buffer from sharp into the new resized image path
// const writeImage = async (newImgPath: string, image: Buffer) => {
//   await fsPromises.writeFile(newImgPath, image);
// };

const preProcessing = (
  res: express.Response,
  imageName: string,
  width: number,
  height: number
): void => {
  // image full path
  const imgPath = `${imgDir}${imageName}.jpg`;
  // the new resized image desired full path
  const newImgPath: string = path.resolve(
    `${imagesPath}/${imageName}_thumb.jpg`
  );

  imageResize(imgPath, newImgPath, width, height).then((data) => {
    res.status(201).end(data);
  });
};

// const readImage = (newImgFullPath: unknown)=>{
//     return new Promise((resolve, reject) => {
//         try {
//           fsPromises
//             .readFile(newImgFullPath as string)
//             .then((c) => {
//               resolve(c);
//             });
//         } catch (error) {
//           reject();
//         }
//   });
// }

// use sharp package to resize the image
const imageResize = (
  imgPath: string,
  newImgPath: string,
  width: number,
  height: number
): Promise<unknown> => {
  return new Promise((resolve, reject) => {
    try {
      sharp(imgPath)
        // get the width and height from url
        .resize(width, height)
        .jpeg({ mozjpeg: true })
        .toFile(newImgPath)
        .then(() => {
          async function readImage() {
            // read the current resized image and display it
            await fsPromises.readFile(newImgPath).then((c) => {
              resolve(c);
            });
          }
          readImage();
        });
    } catch (error) {
      reject();
    }
  });
};

export default { preProcessing, imageResize };
