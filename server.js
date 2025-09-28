const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
const indexRoutes = require('./routes/index');
const authRoutes = require('./routes/auth');
const timesheetRoutes = require('./routes/timesheets');

app.use('/api', indexRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/timesheets', timesheetRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ 
        message: 'Something went wrong!',
        error: process.env.NODE_ENV === 'development' ? err.message : {}
    });
});

// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({ message: 'Route not found' });
});

app.listen(port, () => {
    console.log(`🚀 Server is running on port ${port}`);
    console.log(`📱 API available at: http://localhost:${port}/api`);
});
