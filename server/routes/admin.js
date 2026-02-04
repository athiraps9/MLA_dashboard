const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Season = require('../models/Season');
const Attendance = require('../models/Attendance');
const Schedule = require('../models/Schedule');
const User = require('../models/User');
const Project = require('../models/Project');
const Scheme = require('../models/Scheme');
const Event = require('../models/Event');

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
            .populate()
            .populate('verifiedBy', 'fullName')
            .sort({ 'season': 1, 'date': -1 });

        res.json(attendance);

        console.log("...",attendance,"from all attendance");
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// GET /admin/attendance/pending - Get pending attendance records
router.get('/attendance/pending', auth(['admin']), ensureAdmin, async (req, res) => {
    try {
        const attendance = await Attendance.find({ isVerified: false })
            .populate()
            .populate()
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
        ).populate('season', 'name').populate()

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
console.log("today shedule",today,"tommorow",tomorrow,"line number 185 admin",schedules);


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

// ==================== PENDING & VERIFICATION ROUTES ====================

// GET /admin/pending - Get general pending stats and attendance
router.get('/pending', auth(['admin']), ensureAdmin, async (req, res) => {
    try {
        const projectsCount = await Project.countDocuments({ status: 'pending' });
        const schemesCount = await Scheme.countDocuments({ status: 'pending' });
        const eventsCount = await Event.countDocuments({ status: 'pending' });
        const attendance = await Attendance.find({ isVerified: false })
            .populate('season', 'name')
            .populate()
            .sort({ date: -1 });
            console.log("pending attendance",attendance);

        res.json({
            stats: {
                projects: projectsCount,
                schemes: schemesCount,
                events: eventsCount,
                attendance: attendance.length
            },
            attendance
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// GET /admin/projects/pending
router.get('/projects/pending', auth(['admin']), ensureAdmin, async (req, res) => {
    try {
        const projects = await Project.find({ status: 'pending' }).populate();
        res.json(projects);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// GET /admin/schemes/pending
router.get('/schemes/pending', auth(['admin']), ensureAdmin, async (req, res) => {
    try {
        const schemes = await Scheme.find({ status: 'pending' }).populate('pa', 'fullName');
        res.json(schemes);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// GET /admin/events/pending
router.get('/events/pending', auth(['admin']), ensureAdmin, async (req, res) => {
    try {
        const events = await Event.find({ status: 'pending' }).populate('pa', 'fullName');
        res.json(events);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// PUT /admin/project/:id/verify
router.put('/project/:id/verify', auth(['admin']), ensureAdmin, async (req, res) => {
    try {
        const { status, remarks } = req.body;
        const project = await Project.findByIdAndUpdate(
            req.params.id,
            { status, adminRemarks: remarks, verifiedBy: req.user.id, verifiedAt: new Date() },
            { new: true }
        );
        if (!project) return res.status(404).json({ message: 'Project not found' });
        res.json(project);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// PUT /admin/scheme/:id/verify
router.put('/scheme/:id/verify', auth(['admin']), ensureAdmin, async (req, res) => {
    try {
        const { status, remarks } = req.body;
        const scheme = await Scheme.findByIdAndUpdate(
            req.params.id,
            { status, remarks: remarks, admin: req.user.id },
            { new: true }
        );
        if (!scheme) return res.status(404).json({ message: 'Scheme not found' });
        res.json(scheme);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// PUT /admin/event/:id/verify
router.put('/event/:id/verify', auth(['admin']), ensureAdmin, async (req, res) => {
    try {
        const { status, remarks } = req.body;
        const event = await Event.findByIdAndUpdate(
            req.params.id,
            { status, remarks: remarks, admin: req.user.id },
            { new: true }
        );
        if (!event) return res.status(404).json({ message: 'Event not found' });
        res.json(event);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// GET /admin/projects - Get ALL projects
router.get('/projects', auth(['admin']), ensureAdmin, async (req, res) => {
    try {
        const projects = await Project.find().populate().sort({ createdAt: -1 });
        res.json(projects);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// GET /admin/schemes - Get ALL schemes
router.get('/schemes', auth(['admin']), ensureAdmin, async (req, res) => {
    try {
        const schemes = await Scheme.find().populate().sort({ createdAt: -1 });
        res.json(schemes);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// GET /admin/events - Get ALL events
router.get('/events', auth(['admin']), ensureAdmin, async (req, res) => {
    try {
        const events = await Event.find().populate().sort({ createdAt: -1 });
        res.json(events);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// ==================== MANAGEMENT (CRUD) ROUTES ====================

// PUT /admin/project/:id - Edit project
router.put('/project/:id', auth(['admin']), ensureAdmin, async (req, res) => {
    try {
        const project = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!project) return res.status(404).json({ message: 'Project not found' });
        res.json(project);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// DELETE /admin/project/:id
router.delete('/project/:id', auth(['admin']), ensureAdmin, async (req, res) => {
    try {
        const project = await Project.findByIdAndDelete(req.params.id);
        if (!project) return res.status(404).json({ message: 'Project not found' });
        res.json({ message: 'Project deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// PUT /admin/scheme/:id - Edit scheme
router.put('/scheme/:id', auth(['admin']), ensureAdmin, async (req, res) => {
    try {
        const scheme = await Scheme.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!scheme) return res.status(404).json({ message: 'Scheme not found' });
        res.json(scheme);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// DELETE /admin/scheme/:id
router.delete('/scheme/:id', auth(['admin']), ensureAdmin, async (req, res) => {
    try {
        const scheme = await Scheme.findByIdAndDelete(req.params.id);
        if (!scheme) return res.status(404).json({ message: 'Scheme not found' });
        res.json({ message: 'Scheme deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// PUT /admin/event/:id - Edit event
router.put('/event/:id', auth(['admin']), ensureAdmin, async (req, res) => {
    try {
        const event = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!event) return res.status(404).json({ message: 'Event not found' });
        res.json(event);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// DELETE /admin/event/:id
router.delete('/event/:id', auth(['admin']), ensureAdmin, async (req, res) => {
    try {
        const event = await Event.findByIdAndDelete(req.params.id);
        if (!event) return res.status(404).json({ message: 'Event not found' });
        res.json({ message: 'Event deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
