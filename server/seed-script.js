const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Project = require('./models/Project');
const Attendance = require('./models/Attendance');

dotenv.config();

const sampleUsers = [
  {
    username: 'admin',
    password: 'adminpassword',
    role: 'admin',
    fullName: 'System Administrator'
  },
  {
    username: 'mla_bangalore_south',
    password: '',
    role: 'mla',
    district: 'Bangalore South',
    fullName: 'Ramesh Kumar'
  },
  {
    username: 'mla_mysore',
    password: 'password123',
    role: 'mla',
    district: 'Mysore',
    fullName: 'Suresh Patil'
  }
];

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB Connected');
  } catch (err) {
    console.error('Error connecting to MongoDB:', err.message);
    process.exit(1);
  }
};

const seedData = async () => {
  await connectDB();

  try {
    // Clear existing data
    await User.deleteMany({});
    await Project.deleteMany({});
    await Attendance.deleteMany({});
    console.log('Cleared existing data');

    // Insert Users
    // We use a loop to ensure the pre-save hook (hashing password) runs
    const createdUsers = [];
    for (const user of sampleUsers) {
      const newUser = new User(user);
      await newUser.save();
      createdUsers.push(newUser);
    }
    console.log(`Created ${createdUsers.length} users`);

    const mla1 = createdUsers.find(u => u.username === 'mla_bangalore_south');
    const mla2 = createdUsers.find(u => u.username === 'mla_mysore');

    if (!mla1 || !mla2) {
      throw new Error('MLA users not created correctly');
    }

    // specific projects for MLA 1
    const projectpassword123s = [
      {
        title: 'Road Repair - Jayanagar 4th Block',
        description: 'Repaving of 4th main road due to potholes and monsoon damage.',
        mla: mla1._id,
        fundsAllocated: 5000000,
        fundsUtilized: 2000000,
        status: 'approved',
        beneficiaries: 'Residents of Jayanagar',
        remarks: 'Priority project approved by municipality.'
      },
      {
        title: 'Public Park Renovation',
        description: 'Renovation of the JP Nagar Mini Park including new benches and lighting.',
        mla: mla1._id,
        fundsAllocated: 1500000,
        fundsUtilized: 0,
        status: 'pending',
        beneficiaries: 'Local community',
        remarks: 'Awaiting environmental clearance.'
      },
      {
        title: 'School Computer Lab Upgrade',
        description: 'Providing 50 new computers to the Government High School, Mysore.',
        mla: mla2._id,
        fundsAllocated: 3000000,
        fundsUtilized: 3000000,
        status: 'approved',
        beneficiaries: 'Students of Govt High School',
        remarks: 'Project completed successfully.'
      }
    ];

    await Project.insertMany(projects);
    console.log(`Created ${projects.length} projects`);

    // specific attendance for MLAs
    const attendanceRecords = [
      {
        date: new Date('2023-11-01'),
        mla: mla1._id,
        type: 'presentation',
        description: 'Presented a bill on urban waste management.',
        isVerified: true,
        remarks: 'Well received by the assembly.'
      },
      {
        date: new Date('2023-11-02'),
        mla: mla1._id,
        type: 'committee',
        description: 'Attended the Public Accounts Committee meeting.',
        isVerified: true
      },
      {
        date: new Date('2023-11-05'),
        mla: mla2._id,
        type: 'question',
        description: 'Raised a question regarding water supply in Mysore rural areas.',
        isVerified: false,
        remarks: 'Minister requested time to answer.'
      }
    ];

    await Attendance.insertMany(attendanceRecords);
    console.log(`Created ${attendanceRecords.length} attendance records`);

    console.log('Data seeding completed successfully!');
    process.exit(0);
  } catch (err) {
    console.error('Error seeding data:', err);
    process.exit(1);
  }
};

seedData();
