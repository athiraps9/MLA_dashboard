const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Season = require('../models/Season');
const Attendance = require('../models/Attendance');
const Schedule = require('../models/Schedule');
const User = require('../models/User');

// Middleware to ensure user is Admin
const ensureAdmin = (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Access denied: Admin role required' });
    }
    next();
};

// ==================== SEASON ROUTES ====================

// POST /admin/season - Create new season
router.post('/season', auth(['admin']), ensureAdmin, async (req, res) => {
    try {
        const { name, startDate, endDate, description } = req.body;
        
        // Validate dates
        if (new Date(endDate) <= new Date(startDate)) {
            return res.status(400).json({ message: 'End date must be after start date' });
        }

        const season = new Season({
            name,
            startDate,
            endDate,
            description
        });

        await season.save();
        res.json(season);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message || 'Server error' });
    }
});

// GET /admin/seasons - Get all seasons
router.get('/seasons', auth(['admin']), ensureAdmin, async (req, res) => {
    try {
        const seasons = await Season.find().sort({ createdAt: -1 });
        res.json(seasons);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// PUT /admin/season/:id - Update season
router.put('/season/:id', auth(['admin']), ensureAdmin, async (req, res) => {
    try {
        const { name, startDate, endDate, description, isActive } = req.body;
        
        const updateData = {};
        if (name) updateData.name = name;
        if (startDate) updateData.startDate = startDate;
        if (endDate) updateData.endDate = endDate;
        if (description !== undefined) updateData.description = description;
        if (isActive !== undefined) updateData.isActive = isActive;

        const season = await Season.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true }
        );

        if (!season) {
            return res.status(404).json({ message: 'Season not found' });
        }

        res.json(season);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// ==================== ATTENDANCE ROUTES ====================

// GET /admin/attendance/all - Get all attendance records with tree structure
router.get('/attendance/all', auth(['admin']), ensureAdmin, async (req, res) => {
    try {
        const attendance = await Attendance.find()
            .populate('season', 'name startDate endDate')
            .populate('mla', 'fullName')
            .populate('verifiedBy', 'fullName')
            .sort({ 'season': 1, 'date': -1 });

        res.json(attendance);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// GET /admin/attendance/pending - Get pending attendance records
router.get('/attendance/pending', auth(['admin']), ensureAdmin, async (req, res) => {
    try {
        const attendance = await Attendance.find({ isVerified: false })
            .populate('season', 'name')
            .populate('mla', 'fullName')
            .sort({ date: -1 });

        res.json(attendance);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// PUT /admin/attendance/:id/verify - Verify attendance record
router.put('/attendance/:id/verify', auth(['admin']), ensureAdmin, async (req, res) => {
    try {
        const { isVerified, remarks } = req.body;

        const attendance = await Attendance.findByIdAndUpdate(
            req.params.id,
            {
                isVerified: isVerified !== undefined ? isVerified : true,
                verifiedBy: req.user.id,
                verifiedAt: new Date(),
                remarks: remarks || ''
            },
            { new: true }
        ).populate('season', 'name').populate('mla', 'fullName');

        if (!attendance) {
            return res.status(404).json({ message: 'Attendance record not found' });
        }

        res.json(attendance);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// ==================== SCHEDULING ROUTES ====================

// GET /admin/schedules - Get all schedules
router.get('/schedules', auth(['admin']), ensureAdmin, async (req, res) => {
    try {
        const schedules = await Schedule.find()
            .populate('admin', 'fullName')
            .populate('createdBy', 'fullName')
            .populate('approvedBy', 'fullName')
            .sort({ date: -1 });

        res.json(schedules);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// GET /admin/schedules/today - Get today's schedules
router.get('/schedules/today', auth(['admin']), ensureAdmin, async (req, res) => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        const schedules = await Schedule.find({
            date: { $gte: today, $lt: tomorrow },
            admin: req.user.id
        })
            .populate('createdBy', 'fullName')
            .sort({ time: 1 });

        res.json(schedules);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// PUT /admin/schedule/:id/approve - Approve schedule
router.put('/schedule/:id/approve', auth(['admin']), ensureAdmin, async (req, res) => {
    try {
        const schedule = await Schedule.findByIdAndUpdate(
            req.params.id,
            {
                status: 'Approved',
                approvedBy: req.user.id,
                approvedAt: new Date()
            },
            { new: true }
        )
            .populate('admin', 'fullName')
            .populate('createdBy', 'fullName');

        if (!schedule) {
            return res.status(404).json({ message: 'Schedule not found' });
        }

        res.json(schedule);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// PUT /admin/schedule/:id/cancel - Cancel schedule
router.put('/schedule/:id/cancel', auth(['admin']), ensureAdmin, async (req, res) => {
    try {
        const schedule = await Schedule.findByIdAndUpdate(
            req.params.id,
            {
                status: 'Cancelled',
                approvedBy: req.user.id,
                approvedAt: new Date()
            },
            { new: true }
        )
            .populate('admin', 'fullName')
            .populate('createdBy', 'fullName');

        if (!schedule) {
            return res.status(404).json({ message: 'Schedule not found' });
        }

        res.json(schedule);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
