/**
 * CampusHub — Authentication Controller
 * Practical 9: JWT Sign-in, User Verification, Stateless Logout, Rate Limiting
 */

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { query } = require("../config/db");
const {
  JWT_SECRET,
  JWT_EXPIRES_IN,
  checkLoginThrottle,
  recordFailedLogin,
  clearLoginThrottle
} = require("../middleware/auth");

// Constant dummy hash for constant-time comparison when user is not found
const DUMMY_HASH = "$2a$10$nOUIs5kJ7naTuTFkBy1veuK0kSxUFXfuaOKdOKf9xYT0KKGPCgg6u";

/**
 * POST /api/auth/login
 * Public endpoint: Authenticates user credentials and returns JWT Bearer token
 */
exports.login = async (req, res) => {
  try {
    const { username, password } = req.body || {};

    // 1. Validate Input Body
    if (!username || typeof username !== "string" || !username.trim()) {
      return res.status(400).json({
        success: false,
        error: "Username is required and must be a non-empty string."
      });
    }

    if (!password || typeof password !== "string" || !password.trim()) {
      return res.status(400).json({
        success: false,
        error: "Password is required."
      });
    }

    if (username.length > 50 || password.length > 100) {
      return res.status(400).json({
        success: false,
        error: "Invalid input length. Username max 50 chars, password max 100 chars."
      });
    }

    const cleanUsername = username.trim().toLowerCase();
    const clientIp = req.ip || req.connection.remoteAddress || "127.0.0.1";
    const throttleKey = `${cleanUsername}:${clientIp}`;

    // 2. Check In-Memory Throttle
    const throttleStatus = checkLoginThrottle(throttleKey);
    if (throttleStatus.isThrottled) {
      return res.status(429).json({
        success: false,
        error: `Too many failed login attempts. Account temporarily locked. Please try again in ${throttleStatus.minutesLeft} minutes.`
      });
    }

    // 3. Find User by Username (parameterized)
    const users = await query(
      "SELECT id, username, email, password_hash, role, full_name, created_at FROM users WHERE username = ?",
      [cleanUsername]
    );

    let passwordMatches = false;

    if (users.length === 0) {
      // Run dummy comparison to prevent timing-based user enumeration
      await bcrypt.compare(password, DUMMY_HASH);
      recordFailedLogin(throttleKey);
      return res.status(401).json({
        success: false,
        error: "Invalid username or password."
      });
    }

    const user = users[0];

    // 4. Compare Password Hash
    passwordMatches = await bcrypt.compare(password, user.password_hash);

    if (!passwordMatches) {
      recordFailedLogin(throttleKey);
      return res.status(401).json({
        success: false,
        error: "Invalid username or password."
      });
    }

    // 5. Successful login: Clear Throttle
    clearLoginThrottle(throttleKey);

    // 6. Sign JWT with minimal payload: sub, username, role
    const payload = {
      sub: user.id,
      username: user.username,
      role: user.role
    };

    const token = jwt.sign(payload, JWT_SECRET, {
      algorithm: "HS256",
      expiresIn: JWT_EXPIRES_IN
    });

    // 7. Return safe user response (NEVER return password_hash)
    res.status(200).json({
      success: true,
      message: "Authentication successful.",
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        full_name: user.full_name,
        created_at: user.created_at
      }
    });
  } catch (error) {
    console.error("Login controller error:", error.message);
    res.status(500).json({
      success: false,
      error: "Internal server error during authentication."
    });
  }
};

/**
 * GET /api/auth/me
 * Authenticated endpoint: Returns safe details of current active session
 */
exports.getMe = async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      user: {
        id: req.user.id,
        username: req.user.username,
        email: req.user.email,
        role: req.user.role,
        full_name: req.user.full_name,
        created_at: req.user.created_at
      }
    });
  } catch (error) {
    console.error("getMe controller error:", error.message);
    res.status(500).json({
      success: false,
      error: "Failed to retrieve user profile."
    });
  }
};

/**
 * POST /api/auth/logout
 * Authenticated endpoint: Stateless JWT logout acknowledgement
 */
exports.logout = async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      message: "Session terminated. Client must discard stored authorization token."
    });
  } catch (error) {
    console.error("Logout controller error:", error.message);
    res.status(500).json({
      success: false,
      error: "Failed to process logout."
    });
  }
};
