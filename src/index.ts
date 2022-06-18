import express from 'express';
import router from './routes/index';

const app = express();
const port = 3000;

app.use('/api', router);

app.get('/', (req: express.Request, res: express.Response): void => {
   res.status(200).send('Welcome');
});

const server = app.listen(port, (): void => {
  console.log(`Server started at port ${port}`);
});

export default server;
