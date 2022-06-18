import express from 'express';


const health = express.Router();

health.get('/', (req :express.Request, res: express.Response) => {
  const data = {
    uptime: process.uptime(),
    message: 'Ok',
    date: new Date()
  }

res.status(200).send(data);
});

export default health;
