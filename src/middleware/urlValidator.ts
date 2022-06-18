import express from 'express';

// eslint not accepting function type for ( next in urlValidator )
interface funType {
  (): void;
}

const urlValidator = (
  req: express.Request,
  res: express.Response,
  next: funType
): void => {
  // no empty patameters
  if (
    typeof req.query.filename == 'string' &&
    typeof req.query.width == 'string' &&
    typeof req.query.height == 'string'
  ) {
    if (
      // no empty strings
      req.query.filename &&
      parseInt(req.query.width) &&
      parseInt(req.query.height)
    ) {
      // width and height must be at least 10x10
      if (parseInt(req.query.width) >= 10 && parseInt(req.query.height) >= 10) {
        next();
      } else {
        res.status(404).send('Wrong Image Size!, image must be at least 10x10');
      }
    } else {
      res.status(404).send('filename, width and height values are not valid!');
    }
  } else {
    res
      .status(404)
      .send(
        'you must enter the filename, width and height of the desired image!'
      );
  }
};

export default urlValidator;
