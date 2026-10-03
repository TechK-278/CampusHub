/**
 * CampusHub — Authentication & Authorization Middleware
 * Practical 9: Role-Based Access Control (RBAC) & JWT Security
 */

const jwt = require("jsonwebtoken");
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../../.env") });
const { query } = require("../config/db");

// Fail fast on missing or weak JWT_SECRET (must be >= 32 characters)
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET || JWT_SECRET.trim().length < 32) {
  console.error("FATAL ERROR: JWT_SECRET environment variable is missing or shorter than 32 characters.");
  // If running directly or imported in server, ensure safe enforcement
  if (process.env.NODE_ENV !== "test_bypass_secret") {
    process.exit(1);
  }
}

const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "2h";

// In-Memory Login Throttle (5 attempts / 15 mins per username+IP)
const loginAttempts = new Map();
const THROTTLE_WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const MAX_FAILED_ATTEMPTS = 5;

/**
 * Check if the current login request is throttled
 */
function checkLoginThrottle(key) {
  const now = Date.now();
  const record = loginAttempts.get(key);
  if (!record) return { isThrottled: false, remainingAttempts: MAX_FAILED_ATTEMPTS };

  // Expire window
  if (now - record.firstAttempt > THROTTLE_WINDOW_MS) {
    loginAttempts.delete(key);
    return { isThrottled: false, remainingAttempts: MAX_FAILED_ATTEMPTS };
  }

  if (record.count >= MAX_FAILED_ATTEMPTS) {
    const minutesLeft = Math.ceil((THROTTLE_WINDOW_MS - (now - record.firstAttempt)) / 60000);
    return { isThrottled: true, minutesLeft };
  }

  return { isThrottled: false, remainingAttempts: MAX_FAILED_ATTEMPTS - record.count };
}

/**
 * Record a failed login attempt
 */
function recordFailedLogin(key) {
  const now = Date.now();
  const record = loginAttempts.get(key);
  if (!record || now - record.firstAttempt > THROTTLE_WINDOW_MS) {
    loginAttempts.set(key, { count: 1, firstAttempt: now });
  } else {
    record.count += 1;
  }
}

/**
 * Clear throttle record on successful login
 */
function clearLoginThrottle(key) {
  loginAttempts.delete(key);
}

/**
 * Clean up old throttle records periodically
 */
const throttleInterval = setInterval(() => {
  const now = Date.now();
  for (const [key, record] of loginAttempts.entries()) {
    if (now - record.firstAttempt > THROTTLE_WINDOW_MS) {
      loginAttempts.delete(key);
    }
  }
}, 5 * 60 * 1000);
if (throttleInterval && typeof throttleInterval.unref === "function") {
  throttleInterval.unref();
}


/**
 * Authentication Middleware: Validates Bearer JWT & Loads Live User Role from DB
 */
async function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"] || req.headers["Authorization"];
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      success: false,
      error: "Authentication token missing or malformed. Please provide a Bearer token."
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET, { algorithms: ["HS256"] });

    // Ensure user still exists in live MySQL database and fetch fresh role
    const users = await query(
      "SELECT id, username, email, role, full_name, created_at FROM users WHERE id = ?",
      [decoded.sub]
    );

    if (users.length === 0) {
      return res.status(401).json({
        success: false,
        error: "User account associated with this token no longer exists."
      });
    }

    // Attach safe user details with authoritative live role from database
    req.user = users[0];
    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      error: "Invalid, tampered, or expired authorization token."
    });
  }
}

/**
 * Role-Based Access Control Authorization Middleware
 * @param  {...string} allowedRoles - 'student', 'faculty', 'admin'
 */
function authorizeRoles(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: "Authentication required to access this resource."
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: `Access forbidden: Role '${req.user.role}' is not authorized to access this resource.`,
        requiredRoles: allowedRoles,
        currentRole: req.user.role
      });
    }

    next();
  };
}

module.exports = {
  JWT_SECRET,
  JWT_EXPIRES_IN,
  authenticateToken,
  authorizeRoles,
  checkLoginThrottle,
  recordFailedLogin,
  clearLoginThrottle
};
