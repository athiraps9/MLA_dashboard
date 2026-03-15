const express = require('express');
const router = express.Router();
const Complaint = require('../models/Complaint');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');

// Create Complaint (Public User)
router.post('/', auth(['public']), upload.single('image'), async (req, res) => {
  try {
    const { title, description } = req.body;

    const complaint = new Complaint({
      user: req.user.id,
      title,
      description,
      imageUrl: ''
    });

    if (req.file) {
      try {
        console.log("Uploading to Cloudinary...");

        const result = await uploadToCloudinary(
          req.file.buffer,
          complaint._id.toString(),
          req.file.mimetype,
          'complaints'
        );

        complaint.imageUrl = result.secure_url;

        console.log("Image uploaded:", result.secure_url);

      } catch (uploadError) {
        console.error('Image upload error:', uploadError);

        await complaint.save();

        return res.status(201).json({
          complaint,
          warning: 'Complaint created but image upload failed',
          error: uploadError.message
        });
      }
    }

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
