import { Router } from 'express';
import {
  confirmDelivery,
  createOrder,
  decideBudget,
  getOrder,
  listOrders,
  registerPayment,
  saveBudget,
  saveDiagnosis,
  saveExecution,
  updateStatus,
} from '../controllers/orderController.js';
import { authenticate, authorize } from '../middleware/auth.js';

export const orderRoutes = Router();

orderRoutes.use(authenticate);
orderRoutes.get('/', listOrders);
orderRoutes.get('/:id', getOrder);
orderRoutes.post('/', authorize('admin', 'atendente'), createOrder);
orderRoutes.patch('/:id/status', authorize('admin', 'atendente', 'tecnico', 'financeiro'), updateStatus);
orderRoutes.patch('/:id/diagnosis', authorize('admin', 'tecnico'), saveDiagnosis);
orderRoutes.patch('/:id/budget', authorize('admin', 'tecnico'), saveBudget);
orderRoutes.patch('/:id/budget/decision', authorize('admin', 'atendente'), decideBudget);
orderRoutes.patch('/:id/execution', authorize('admin', 'tecnico'), saveExecution);
orderRoutes.patch('/:id/payment', authorize('admin', 'financeiro'), registerPayment);
orderRoutes.patch('/:id/delivery', authorize('admin', 'atendente'), confirmDelivery);

