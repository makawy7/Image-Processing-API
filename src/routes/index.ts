import express from 'express';
import img from './api/img';

const router = express.Router();

router.use('/', img);

export default router;
