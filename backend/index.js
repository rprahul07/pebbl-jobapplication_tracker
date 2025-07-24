/**
 * Express app entry point for Job Application Tracker backend.
 */
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { syncSchema } from './models/index.js';
import authRoutes from './routes/authRoutes.js';
import mainRoutes from './routes/jobRoutes.js'; // Unified job + application routes

dotenv.config();

const app = express();
app.use(cors({ origin: '*', credentials: true }));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api', mainRoutes); // All job + application routes handled here

// Central error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: err.message || 'Server error' });
});

const PORT = process.env.PORT || 5000;

syncSchema(true).then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
});
