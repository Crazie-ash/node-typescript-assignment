import { Router } from 'express';
import * as categoryController from '../controllers/categoryController';
import { verifyToken } from '../middleware/auth';
import { UserRole } from '../enums/UserRole';

const router = Router();
const { ADMIN, USER } = UserRole;

router.post('/', verifyToken([ADMIN, USER]), categoryController.createCategory);
router.put('/:id', verifyToken([ADMIN, USER]), categoryController.updateCategory);
router.delete('/:id', verifyToken([ADMIN, USER]), categoryController.deleteCategory);
router.get('/:id', verifyToken([ADMIN, USER]), categoryController.getCategoryById);
router.get('/', verifyToken([ADMIN, USER]), categoryController.getAllCategories);

export default router;
