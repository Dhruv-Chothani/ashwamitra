const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Verify JWT token
const auth = async (req, res, next) => {
  try {
    console.log("Auth middleware - Headers:", req.headers);
    const token = req.header("Authorization")?.replace("Bearer ", "");
    console.log("Auth middleware - Token extracted:", token ? "Yes" : "No");
    
    if (!token) return res.status(401).json({ error: "Access denied. No token provided." });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Auth middleware - Token decoded:", decoded);
    const user = await User.findById(decoded.id).select("-password");
    console.log("Auth middleware - User found:", user ? "Yes" : "No");
    
    if (!user) return res.status(401).json({ error: "User not found." });

    req.user = user;
    next();
  } catch (err) {
    console.error("Auth middleware error:", err);
    res.status(401).json({ error: "Invalid token." });
  }
};

// Role-based access
const requireRole = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: "Access denied. Insufficient permissions." });
    }
    next();
  };
};

module.exports = { auth, requireRole };
