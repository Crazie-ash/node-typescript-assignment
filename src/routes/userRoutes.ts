import { Router } from 'express';
import * as userController from '../controllers/userController';
import { verifyToken } from '../middleware/auth';
import { UserRole } from '../enums/UserRole';

const router = Router();

const { ADMIN, USER } = UserRole;

router.put('/:id', verifyToken([ADMIN, USER]), userController.updateUser);
router.delete('/:id', verifyToken([ADMIN, USER]), userController.deleteUser);
router.get('/:id', verifyToken([ADMIN, USER]), userController.getUserById);
router.get('/', verifyToken([ADMIN]), userController.getAllUsers);

export default router;
