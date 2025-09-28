const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');
const fs = require('fs');
const path = require('path');

// Load users data from JSON file
const loadUsers = () => {
  try {
    const dataPath = path.join(__dirname, '../data/users.json');
    const data = fs.readFileSync(dataPath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error loading users data:', error);
    return [];
  }
};

// Save users data to JSON file
const saveUsers = (users) => {
  try {
    const dataPath = path.join(__dirname, '../data/users.json');
    fs.writeFileSync(dataPath, JSON.stringify(users, null, 2));
  } catch (error) {
    console.error('Error saving users data:', error);
  }
};

// Mock user data for testing (loaded from JSON file)
let mockUsers = loadUsers();

// Register function
const register = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { name, email, password } = req.body;

        // Check if user already exists
        const existingUser = mockUsers.find(user => user.email === email);
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists with this email' });
        }

        // Create new user
        const newUser = {
            id: mockUsers.length + 1,
            name,
            email,
            password: await bcrypt.hash(password, 12),
            role: 'employee'
        };

        mockUsers.push(newUser);
        saveUsers(mockUsers);

        // Generate JWT token
        const token = jwt.sign(
            { userId: newUser.id, email: newUser.email, role: newUser.role },
            process.env.JWT_SECRET || 'fallback_secret',
            { expiresIn: process.env.JWT_EXPIRE || '7d' }
        );

        res.status(201).json({
            message: 'User registered successfully',
            token,
            user: {
                id: newUser.id,
                name: newUser.name,
                email: newUser.email,
                role: newUser.role
            }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Login function
const login = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { email, password } = req.body;

        // Find user by email
        const user = mockUsers.find(u => u.email === email);
        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Check password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Generate JWT token
        const token = jwt.sign(
            { userId: user.id, email: user.email, role: user.role },
            process.env.JWT_SECRET || 'fallback_secret',
            { expiresIn: process.env.JWT_EXPIRE || '7d' }
        );

        res.json({
            message: 'Login successful',
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get current user profile
const getProfile = async (req, res) => {
    try {
        const userId = req.user.userId;
        const user = mockUsers.find(u => u.id === userId);
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    register,
    login,
    getProfile
};
