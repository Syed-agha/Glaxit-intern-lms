// Load environment variables
const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const session = require('express-session');
const cors = require('cors');
const passport = require('passport');

// Create express app
const app = express();

// Passport config
require('./auth/passportconfig')(passport);

// Middleware
app.use(cors({
  origin: 'http://localhost:5173', // Your frontend URL
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

// Static uploads folder
app.use('/uploads', express.static('uploads'));

// Import routes
const authRoutes = require('./routes/authroutes');
const internRoutes = require('./routes/internroutes');
const taskRoutes = require('./routes/taskroutes');
const progressRoutes = require('./routes/progressroutes');
const badgeRoutes = require('./routes/badgeroutes');
const notificationRoutes = require('./routes/notificationroutes');

// Use routes
app.use('/auth', authRoutes);
app.use('/interns', internRoutes);
app.use('/tasks', taskRoutes);
app.use('/progress', progressRoutes);
app.use('/badges', badgeRoutes);
app.use('/notifications', notificationRoutes);

//serve static pages
const path = require('path');
app.use(express.static(path.join(__dirname, '../frontend')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// This avoids Cannot GET / confusion.
app.get('/health', (req, res) => res.send('OK'));
app.get('/', (req, res) => res.send('Glaxit LMS backend running'));

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});