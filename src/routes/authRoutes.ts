import { Router } from 'express';
import * as authController from '../controllers/authController';

const router = Router();

router.post('/register', authController.createUser);
router.post('/login', authController.loginUser);

export default router;
