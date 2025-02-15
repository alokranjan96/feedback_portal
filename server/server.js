const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = process.env.PORT || 3000;
const ADMIN_JWT_SECRET = process.env.ADMIN_JWT_SECRET || 'adminsecret123';

// Middleware
app.use(cors({
  origin: process.env.NODE_ENV || 'http://localhost:3000'
}));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '../client')));

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/feedbackDB';
mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

// Schemas
const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});

const feedbackSchema = new mongoose.Schema({
    feedbackType: { type: String, required: true, enum: ['teacher', 'student'] },
    // Teacher feedback fields
    teacherName: String,
    subject: String,
    teachingSkills: String,
    approachability: String,
    explanation: String,
    engagement: String,
    feedbackQuality: String,
    timeManagement: String,
    participation: String,
    // Student feedback fields
    studentName: String,
    rollNumber: String,
    attentiveness: String,
    assignments: String,
    understanding: String,
    interest: String,
    discipline: String,
    // Common fields
    comments: String,
    createdAt: { type: Date, default: Date.now }
});

// Models
const User = mongoose.model('User', userSchema);
const Feedback = mongoose.model('Feedback', feedbackSchema);

// Routes (Preserved all original routes)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/index.html'));
});

app.get('/feedback_selection.html', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/feedback_selection.html'));
});

app.get('/admin/dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/adminDashboard.html'));
});

// User Registration (Original)
app.post('/register', async (req, res) => {
    try {
        const { username, password } = req.body;
        const existingUser = await User.findOne({ username });

        if (existingUser) {
            return res.status(400).json({ message: 'Username already exists' });
        }

        const newUser = new User({ username, password });
        await newUser.save();
        res.json({ message: 'User registered successfully!' });
    } catch (err) {
        console.error('Registration error:', err);
        res.status(500).json({ message: 'Error registering user' });
    }
});

// User Login (Original)
app.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username, password });

        if (user) {
            res.json({ message: 'Login successful!' });
        } else {
            res.status(401).json({ message: 'Invalid credentials' });
        }
    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({ message: 'Error logging in' });
    }
});

// Updated Feedback Submission
app.post('/submit-feedback', async (req, res) => {
    try {
        const clientData = req.body;

        const feedbackData = {
            feedbackType: clientData.type,
            // Teacher fields
            teacherName: clientData.teacherName,
            subject: clientData.subject,
            teachingSkills: clientData.teachingSkills,
            approachability: clientData.approachability,
            explanation: clientData.explanation,
            engagement: clientData.engagement,
            feedbackQuality: clientData.feedbackQuality,
            timeManagement: clientData.timeManagement,
            participation: clientData.participation,
            // Student fields
            studentName: clientData.studentName,
            rollNumber: clientData.rollNumber,
            attentiveness: clientData.attentiveness,
            assignments: clientData.assignments,
            understanding: clientData.understanding,
            interest: clientData.interest,
            discipline: clientData.discipline,
            comments: clientData.comments
        };

        if (!feedbackData.feedbackType) {
            return res.status(400).json({
                message: 'Feedback type is required'
            });
        }

        const feedback = new Feedback(feedbackData);
        await feedback.save();
        res.json({ message: 'Feedback submitted successfully!' });
    } catch (err) {
        console.error('Feedback submission error:', err);
        res.status(500).json({
            message: 'Error saving feedback',
            error: err.message
        });
    }
});

// Updated Admin Authentication
app.post('/admin/login', (req, res) => {
    const { username, password } = req.body;
    const adminUser = process.env.ADMIN_USERNAME || 'admin';
    const adminPass = process.env.ADMIN_PASSWORD || 'admin';

    if (username === adminUser && password === adminPass) {
        const token = jwt.sign({ username: adminUser }, ADMIN_JWT_SECRET, { expiresIn: '1h' });
        res.json({
            success: true,
            token
        });
    } else {
        res.status(401).json({ success: false });
    }
});

// Secure Feedback Endpoint
const authenticateAdmin = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Access denied' });

    try {
        const verified = jwt.verify(token, ADMIN_JWT_SECRET);
        req.admin = verified;
        next();
    } catch (err) {
        res.status(400).json({ message: 'Invalid token' });
    }
};

app.get('/api/feedback', authenticateAdmin, async (req, res) => {
    try {
        const feedback = await Feedback.find().sort({ createdAt: -1 });
        res.json(feedback);
    } catch (err) {
        console.error('Feedback fetch error:', err);
        res.status(500).json({ message: 'Error fetching feedback' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
