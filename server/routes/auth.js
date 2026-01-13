const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const auth = require('../middleware/auth'); // Import auth middleware
const multer = require('multer');
const path = require('path');

// Multer Config
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
});
const upload = multer({ storage });

// Login
router.post('/login', async (req, res) => {
  const { username, password, userType } = req.body; // userType: 'public' or 'authority'
  try {
    console.log("req.body", req.body);
    const user = await User.findOne({ 
      $or: [{ username: username }, { email: username }] 
    });
    
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    // Verify user type matches
    //if (userType && user.userType !== userType || user.userType !== 'admin') {
        //return res.status(400).json({ message: 'Invalid user type for this account' });
   // }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign(
      { id: user._id, role: user.role, fullName: user.fullName, userType: user.userType },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.json({ token, user: { id: user._id, role: user.role, fullName: user.fullName, userType: user.userType, district: user.district } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Public Signup
router.post('/signup', async (req, res) => {
  const { 
    username, 
    email, 
    password, 
    phoneNumber, 
    dateOfBirth, 
    gender, 
    constituency, 
    address, 
    education 
  } = req.body;
  try {
    let user = await User.findOne({ $or: [{ username }, { email }] });
    if (user) return res.status(400).json({ message: 'User with this username or email already exists' });

    user = new User({
      username,
      email,
      password,
      role: 'public',
      userType: 'public',
      fullName: username, // Default fullName to username as it's not in the UI
      phoneNumber,
      dateOfBirth,
      gender,
      constituency,
      address,
      education
    });

    await user.save();

    const token = jwt.sign(
      { id: user._id, role: user.role, fullName: user.fullName, userType: user.userType },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.status(201).json({ token, user: { id: user._id, role: user.role, fullName: user.fullName, userType: user.userType } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create PA Account (Admin Only)
router.post('/create-pa', async (req, res) => {

  console.log("req.body", req.body);
  console.log("req.user", req.user);


  
  //  if (req.user.role !== 'admin' && req.user.role !== 'mla') {
  //      return res.status(403).json({ message: 'Access denied' });
  //  }

    const { fullName, username, password, email } = req.body;

    try {
        let user = await User.findOne({ username });
        if (user) return res.status(400).json({ message: 'User already exists' });

        user = new User({
            username,
            email,
            password,
            role: 'pa',
            userType: 'authority',
            fullName,
         


        });

        await user.save();
        res.status(201).json({ message: 'PA account created successfully', user: { id: user._id, username: user.username, fullName: user.fullName } });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get All PAs (Admin Only)
router.get('/pas', auth, async (req, res) => {
    if (req.user.role !== 'admin' && req.user.role !== 'mla') {
        return res.status(403).json({ message: 'Access denied' });
    }
    try {
        const pas = await User.find({ role: 'pa' }).select('-password');
        res.json(pas);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error check' });
    }
});
// Seed Initial Data (Run once or use for testing)
router.post('/seed', async (req, res) => {
  try {
    const adminExists = await User.findOne({ username: 'admin' });
    if (adminExists) return res.status(400).json({ message: 'Admin already exists' });

    const admin = new User({
      username: 'admin',
      password: 'adminpassword',
      role: 'admin',
      userType: 'authority',
      fullName: 'System Administrator'
    });
    await admin.save();

    const mla = new User({
      username: 'mla_kerala',
      password: 'mlapassword',
      role: 'mla',
      userType: 'authority',
      district: 'Thiruvananthapuram',
      fullName: 'Shri. P. Kumar'
    });
    await mla.save();

    res.json({ message: 'Users seeded successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update Profile (All Users)
router.put('/profile', auth, upload.single('avatar'), async (req, res) => {
    try {
        const updates = {};
        if (req.body.fullName) updates.fullName = req.body.fullName;
        if (req.file) {
             // Store relative path. Frontend will prepend API_URL if needed, or if hosted on same domain it works 
             // Actually, usually it's better to return the full URL or let frontend handle.
             // Let's store '/uploads/filename'.
             updates.avatar = `/uploads/${req.file.filename}`;
        }

        const user = await User.findByIdAndUpdate(
            req.user.id,
            { $set: updates },
            { new: true }
        ).select('-password');

        res.json(user);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
