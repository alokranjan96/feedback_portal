const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
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
    teacherName: String,
    subject: String,
    teachingSkills: String,
    approachability: String,
    explanation: String,
    engagement: String,
    feedbackQuality: String,
    timeManagement: String,
    participation: String,
    comments: String,
    createdAt: { type: Date, default: Date.now }
});

// Models
const User = mongoose.model('User', userSchema);
const Feedback = mongoose.model('Feedback', feedbackSchema);

// API Routes
app.post('/register', async (req, res) => {
    const { username, password } = req.body;
    try {
        const existingUser = await User.findOne({ username });
        if (existingUser) return res.status(400).json({ message: 'Username exists' });

        const newUser = new User({ username, password });
        await newUser.save();
        res.json({ message: 'User registered successfully!' });
    } catch (err) {
        res.status(500).json({ message: 'Registration error' });
    }
});

app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ username, password });
        user ? res.json({ message: 'Login successful!' })
             : res.status(401).json({ message: 'Invalid credentials' });
    } catch (err) {
        res.status(500).json({ message: 'Login error' });
    }
});

app.post('/submit-feedback', async (req, res) => {
    try {
        await new Feedback(req.body).save();
        res.json({ message: 'Feedback submitted!' });
    } catch (err) {
        res.status(500).json({ message: 'Feedback error' });
    }
});

app.post('/admin/login', (req, res) => {
    const { username, password } = req.body;
    (username === 'admin' && password === 'admin')
        ? res.json({ success: true })
        : res.status(401).json({ success: false });
});

app.get('/api/feedback', async (req, res) => {
    try {
        const feedback = await Feedback.find().sort({ createdAt: -1 });
        res.json(feedback);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching feedback' });
    }
});

// Client Routes
app.get(['/', '/admin/dashboard'], (req, res) => {
    res.sendFile(path.join(__dirname, '../client/index.html'));
});

// Handle all other routes
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/index.html'));
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));