const express = require('express');
const cors = require('cors');
const studentRoutes = require('./routes/student.routes');
const authRoutes = require('./routes/auth.routes');

const logger = require('./middlewares/logger.middleware');
const errorHandler = require('./middlewares/error.middleware');
const notFound = require('./middlewares/notfound.middleware');
const { authenticate } = require('./middlewares/auth.middleware');

const app = express();

// CORS configuration
app.use(cors({
  origin: ["http://localhost:5173", "http://localhost:5174", "http://localhost:5175", "http://127.0.0.1:5173", "http://127.0.0.1:5174", "http://127.0.0.1:5175"],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(logger);

// Auth routes (public)
app.use('/api/auth', authRoutes);

// Protected student routes
app.use('/api/students', authenticate, studentRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;