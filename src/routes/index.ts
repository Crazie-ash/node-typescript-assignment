import { Router } from 'express';
import authRoutes from './authRoutes';
import taskRoutes from './taskRoutes';
import categoryRoutes from './categoryRoutes';
import userRoutes from './userRoutes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/user', userRoutes);
router.use('/task', taskRoutes);
router.use('/category', categoryRoutes);

export default router;
