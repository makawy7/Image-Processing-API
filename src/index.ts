import express from 'express';
import router from './routes/index';

const app = express();
const port = 3000;

app.use('/api', router);
app.get('/', (req, res) => {
  res.send('Hello, This is Index!');
});

const server = app.listen(port, () => {
  console.log(`Server started at port ${port}`);
});

export default server;
