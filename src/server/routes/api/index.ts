import { Router } from 'express';
import wmts from './wmts';
const router = Router();

router.use('/api', wmts);

export default router;
