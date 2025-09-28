const express = require('express');
const { body } = require('express-validator');
const { 
    getTimesheets, 
    getTimesheetById, 
    createTimesheet, 
    updateTimesheet, 
    deleteTimesheet,
    getAllTimesheets 
} = require('../controllers/timesheetController');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Validation rules for timesheet entries
const timesheetEntryValidation = [
    body('date')
        .isISO8601()
        .withMessage('Please provide a valid date'),
    body('hours')
        .isNumeric()
        .isFloat({ min: 0, max: 24 })
        .withMessage('Hours must be between 0 and 24'),
    body('description')
        .trim()
        .isLength({ min: 1, max: 200 })
        .withMessage('Description must be between 1 and 200 characters'),
    body('project')
        .optional()
        .trim()
        .isLength({ max: 100 })
        .withMessage('Project name must be less than 100 characters')
];

// Validation rules for timesheet
const timesheetValidation = [
    body('weekStarting')
        .isISO8601()
        .withMessage('Please provide a valid week starting date'),
    body('weekEnding')
        .isISO8601()
        .withMessage('Please provide a valid week ending date'),
    body('entries')
        .isArray({ min: 1 })
        .withMessage('At least one entry is required'),
    body('entries.*.date')
        .isISO8601()
        .withMessage('Please provide valid dates for all entries'),
    body('entries.*.hours')
        .optional()
        .custom((value) => {
            if (value === '' || value === null || value === undefined) {
                return true; // Allow empty hours for missing status
            }
            const numValue = parseFloat(value);
            return !isNaN(numValue) && numValue >= 0 && numValue <= 24;
        })
        .withMessage('Hours must be between 0 and 24 for all entries'),
    body('entries.*.description')
        .trim()
        .isLength({ min: 1, max: 200 })
        .withMessage('Description is required for all entries'),
];

// Apply authentication middleware to all routes
router.use(authenticateToken);

// Routes
router.get('/', getTimesheets); // Get user's timesheets
router.get('/all', getAllTimesheets); // Get all timesheets (Admin only)
router.get('/:id', getTimesheetById); // Get specific timesheet
router.post('/', timesheetValidation, createTimesheet); // Create new timesheet
router.put('/:id', timesheetValidation, updateTimesheet); // Update timesheet
router.delete('/:id', deleteTimesheet); // Delete timesheet

module.exports = router;
