const express = require('express');
const router = express.Router();

// Test route
router.get('/', (req, res) => {
    res.json({
        message: 'Welcome to TenTwenty Backend API',
        version: '1.0.0',
        status: 'Server is running successfully!'
    });
});

module.exports = router;
