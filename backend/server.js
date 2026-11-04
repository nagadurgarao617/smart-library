const express = require('express');
const cors = require('cors');
const path = require('path');
const { initDatabase } = require('./database/database');
const authRoutes = require('./routes/authRoutes');
const bookRoutes = require('./routes/bookRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/books', bookRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    college: 'Sri Vasavi Engineering College',
    project: 'Smart Library Book Finder and Indoor Navigation System',
    timestamp: new Date().toISOString()
  });
});

// Initialize database and start server
async function startServer() {
  try {
    await initDatabase();
    app.listen(PORT, () => {
      console.log(`====================================================`);
      console.log(`SRI VASAVI ENGINEERING COLLEGE - SMART LIBRARY`);
      console.log(`Backend server running on http://localhost:${PORT}`);
      console.log(`API Endpoints:`);
      console.log(` - /api/books/search (Student book search)`);
      console.log(` - /api/books/stats  (Library statistics)`);
      console.log(` - /api/books/racks  (Floor racks directory)`);
      console.log(` - /api/auth/login   (Staff authentication)`);
      console.log(`====================================================`);
    });
  } catch (err) {
    console.error('Failed to initialize server:', err);
    process.exit(1);
  }
}

startServer();
