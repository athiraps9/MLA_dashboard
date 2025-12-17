const express = require('express');
const router = express.Router();
const Project = require('../models/Project');
const Attendance = require('../models/Attendance');
const auth = require('../middleware/auth');
const User = require('../models/User');

// --- PUBLIC ROUTES ---

// Get Public Dashboard Data (Approved Projects & Verified Attendance)
router.get('/public/dashboard', async (req, res) => {
  try {
    console.log('Fetching public dashboard data...');
    const projects = await Project.find({ status: 'approved' }).populate('mla', 'fullName district');
    // const projects = await Project.find({ });
   console.log("projects",projects);


    const attendance = await Attendance.find({ isVerified: true }).populate('mla', 'fullName district');
    res.json({ projects, attendance });


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

module.exports = router;
