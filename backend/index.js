// filepath: c:\Users\Sarthak\Downloads\project\backend\index.js
// filepath: backend/index.js
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors'; // Import the cors middleware
import mongoose from 'mongoose';
import requestRoutes from './routes/requests.js';
import userRoutes from './routes/auth.js';
import statusRoutes from './routes/status.js';
import { errorHandler } from './middleware/errorHandler.js';
import logger from './utils/logger.js';

dotenv.config();

const app = express();

// CORS configuration
app.use(cors({
  origin: 'http://localhost:3000', // Replace with your frontend origin
  credentials: true
}));

// Middleware
app.use(express.json());

// Routes
app.use('/api/requests', requestRoutes);
app.use('/api/auth', userRoutes);
app.use('/api/status', statusRoutes);

// Error handling middleware
app.use(errorHandler);

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
.then(() => logger.info('Connected to MongoDB'))
.catch(err => logger.error('MongoDB connection error:', err));

const port = process.env.PORT || 5000;
app.listen(port, () => {
  logger.info(`Server running on port ${port}`);
});