const { validationResult } = require('express-validator');
const fs = require('fs');
const path = require('path');

// Load timesheets data from JSON file
const loadTimesheets = () => {
  try {
    const dataPath = path.join(__dirname, '../data/timesheets.json');
    const data = fs.readFileSync(dataPath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error loading timesheets data:', error);
    return [];
  }
};

// Save timesheets data to JSON file
const saveTimesheets = (timesheets) => {
  try {
    const dataPath = path.join(__dirname, '../data/timesheets.json');
    fs.writeFileSync(dataPath, JSON.stringify(timesheets, null, 2));
  } catch (error) {
    console.error('Error saving timesheets data:', error);
  }
};

// In-memory storage for timesheets (loaded from JSON file)
let timesheets = loadTimesheets();

// Helper function to get current week dates
const getCurrentWeekDates = () => {
    const now = new Date();
    const dayOfWeek = now.getDay();
    const diff = now.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1); // Adjust when day is Sunday
    const weekStart = new Date(now.setDate(diff));
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);
    
    return {
        weekStarting: weekStart.toISOString().split('T')[0],
        weekEnding: weekEnd.toISOString().split('T')[0]
    };
};

// Get all timesheets for a user
const getTimesheets = async (req, res) => {
    try {
        const userId = parseInt(req.params.userId) || req.user?.userId || 1;
        const userTimesheets = timesheets.filter(ts => ts.userId === userId);
        
        res.json({
            success: true,
            data: userTimesheets,
            total: userTimesheets.length
        });
    } catch (error) {
        res.status(500).json({ 
            success: false,
            error: error.message 
        });
    }
};

// Get specific timesheet by ID
const getTimesheetById = async (req, res) => {
    try {
        const timesheetId = parseInt(req.params.id);
        const userId = req.user?.userId || 1;
        
        const timesheet = timesheets.find(ts => ts.id === timesheetId && ts.userId === userId);
        
        if (!timesheet) {
            return res.status(404).json({ 
                success: false,
                message: 'Timesheet not found' 
            });
        }
        
        res.json({
            success: true,
            data: timesheet
        });
    } catch (error) {
        res.status(500).json({ 
            success: false,
            error: error.message 
        });
    }
};

// Create new timesheet
const createTimesheet = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ 
                success: false,
                errors: errors.array() 
            });
        }

        const userId = req.user.userId;
        const { weekStarting, weekEnding, entries } = req.body;

        // Calculate total hours (handle empty string hours)
        const totalHours = entries ? entries.reduce((sum, entry) => {
            const hours = entry.hours === '' || entry.hours === null || entry.hours === undefined ? 0 : parseFloat(entry.hours) || 0;
            return sum + hours;
        }, 0) : 0;

        const newTimesheet = {
            id: nextId++,
            userId,
            weekStarting: weekStarting || getCurrentWeekDates().weekStarting,
            weekEnding: weekEnding || getCurrentWeekDates().weekEnding,
            totalHours,
            entries: entries ? entries.map((entry, index) => ({
                id: (nextId - 1) * 100 + index + 1,
                date: entry.date,
                hours: entry.hours || 0,
                description: entry.description || 'New Task',
                project: entry.project || 'General'
            })) : []
        };

        timesheets.push(newTimesheet);
        saveTimesheets(timesheets);

        res.status(201).json({
            success: true,
            message: 'Timesheet created successfully',
            data: newTimesheet
        });
    } catch (error) {
        res.status(500).json({ 
            success: false,
            error: error.message 
        });
    }
};

// Update timesheet
const updateTimesheet = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ 
                success: false,
                errors: errors.array() 
            });
        }

        const timesheetId = parseInt(req.params.id);
        const userId = req.user.userId;
        const { weekStarting, weekEnding, entries } = req.body;

        const timesheetIndex = timesheets.findIndex(ts => ts.id === timesheetId && ts.userId === userId);
        
        if (timesheetIndex === -1) {
            return res.status(404).json({ 
                success: false,
                message: 'Timesheet not found' 
            });
        }

        // Calculate total hours (handle empty string hours)
        const totalHours = entries ? entries.reduce((sum, entry) => {
            const hours = entry.hours === '' || entry.hours === null || entry.hours === undefined ? 0 : parseFloat(entry.hours) || 0;
            return sum + hours;
        }, 0) : 0;

        timesheets[timesheetIndex] = {
            ...timesheets[timesheetIndex],
            weekStarting: weekStarting || timesheets[timesheetIndex].weekStarting,
            weekEnding: weekEnding || timesheets[timesheetIndex].weekEnding,
            totalHours,
            entries: entries ? entries.map((entry, index) => ({
                id: entry.id || (timesheetId * 100 + index + 1),
                date: entry.date,
                hours: entry.hours || 0,
                description: entry.description || 'New Task',
                project: entry.project || 'General'
            })) : timesheets[timesheetIndex].entries
        };

        saveTimesheets(timesheets);

        res.json({
            success: true,
            message: 'Timesheet updated successfully',
            data: timesheets[timesheetIndex]
        });
    } catch (error) {
        res.status(500).json({ 
            success: false,
            error: error.message 
        });
    }
};

// Delete timesheet
const deleteTimesheet = async (req, res) => {
    try {
        const timesheetId = parseInt(req.params.id);
        const userId = req.user.userId;

        const timesheetIndex = timesheets.findIndex(ts => ts.id === timesheetId && ts.userId === userId);
        
        if (timesheetIndex === -1) {
            return res.status(404).json({ 
                success: false,
                message: 'Timesheet not found' 
            });
        }

        timesheets.splice(timesheetIndex, 1);
        saveTimesheets(timesheets);

        res.json({
            success: true,
            message: 'Timesheet deleted successfully'
        });
    } catch (error) {
        res.status(500).json({ 
            success: false,
            error: error.message 
        });
    }
};

// Get all timesheets (Admin only)
const getAllTimesheets = async (req, res) => {
    try {
        // Check if user is admin
        if (req.user.role !== 'admin') {
            return res.status(403).json({ 
                success: false,
                message: 'Access denied. Admin role required.' 
            });
        }

        res.json({
            success: true,
            data: timesheets,
            total: timesheets.length
        });
    } catch (error) {
        res.status(500).json({ 
            success: false,
            error: error.message 
        });
    }
};

module.exports = {
    getTimesheets,
    getTimesheetById,
    createTimesheet,
    updateTimesheet,
    deleteTimesheet,
    getAllTimesheets
};
