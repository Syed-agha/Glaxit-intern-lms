// backend/middleware/auth.js
function requireLogin(req, res, next) {
  if (!req.user) return res.status(401).json({ error: "Not authenticated" });
  next();
}

function requireRole(role) {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ error: "Not authenticated" });
    if (req.user.role !== role) return res.status(403).json({ error: "Forbidden: insufficient role" });
    next();
  };
}

module.exports = { requireLogin, requireRole };
