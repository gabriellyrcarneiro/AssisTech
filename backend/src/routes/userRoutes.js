import { Router } from 'express';
import { createUser, listUsers, updateUser } from '../controllers/userController.js';
import { authenticate, authorize } from '../middleware/auth.js';

export const userRoutes = Router();

userRoutes.use(authenticate, authorize('admin'));
userRoutes.get('/', listUsers);
userRoutes.post('/', createUser);
userRoutes.patch('/:id', updateUser);

