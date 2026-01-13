const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Attendance = require('../models/Attendance');
const Project = require('../models/Project');
const Complaint = require('../models/Complaint');
const User = require('../models/User');

// Middleware to ensure user is a PA or Admin
const ensurePA = (req, res, next) => {
    if (req.user.role !== 'pa' && req.user.role !== 'admin' && req.user.role !== 'mla') {
        return res.status(403).json({ message: 'Access denied: PA role required' });
    }
    next();
};

// GET /pa/dashboard - Dashboard Stats
router.get('/dashboard', async (req, res) => {
    try {
        const attendanceRecords = await Attendance.countDocuments();
        const pendingVerification = await Attendance.countDocuments({ "days.status": "Pending" });
        const projectsUpdated = await Project.countDocuments({ status: { $in: ['in-progress', 'completed'] } }); 
        
        // This is a simplification; ideally we track which PA updated what. 
        // For now, returning global stats relevant to PA.

        res.json({
            daysEntered: attendanceRecords, 
            attendanceRecords,
            pendingVerification,
            projectsUpdated
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// ATTENDANCE ROUTES
//Test

// POST /pa/attendance - Add new season or add days to season
router.post('/attendance', auth, ensurePA, async (req, res) => {
    const { season, date, present, remarks, mlaId } = req.body;
    try {
        let attendance = await Attendance.findOne({ season, mla: mlaId });
        
        if (!attendance) {
            attendance = new Attendance({
                season,
                mla: mlaId,
                days: []
            });
        }

        // Check if date already exists in this season
        const existingDay = attendance.days.find(d => new Date(d.date).toDateString() === new Date(date).toDateString());
        if (existingDay) {
            return res.status(400).json({ message: 'Attendance for this date already exists in this season' });
        }

        attendance.days.push({
            date,
            present,
            status: 'Pending',
            remarks
        });

        await attendance.save();
        res.json(attendance);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// GET /pa/attendance/pending
router.get('/attendance/pending', auth, ensurePA, async (req, res) => {
    try {
        const seasons = await Attendance.find({ "days.status": "Pending" }).populate('mla', 'fullName');
        let pendingDays = [];
        
        seasons.forEach(s => {
            s.days.forEach(d => {
                if (d.status === 'Pending') {
                    pendingDays.push({
                        _id: d._id,
                        seasonId: s._id,
                        season: s.season,
                        mlaName: s.mla.fullName,
                        date: d.date,
                        present: d.present,
                        remarks: d.remarks
                    });
                }
            });
        });

        res.json(pendingDays);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});


// PROJECT ROUTES

// GET /pa/projects - Get all projects for management
router.get('/projects', auth, ensurePA, async (req, res) => {
    try {
        const projects = await Project.find().populate('mla', 'fullName');
        res.json(projects);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// PUT /pa/project/:id - Update project status/details
router.put('/project/:id', auth, ensurePA, async (req, res) => {
    try {
        const project = await Project.findByIdAndUpdate(
            req.params.id, 
            { $set: req.body },
            { new: true }
        );
        res.json(project);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// COMPLAINT ROUTES

// GET /pa/complaints - Get assigned complaints or all complaints
router.get('/complaints', auth, ensurePA, async (req, res) => {
    try {
        // PAs can see all complaints to pick them up or assigned ones
        const complaints = await Complaint.find().populate('user', 'fullName email').sort({ createdAt: -1 });
        res.json(complaints);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// PUT /pa/complaint/:id - Update complaint
router.put('/complaint/:id', auth, ensurePA, async (req, res) => {
    const { status, paResponse, priority } = req.body;
    try {
        const updateFields = {};
        if (status) updateFields.status = status;
        if (paResponse) updateFields.paResponse = paResponse;
        if (priority) updateFields.priority = priority;
        
        // If PA responds, auto-assign if not assigned
        updateFields.assignedTo = req.user.id; 

        const complaint = await Complaint.findByIdAndUpdate(
            req.params.id,
            { $set: updateFields },
            { new: true }
        );
        res.json(complaint);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
