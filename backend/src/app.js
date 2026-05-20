import cors from 'cors';
import express from 'express';
import morgan from 'morgan';
import { authRoutes } from './routes/authRoutes.js';
import { customerRoutes } from './routes/customerRoutes.js';
import { dashboardRoutes } from './routes/dashboardRoutes.js';
import { deviceRoutes } from './routes/deviceRoutes.js';
import { orderRoutes } from './routes/orderRoutes.js';
import { userRoutes } from './routes/userRoutes.js';
import { demoRouter } from './demo/demoRouter.js';
import { errorHandler } from './middleware/errorHandler.js';

export const app = express();
export const usesDemoApi = process.env.DEMO_MODE === 'true' || !process.env.MONGODB_URI;

app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
  }),
);
app.use(express.json());
app.use(morgan('dev'));

app.get('/api/health', (_request, response) => {
  response.json({ status: 'ok', name: 'AssisTech API', mode: usesDemoApi ? 'demo' : 'mongodb' });
});

if (usesDemoApi) {
  app.use('/api', demoRouter);
} else {
  app.use('/api/auth', authRoutes);
  app.use('/api/users', userRoutes);
  app.use('/api/customers', customerRoutes);
  app.use('/api/devices', deviceRoutes);
  app.use('/api/orders', orderRoutes);
  app.use('/api/dashboard', dashboardRoutes);
}

app.use((_request, response) => {
  response.status(404).json({ message: 'Rota nao encontrada.' });
});

app.use(errorHandler);
