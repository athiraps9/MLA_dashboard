const express = require('express');
const router = express.Router();
const Project = require('../models/Project');
const Scheme = require('../models/Scheme');
const Event = require('../models/Event');
const Attendance = require('../models/Attendance');
const Season = require('../models/Season');
const Schedule = require('../models/Schedule');
const auth = require('../middleware/auth');
const User = require('../models/User');


// --- PUBLIC ROUTES ---

// Get Public Dashboard Data (Approved Projects & Verified Attendance)
router.get('/public/dashboard', async (req, res) => {
  try {
    console.log('Fetching public dashboard data...');
    //const projects = await Project.find({ status: 'approved' }).populate('mla', 'fullName district');
    const projects = await Project.find({ status: ['approved','pending',  'in-progress', 'completed'] });
    const schemes = await Scheme.find({ status: 'approved' }).populate('pa', 'fullName');
    const events = await Event.find({ status: 'approved' }).populate('pa', 'fullName');

    const attendance = await Attendance.find({ isVerified: true }).populate('mla', 'fullName district');
    res.json({ projects, schemes, events, attendance });


  } catch (err) {
    console.log('Error fetching public dashboard data... ', err);
    res.status(500).json({ message: err.message });
  }
});

// --- MLA ROUTES ---

// Get MLA's own data
router.get('/mla/my-data', auth(['mla']), async (req, res) => {
  try {
    const projects = await Project.find({ mla: req.user.id });
    const attendance = await Attendance.find({ mla: req.user.id });
    res.json({ projects, attendance });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add Project
router.post('/mla/project', auth(['mla']), async (req, res) => {
  try {
    const { title, description, fundsAllocated, beneficiaries } = req.body;
    const project = new Project({
      title,
      description,
      fundsAllocated,
      beneficiaries,
      mla: req.user.id
    });
    await project.save();
    res.json(project);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add Attendance
router.post('/mla/attendance', auth(['mla']), async (req, res) => {
  try {
    const { date, type, description } = req.body;
    const attendance = new Attendance({
      date,
      type,
      description,
      mla: req.user.id
    });
    await attendance.save();
    res.json(attendance);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// --- ADMIN ROUTES ---

// Get Pending Data
router.get('/admin/pending', auth(['admin']), async (req, res) => {
  try {
    const pendingProjects = await Project.find({ status: 'pending' }).populate('mla', 'fullName');
    const pendingAttendance = await Attendance.find({ isVerified: false }).populate('mla', 'fullName');
    res.json({ projects: pendingProjects, attendance: pendingAttendance });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Approve/Reject Project
// Approve/Reject/Edit Project
router.put('/admin/project/:id', auth(['admin']), async (req, res) => {
  try {
    const { status, remarks, title, description, fundsAllocated, beneficiaries } = req.body; 
    
    const updateData = {};
    if (status) updateData.status = status;
    if (remarks) updateData.remarks = remarks;
    if (title) updateData.title = title;
    if (description) updateData.description = description;
    if (fundsAllocated) updateData.fundsAllocated = fundsAllocated;
    if (beneficiaries) updateData.beneficiaries = beneficiaries;

    const project = await Project.findByIdAndUpdate(
      req.params.id, 
      updateData,
      { new: true }
    );
    res.json(project);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete Project
router.delete('/admin/project/:id', auth(['admin']), async (req, res) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });
    res.json({ message: 'Project deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Verify Attendance
router.put('/admin/attendance/:id', auth(['admin']), async (req, res) => {
  try {
    const { isVerified, remarks } = req.body;
    const attendance = await Attendance.findByIdAndUpdate(
      req.params.id,
      { isVerified, remarks },
      { new: true }
    );
    res.json(attendance);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /public/attendance/percentage - Get verified attendance percentage
router.get('/public/attendance/percentage', async (req, res) => {
  try {
    const totalAttendance = await Attendance.countDocuments();
    const verifiedPresent = await Attendance.countDocuments({ 
      isVerified: true, 
      status: 'Present' 
    });
    
    const percentage = totalAttendance > 0 
      ? ((verifiedPresent / totalAttendance) * 100).toFixed(1) 
      : 0;

    res.json({ 
      percentage,
      totalRecords: totalAttendance,
      verifiedPresent 
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /public/schedules - Get approved schedules only
router.get('/public/schedules', async (req, res) => {
  try {
    const schedules = await Schedule.find({ status: 'Approved' })
      .populate('admin', 'fullName')
      .sort({ date: 1 });

    res.json(schedules);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Rate Projects, Schemes, or Events
router.post('/public/:type/:id/rate', auth(['citizen', 'public', 'admin', 'mla', 'pa']), async (req, res) => {
  const { type, id } = req.params;
  const { rating, comment } = req.body;

  try {
    let Model;
    if (type === 'projects') Model = Project;
    else if (type === 'schemes') Model = Scheme;
    else if (type === 'events') Model = Event;
    else return res.status(400).json({ message: 'Invalid type' });

    const item = await Model.findById(id);
    if (!item) return res.status(404).json({ message: 'Item not found' });

    // Check if user already rated (optional, but good practice)
    const existingRating = item.ratings.find(r => r.user?.toString() === req.user.id);
    if (existingRating) {
      existingRating.rating = rating;
      existingRating.comment = comment;
      existingRating.createdAt = Date.now();
    } else {
      item.ratings.push({ user: req.user.id, rating, comment });
    }

    // Recalculate average
    item.totalRatings = item.ratings.length;
    item.averageRating = item.ratings.length > 0
      ? item.ratings.reduce((sum, r) => sum + r.rating, 0) / item.ratings.length
      : 0;

    await item.save();
    res.json(item);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});




/* ALL EVENTS */
/* http://localhost:5000/api/data/allevents */
router.get('/allevents', async (req, res) => {
  try {
    const events = await Event.find({}).sort({ date: -1 });
    res.json(events);
    console.log("line number 225 data all events", events);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

/* TOP 3 EVENTS */
/* http://localhost:5000/api/data/events */
router.get('/events', async (req, res) => {
  try {
    const events = await Event.find({})
      .sort({ date: -1 })
      .limit(3);
    
    res.json(events);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

/* ALL SCHEDULES */
/* http://localhost:5000/api/data/allschedules */
router.get('/allschedules', async (req, res) => {
  try {
    const schedules = await Schedule.find({}).sort({ date: -1 });
    res.json(schedules);
    console.log("data all schedules", schedules);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

/* TOP 3 SCHEDULES */
/* http://localhost:5000/api/data/schedules */
router.get('/schedules', async (req, res) => {
  try {
    const schedules = await Schedule.find({})
      .sort({ date: -1 })
      .limit(3);
    
    res.json(schedules);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

/* ALL PROJECTS */
/* http://localhost:5000/api/data/allprojects */
router.get('/allprojects', async (req, res) => {
  try {
    const projects = await Project.find({}).sort({ date: -1 });
    res.json(projects);
    console.log("data all projects", projects);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

/* TOP 3 PROJECTS */
/* http://localhost:5000/api/data/projects */
router.get('/projects', async (req, res) => {
  try {
    const projects = await Project.find({})
      .sort({ date: -1 })
      .limit(3);
    
    res.json(projects);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

/* ALL SCHEMES */
/* http://localhost:5000/api/data/allschemes */
router.get('/allschemes', async (req, res) => {
  try {
    const schemes = await Scheme.find({}).sort({ date: -1 });
    res.json(schemes);
    console.log("data all schemes", schemes);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

/* TOP 3 SCHEMES */
/* http://localhost:5000/api/data/schemes */
router.get('/schemes', async (req, res) => {
  try {
    const schemes = await Scheme.find({})
      .sort({ date: -1 })
      .limit(3);
    
    res.json(schemes);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

/* ALL ATTENDANCE */
/* http://localhost:5000/api/data/allattendance */
router.get('/allattendance', async (req, res) => {
  try {
    const attendance = await Attendance.find({}).sort({ date: -1 });
    res.json(attendance);
    console.log("data all attendance", attendance);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

/* TOP 3 ATTENDANCE */
/* http://localhost:5000/api/data/attendance */
router.get('/attendance', async (req, res) => {
  try {
    const attendance = await Attendance.find({})
      .sort({ date: -1 })
      .limit(3);
    
    res.json(attendance);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});






module.exports = router;
