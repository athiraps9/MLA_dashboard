const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Project = require('../models/Project');
const Attendance = require('../models/Attendance');

// Get all MLAs (Public Directory)
router.get('/', async (req, res) => {
  try {
    const mlas = await User.find({ role: 'mla' }).select('fullName district role'); 
    // Add "Profile summary" if we had a bio field. For now, fullName & district.
    res.json(mlas);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get Single MLA Detail (Public)
router.get('/:id', async (req, res) => {
  try {
    const mla = await User.findById(req.params.id).select('fullName district role');
    if (!mla || mla.role !== 'mla') {
      return res.status(404).json({ message: 'MLA not found' });
    }

    // Approved Projects
    const projects = await Project.find({ mla: req.params.id, status: 'approved' });

    // Attendance/Activities
    // Verify requirement: "Attendance statistics (charts)" & "Fund allocation & utilization"
    const attendance = await Attendance.find({ mla: req.params.id, isVerified: true });
    
    // Calculate stats
    const totalFunds = projects.reduce((acc, p) => acc + p.fundsAllocated, 0);
    const utilizedFunds = projects.reduce((acc, p) => acc + p.fundsUtilized, 0);

    res.json({
      profile: mla,
      projects,
      attendance,
      stats: {
        totalFunds,
        utilizedFunds,
        projectCount: projects.length
      }
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
