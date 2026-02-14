const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');
const Attendance = require('../models/Attendance');
const Season = require('../models/Season');
const Schedule = require('../models/Schedule');
const Project = require('../models/Project');
const Scheme = require('../models/Scheme');
const Event = require('../models/Event');
const Complaint = require('../models/Complaint');
const Category=require('../models/Category');
const User = require('../models/User');
const fs = require('fs');
const path = require('path');

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
        const pendingVerification = await Attendance.countDocuments({ isVerified: false });
        const projectsUpdated = await Project.countDocuments({ status: { $in: ['in-progress', 'completed'] } }); 
        const totalSchemes = await Scheme.countDocuments();
        const totalEvents = await Event.countDocuments();
        
        res.json({
            daysEntered: attendanceRecords, 
            attendanceRecords,
            pendingVerification,
            projectsUpdated,
            totalSchemes,
            totalEvents
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// ATTENDANCE ROUTES


// POST /pa/attendance - Add daily attendance
router.post('/attendance', auth(), ensurePA, async (req, res) => {
    const { seasonId, date, status, remarks } = req.body;
    console.log("im in attendance post",req.body)
    
    try {
        // Validate season exists
        const season = await Season.findById(seasonId);
        if (!season) {
            return res.status(404).json({ message: 'Season not found' });
        }

        // Check if attendance already exists for this date
        const existingAttendance = await Attendance.findOne({
            season: seasonId,
            date: new Date(date)
        });

        if (existingAttendance) {
            return res.status(400).json({ message: 'Attendance for this date already exists' });
        }

        // Create new attendance record
        const attendance = new Attendance({
            season: seasonId,
            date,
            status,
            remarks
        });

        await attendance.save();
        
        const populatedAttendance = await Attendance.findById(attendance._id)
            .populate('season', 'name')
            .populate('mla', 'fullName');

        res.json(populatedAttendance);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message || 'Server error' });
    }
});

// GET /pa/attendance/pending
router.get('/attendance/pending', auth(), ensurePA, async (req, res) => {
    try {
        const pendingAttendance = await Attendance.find({ isVerified: false })
            .populate('season', 'name')
            .populate('mla', 'fullName')
            .sort({ date: -1 });

        res.json(pendingAttendance);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});


// PROJECT ROUTES

// GET /pa/projects - Get all projects for management
router.get('/projects', auth(), ensurePA, async (req, res) => {
    try {
        const projects = await Project.find().populate();
        res.json(projects);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// POST /pa/project - Create a new project
router.post('/project', auth(), ensurePA, upload.single('image'), async (req, res) => {
    try {
        const { projectNumber,title, description, fundsAllocated, startDate, endDate } = req.body;
        const project = new Project({
            projectNumber,
            title,
            description,
            fundsAllocated,
            startDate,
            endDate,
            status: 'pending'
        });
        await project.save();
        res.json(project);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Delete project
router.delete('/projects/:id', async (req, res) => {
    try {
        const deletedProject = await Project.findByIdAndDelete(req.params.id);

        if (!deletedProject) {
            return res.status(404).json({ message: 'Project not found' });
        }

        res.json({ message: 'Project deleted successfully' });
    } catch (error) {
        console.error('Delete project error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});



router.put('/projects/:id', upload.single('projectImage'), async (req, res) => {
    try {
        const {
            projectNumber,
            title,
            description,
            category,
            constituency,
            startDate,
            endDate,
            fundsAllocated
        } = req.body;

        const updateData = {
            projectNumber,
            title,
            description,
            category,
            constituency,
            startDate,
            endDate,
            fundsAllocated
        };

        if (req.file) {
            updateData.projectImage = `/uploads/projects/${req.file.filename}`;
        }
         
        console.log("im in project put",req.params.id);
        const updatedProject = await Project.findByIdAndUpdate(
            
            req.params.id,
            updateData,
            { new: true, runValidators: true }

        
        );

        if (!updatedProject) {
            return res.status(404).json({ message: 'Project not found' });
        }

        res.json({ 
            message: 'Project updated successfully', 
            project: updatedProject 
        });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ message: 'Project number already exists' });
        }
        console.error('Update project error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});









// PUT /pa/project/:id - Update project status/details
router.put('/project/:id', auth(), ensurePA, upload.single('image'), async (req, res) => {
    try {
        const updateData = { ...req.body };
        if (req.file) {
            updateData.imageUrl = `/uploads/${req.file.filename}`;
        }
        const project = await Project.findByIdAndUpdate(
            req.params.id, 
            { $set: updateData },
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
router.get('/complaints', auth(), ensurePA, async (req, res) => {
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
router.put('/complaint/:id', auth(), ensurePA, async (req, res) => {
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

// SCHEME ROUTES

// GET /pa/schemes
router.get('/schemes', auth(), ensurePA, async (req, res) => {
    try {
        const schemes = await Scheme.find({ pa: req.user.id }).sort({ createdAt: -1 });
        res.json(schemes);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// POST /pa/scheme
router.post('/scheme', auth(), ensurePA, upload.single('image'), async (req, res) => {
    try {
        const { date, time, location, category, description } = req.body;
        const scheme = new Scheme({
            date,
            time,
            location,
            category,
            description,
            pa: req.user.id,
            status: 'pending'
        });
        await scheme.save();
        res.json(scheme);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// PUT /pa/scheme/:id
router.put('/scheme/:id', auth(), ensurePA, upload.single('image'), async (req, res) => {
    try {
        const updateData = { ...req.body };
        if (req.file) {
            updateData.imageUrl = `/uploads/${req.file.filename}`;
        }
        const scheme = await Scheme.findOneAndUpdate(
            { _id: req.params.id, pa: req.user.id, status: 'pending' },
            { $set: updateData },
            { new: true }
        );
        if (!scheme) return res.status(404).json({ message: 'Scheme not found or cannot be edited' });
        res.json(scheme);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// EVENT ROUTES

// GET /pa/events
router.get('/events', auth(), ensurePA, async (req, res) => {
    try {
        const events = await Event.find({ pa: req.user.id }).sort({ createdAt: -1 });
        res.json(events);
        console.log("line number 258",events);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// POST /pa/event
// POST /pa/event
router.post('/event', auth(), ensurePA, upload.single('image'), async (req, res) => {
    try {
        const { date, time, location, category, description } = req.body;
        
        // Create event first without image
        const event = new Event({
            date,
            time,
            location,
            category,
            description,
            pa: req.user.id,
            status: 'pending'
        });
        
        await event.save();
        
        // Handle image upload if present
        if (req.file) {
            
            
            // Get file extension from original file
            const fileExtension = path.extname(req.file.originalname);
            
            // Create new filename using event ID
            const newFilename = `${event._id}${fileExtension}`;
            const oldPath = req.file.path;
            const newPath = path.join(path.dirname(oldPath), newFilename);
            
            // Rename the file
            fs.renameSync(oldPath, newPath);
            
            // Update event with image URL
            event.imageUrl = `/uploads/${newFilename}`;
            await event.save();
        }
        
        res.json(event);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});
// PUT /pa/event/:id
router.put('/event/:id', auth(), ensurePA, upload.single('image'), async (req, res) => {
    try {
        const updateData = { ...req.body };
        if (req.file) {
            updateData.imageUrl = `/uploads/${req.file.filename}`;
        }
        const event = await Event.findOneAndUpdate(
            { _id: req.params.id, pa: req.user.id, status: 'pending' },
            { $set: updateData },
            { new: true }
        );
        if (!event) return res.status(404).json({ message: 'Event not found or cannot be edited' });
        res.json(event);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// ==================== SCHEDULING ROUTES ====================

// GET /pa/seasons - Get all active seasons
router.get('/seasons', auth(), ensurePA, async (req, res) => {
    try {
        const seasons = await Season.find({ isActive: true }).sort({ startDate: -1 });
        res.json(seasons);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// GET /pa/attendance/all - Get all attendance records for tree view
router.get('/attendance/all', auth(), ensurePA, async (req, res) => {
    try {
        const attendance = await Attendance.find()
            .populate('season', 'name')
            .populate('mla', 'fullName')
            .sort({ 'date': -1 });

        res.json(attendance);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// POST /pa/schedule - Create new schedule
router.post('/schedule', auth(), ensurePA, async (req, res) => {
    try {
        const { date, time, venue, scheduleType, description, adminId } = req.body;

        // Validate admin exists
        // const admin = await User.findById(adminId);
        // if (!admin || admin.role !== 'admin') {
        //     return res.status(404).json({ message: 'Admin not found' });
        // }

        // Create schedule
        const schedule = new Schedule({
            date,
            time,
            venue,
            scheduleType,
            description,
            admin: adminId,
             status: 'Pending'
        });
        console.log(schedule,"line 464");
        await schedule.save();

        const populatedSchedule = " ";
        
        console.log(populatedSchedule);
        res.json(populatedSchedule);
        
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message || 'Server error' });
    }
});

// GET /pa/schedules - Get all schedules created by PA
router.get('/schedules', auth(), ensurePA, async (req, res) => {
    try {
        const schedules = await Schedule.find({ }).sort({ date: -1 });
        res.json(schedules);
        
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

//Delete shedules

router.delete("/schedules/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const deletedSchedule = await Schedule.findByIdAndDelete(id);

    if (!deletedSchedule) {
      return res.status(404).json({ message: "Schedule not found" });
    }

    res.status(200).json({
      message: "Schedule deleted successfully",
      deletedSchedule,
    });

  } catch (err) {
    console.error("Error deleting schedule:", err);
    res.status(500).json({ message: "Server error" });
  }
});







// GET /pa/availability/:adminId/:date - Check admin availability for a date
router.get('/availability/:adminId/:date', auth(), ensurePA, async (req, res) => {
    try {
        const { adminId, date } = req.params;
        
        const targetDate = new Date(date);
        targetDate.setHours(0, 0, 0, 0);
        
        const nextDay = new Date(targetDate);
        nextDay.setDate(nextDay.getDate() + 1);

        // Find schedules for this admin on this date
        const schedules = await Schedule.find({
            admin: adminId,
            date: { $gte: targetDate, $lt: nextDay },
            status: { $in: ['Pending', 'Approved'] }
        }).sort({ time: 1 });

        res.json({
            date: targetDate,
            isAvailable: schedules.length === 0,
            schedules: schedules
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// GET /pa/admins - Get all admins for scheduling
router.get('/admins', auth(), ensurePA, async (req, res) => {
    try {
        const admins = await User.find({ role: 'admin' }).select('fullName email');
        res.json(admins);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// GET /pa/admin-busy-dates/:adminId - Get dates where admin is busy (Pending or Approved)
router.get('/admin-busy-dates/:adminId', auth(), ensurePA, async (req, res) => {
    try {
        const { adminId } = req.params;
        const busySchedules = await Schedule.find({
            admin: adminId,
            status: { $in: ['Pending', 'Approved'] }
        }).select('date');

        const busyDates = busySchedules.map(s => s.date.toISOString().split('T')[0]);
        // Return unique dates
        res.json([...new Set(busyDates)]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});


// CREATE CATEGORY
router.post("/addcategory", async (req, res) => {
  try {
    const { name } = req.body;

    const existing = await Category.findOne({ name });
    if (existing) {
      return res.status(400).json({ message: "Category already exists" });
    }

    const category = new Category({
      name,
      
    });

    await category.save();

    res.status(201).json(category);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET ALL CATEGORIES
router.get("/category", async (req, res) => {
  try {
    const categories = await Category.find().sort({ createdAt: -1 });
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update Attendance
router.put("/attendance/pending/:id", async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;

  try {
    const updatedAttendance = await Attendance.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    );

    if (!updatedAttendance) {
      return res.status(404).json({ message: "Attendance not found" });
    }

    res.json(updatedAttendance);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
});

// Delete Attendance
router.delete("/attendance/pending/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const deletedAttendance = await Attendance.findByIdAndDelete(id);

    if (!deletedAttendance) {
      return res.status(404).json({ message: "Attendance not found" });
    }

    res.json({ message: "Attendance deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
});














module.exports = router;
