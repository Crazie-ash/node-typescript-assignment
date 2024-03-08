import { Router } from 'express';
import * as taskController from '../controllers/taskController';

const router = Router();

router.post('/', taskController.createTask);
router.put('/:id', taskController.updateTask);
router.delete('/:id', taskController.deleteTask);
router.get('/:id', taskController.getTaskById);
router.get('/', taskController.getAllTasks);

export default router;
