const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/data', require('./routes/data')); // Existing data routes (projects/admin)
app.use('/api/landing', require('./routes/landing')); // New Landing Page
app.use('/api/mla', require('./routes/mla')); // New MLA Directory
app.use('/api/complaints', require('./routes/complaints')); // New Complaints
app.use('/api/pa', require('./routes/pa')); // New PA routes
app.use('/api/admin', require('./routes/admin')); // Admin routes for seasons, attendance, scheduling



// Database Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB Connected'))
.catch(err => console.error(err));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
