import express from 'express';
import utilities from '../../utilities/utilities';

// import path from 'path';
import urlValidator from '../../middleware/urlValidator';
import alreadyExists from '../../middleware/alreadyExists';
import findImage from '../../middleware/findImage';

const img = express.Router();

img
  .use([urlValidator, findImage, alreadyExists])
  .get('/img', (req: express.Request, res: express.Response) => {
    utilities.preProcessing(
      res,
      req.query.filename as unknown as string,
      parseInt(req.query.width as unknown as string),
      parseInt(req.query.height as unknown as string)
    );
  });

export default img;
