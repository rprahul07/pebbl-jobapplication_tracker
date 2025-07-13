// backend/routes/userRoutes.js
import express from 'express';
import { list, get, update, remove } from '../controllers/userController.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

router.use(requireAuth);
router.get('/', list);
router.get('/:id', get);
router.patch('/:id', update);
router.delete('/:id', remove);

export default router; 