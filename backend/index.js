require('dotenv').config();
const express = require('express');
const cors = require('cors');

const routes = require('./routes');
// const { testConnection } = require('./config/database');

const app = express();
const PORT = process.env.PORT || 5000;


app.use(cors({
  origin: '*', // or use '*' for all origins (not recommended for production)
  credentials: true // if you're using cookies or HTTP auth headers
}));

// Middleware
app.use(express.json({ limit: '10mb' }));


// API routes
app.use('/api', routes);

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'User Management API',
    version: '1.0.0',
    status: 'Running',
    timestamp: new Date().toISOString()
  });
});


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`API URL: http://localhost:${PORT}/api`);
});

module.exports = app;