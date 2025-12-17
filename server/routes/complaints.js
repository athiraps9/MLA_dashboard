const express = require('express');
const router = express.Router();
const Complaint = require('../models/Complaint');
const auth = require('../middleware/auth');

// Create Complaint (Public User)
router.post('/', auth(['public']), async (req, res) => {
  try {
    const { title, description } = req.body;
    const complaint = new Complaint({
      user: req.user.id,
      title,
      description
    });
    await complaint.save();
    res.status(201).json(complaint);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get My Complaints (Public User)
router.get('/my', auth(['public']), async (req, res) => {
  try {
    const complaints = await Complaint.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(complaints);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Admin: Get All Complaints
router.get('/all', auth(['admin']), async (req, res) => {
  try {
    const complaints = await Complaint.find().populate('user', 'fullName email').sort({ createdAt: -1 });
    res.json(complaints);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Admin: Update Status/Resolve
router.put('/:id', auth(['admin']), async (req, res) => {
  try {
    const { status, adminResponse } = req.body;
    const complaint = await Complaint.findByIdAndUpdate(
      req.params.id,
      { status, adminResponse },
      { new: true }
    );
    res.json(complaint);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
