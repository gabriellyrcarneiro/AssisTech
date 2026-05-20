import { Router } from 'express';
import { createCustomer, getCustomer, listCustomers } from '../controllers/customerController.js';
import { authenticate, authorize } from '../middleware/auth.js';

export const customerRoutes = Router();

customerRoutes.use(authenticate);
customerRoutes.get('/', listCustomers);
customerRoutes.get('/:id', getCustomer);
customerRoutes.post('/', authorize('admin', 'atendente'), createCustomer);

