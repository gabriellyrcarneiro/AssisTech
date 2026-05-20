import { Router } from 'express';
import { createDevice, getDevice, listDevices } from '../controllers/deviceController.js';
import { authenticate, authorize } from '../middleware/auth.js';

export const deviceRoutes = Router();

deviceRoutes.use(authenticate);
deviceRoutes.get('/', listDevices);
deviceRoutes.get('/:id', getDevice);
deviceRoutes.post('/', authorize('admin', 'atendente'), createDevice);

