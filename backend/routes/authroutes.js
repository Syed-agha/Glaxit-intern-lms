const express = require('express');
const passport = require('passport');
const router = express.Router();

// Start Google OAuth login
router.get(
  '/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

// Google OAuth callback route
router.get(
  '/google/callback',
  passport.authenticate('google', {
    failureRedirect: 'http://localhost:5173/login', // Your frontend login page
    successRedirect: 'http://localhost:5173/dashboard' // Your frontend dashboard page
  })
);

// Session-check endpoint used by frontend
router.get('/me', (req, res) => {
  if (!req.user) return res.status(401).json({ error: 'Not authenticated' });
  // Return a minimal safe payload (do not return tokens)
  return res.json({
    id: req.user.id || req.user.google_id || null,
    name: req.user.name,
    email: req.user.email,
    role: req.user.role || 'intern'
  });
});

// Optional: Logout endpoint
router.get('/logout', (req, res) => {
  req.logout(() => {
    res.redirect('http://localhost:5173/login');
  });
});

/*
 * DEV ONLY: Create a fake session user for easier testing without OAuth.
 * This will only work if ALLOW_DEV_LOGIN=true is set in your .env file.
 * Do NOT enable this in production.
 */
router.post('/dev-login', (req, res) => {
  if (process.env.ALLOW_DEV_LOGIN !== 'true') {
    return res.status(403).json({ error: 'dev-login disabled' });
  }

  const { id, name, email, role } = req.body;
  if (!id || !name || !email) {
    return res.status(400).json({ error: 'id, name, email required' });
  }

  // Attach a simple user object to req and session
  req.login({ id, name, email, role: role || 'intern' }, err => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({
      success: true,
      user: { id, name, email, role: role || 'intern' }
    });
  });
});

module.exports = router;
