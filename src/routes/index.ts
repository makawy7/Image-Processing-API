import express from 'express';
import img from './api/img';
import health from './api/health';

const router = express.Router();

router.use('/health', health);
router.use('/img', img);

export default router;
