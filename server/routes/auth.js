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

    const userObj = user.toObject();
    delete userObj.password;
    res.json({ token, user: userObj });
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

    const userObj = user.toObject();
    delete userObj.password;
    res.status(201).json({ token, user: userObj });
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
router.get('/pas', auth(), async (req, res) => {
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
router.put('/profile',auth(), upload.single('avatar'), async (req, res) => {
  console.log("req.file", req.file);
    try {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        const {
            fullName, username, email, password,
            phoneNumber, dateOfBirth, gender,
            constituency, address, education,
            assemblyNumber, officeAddress,
            facebook, twitter, instagram
        } = req.body;

        // Check for unique constraints if username/email are changing
        if (username && username !== user.username) {
            const existing = await User.findOne({ username });
            if (existing) return res.status(400).json({ message: 'Username already taken' });
            user.username = username;
        }

        if (email && email !== user.email) {
            const existing = await User.findOne({ email });
            if (existing) return res.status(400).json({ message: 'Email already in use' });
            user.email = email;
        }

        if (fullName) user.fullName = fullName;
        if (phoneNumber) user.phoneNumber = phoneNumber;
        if (dateOfBirth) user.dateOfBirth = dateOfBirth;
        if (gender) user.gender = gender;
        if (constituency) user.constituency = constituency;
        if (address) user.address = address;
        
        if (education) {
            try {
                user.education = typeof education === 'string' ? JSON.parse(education) : education;
            } catch (e) {
                console.error("Education parse error", e);
            }
        }

        if (password && password.trim() !== '') {
            user.password = password; // Pre-save hook will hash this
        }

        if (req.file) {
            user.avatar = `/uploads/${req.file.filename}`;
            console.log("user.avatar", user.avatar);
        }

        await user.save();

        // Return user without password
        const userObj = user.toObject();
        delete userObj.password;
        res.json(userObj); // updated data sends back to client
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error during profile update' });
    }
});

// Forgot Password - Request reset link
router.post('/forgot-password', async (req, res) => {
    const { email } = req.body;
    
    try {
        // Validate email format
        if (!email || !/\S+@\S+\.\S+/.test(email)) {
            return res.status(400).json({ message: 'Please provide a valid email address' });
        }

        // Find user by email
        const user = await User.findOne({ email });

        // Always return success message (don't reveal if email exists)
        const successMessage = 'If an account exists with this email, a password reset link has been sent.';

        if (!user) {
            // Don't reveal that user doesn't exist
            return res.json({ message: successMessage });
        }

        // Generate secure random token
        const crypto = require('crypto');
        const resetToken = crypto.randomBytes(32).toString('hex');

        // Hash token before storing
        const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

        // Set token and expiration (1 hour)
        user.resetPasswordToken = hashedToken;
        user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
        await user.save();

        // Create reset URL
        const resetUrl = `${process.env.CLIENT_URL}/reset-password?token=${resetToken}`;

        // Send email
        const nodemailer = require('nodemailer');
        
        const transporter = nodemailer.createTransport({
            service: process.env.EMAIL_SERVICE || 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD
            }
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: user.email,
            subject: 'Password Reset Request - Perinthalmanna E-Governance',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #06b6d4;">Password Reset Request</h2>
                    <p>Hello ${user.fullName},</p>
                    <p>You requested to reset your password for your Perinthalmanna E-Governance account.</p>
                    <p>Please click the button below to reset your password:</p>
                    <div style="text-align: center; margin: 30px 0;">
                        <a href="${resetUrl}" style="background: linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%); color: white; padding: 12px 30px; text-decoration: none; border-radius: 8px; display: inline-block;">Reset Password</a>
                    </div>
                    <p>Or copy and paste this link in your browser:</p>
                    <p style="color: #666; word-break: break-all;">${resetUrl}</p>
                    <p style="color: #ef4444; margin-top: 20px;"><strong>This link will expire in 1 hour.</strong></p>
                    <p>If you didn't request this, please ignore this email and your password will remain unchanged.</p>
                    <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;">
                    <p style="color: #9ca3af; font-size: 12px;">Perinthalmanna Legislative Assembly Portal</p>
                </div>
            `
        };

        await transporter.sendMail(mailOptions);

        res.json({ message: successMessage });
    } catch (err) {
        console.error('Forgot password error:', err);
        res.status(500).json({ message: 'Error sending reset email. Please try again later.' });
    }
});

// Reset Password - Update password with token
router.post('/reset-password', async (req, res) => {
    const { token, password } = req.body;

    try {
        // Validate inputs
        if (!token || !password) {
            return res.status(400).json({ message: 'Token and password are required' });
        }

        // Validate password requirements
        if (password.length < 8) {
            return res.status(400).json({ message: 'Password must be at least 8 characters long' });
        }

        const passwordRequirements = [
            { regex: /[A-Z]/, message: 'Password must contain at least one uppercase letter' },
            { regex: /[a-z]/, message: 'Password must contain at least one lowercase letter' },
            { regex: /[0-9]/, message: 'Password must contain at least one number' },
            { regex: /[^A-Za-z0-9]/, message: 'Password must contain at least one special character' }
        ];

        for (const req of passwordRequirements) {
            if (!req.regex.test(password)) {
                return res.status(400).json({ message: req.message });
            }
        }

        // Hash the token to compare with stored hash
        const crypto = require('crypto');
        const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

        // Find user with valid token and not expired
        const user = await User.findOne({
            resetPasswordToken: hashedToken,
            resetPasswordExpires: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ message: 'Invalid or expired reset token' });
        }

        // Update password (will be hashed by pre-save hook)
        user.password = password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();

        res.json({ message: 'Password has been reset successfully. You can now login with your new password.' });
    } catch (err) {
        console.error('Reset password error:', err);
        res.status(500).json({ message: 'Error resetting password. Please try again.' });
    }
});

// Simple Reset Password - Direct password update with email (no token)
router.post('/simple-reset-password', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Validate inputs
        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

        // Validate email format
        if (!/\S+@\S+\.\S+/.test(email)) {
            return res.status(400).json({ message: 'Please provide a valid email address' });
        }

        // Validate password requirements
        if (password.length < 8) {
            return res.status(400).json({ message: 'Password must be at least 8 characters long' });
        }

        const passwordRequirements = [
            { regex: /[A-Z]/, message: 'Password must contain at least one uppercase letter' },
            { regex: /[a-z]/, message: 'Password must contain at least one lowercase letter' },
            { regex: /[0-9]/, message: 'Password must contain at least one number' },
            { regex: /[^A-Za-z0-9]/, message: 'Password must contain at least one special character' }
        ];

        for (const req of passwordRequirements) {
            if (!req.regex.test(password)) {
                return res.status(400).json({ message: req.message });
            }
        }

        // Find user by email
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: 'No account found with this email address' });
        }

        // Update password (will be hashed by pre-save hook)
        user.password = password;
        await user.save();

        res.json({ message: 'Password has been reset successfully. You can now login with your new password.' });
    } catch (err) {
        console.error('Simple reset password error:', err);
        res.status(500).json({ message: 'Error resetting password. Please try again.' });
    }
});

module.exports = router;
