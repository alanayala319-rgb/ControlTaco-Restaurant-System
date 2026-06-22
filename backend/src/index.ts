import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

import authRoutes from './routes/authRoutes';
import mesaRoutes from './routes/mesaRoutes';
import productoRoutes from './routes/productoRoutes';
import pedidoRoutes from './routes/pedidoRoutes';

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/mesas', mesaRoutes);
app.use('/api/productos', productoRoutes);
app.use('/api/pedidos', pedidoRoutes);
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'ControlTaco API is running' });
});

// Init DB and Start Server
const startServer = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

startServer();
