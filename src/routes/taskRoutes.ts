import { Router } from 'express';
import * as taskController from '../controllers/taskController';
import { verifyToken } from '../middleware/auth';
import { UserRole } from '../enums/UserRole';

const router = Router();
const { ADMIN, USER } = UserRole;

router.post('/', verifyToken([ADMIN, USER]), taskController.createTask);
router.put('/:id', verifyToken([ADMIN, USER]), taskController.updateTask);
router.delete('/:id', verifyToken([ADMIN, USER]), taskController.deleteTask);
router.get('/:id', verifyToken([ADMIN, USER]), taskController.getTaskById);
router.get('/', verifyToken([ADMIN, USER]), taskController.getAllTasks);

export default router;
