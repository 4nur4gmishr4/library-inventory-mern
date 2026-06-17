const express = require('express');
const path = require('path');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const { errorHandler } = require('./middleware/errorMiddleware');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// --- Standard Middleware ---
app.use(cors());
app.use(express.json());

// --- Routes ---
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/books', require('./routes/bookRoutes'));
app.use('/api/members', require('./routes/memberRoutes'));

// --- Production Deployment ---
// Serve frontend static files
app.use(express.static(path.join(__dirname, '../client/dist')));

// Catch-all route to serve React's index.html for any unknown route (React Router)
app.use((req, res) => {
  res.sendFile(path.resolve(__dirname, '../client/dist', 'index.html'));
});

// Centralized error handling middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
