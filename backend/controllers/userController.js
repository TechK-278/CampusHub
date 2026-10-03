/**
 * CampusHub — User Management Controller (Admin Only)
 * Practical 9: User Administration & RBAC Management
 */

const bcrypt = require("bcryptjs");
const { query } = require("../config/db");

const VALID_ROLES = ["student", "faculty", "admin"];

/**
 * GET /api/users
 * Admin Only: List all users with optional search/role filters
 */
exports.getUsers = async (req, res) => {
  try {
    const { role, search } = req.query || {};
    let sql = "SELECT id, username, email, role, full_name, created_at, updated_at FROM users WHERE 1=1";
    const params = [];

    if (role && VALID_ROLES.includes(role)) {
      sql += " AND role = ?";
      params.push(role);
    }

    if (search && search.trim()) {
      const pattern = `%${search.trim()}%`;
      sql += " AND (username LIKE ? OR email LIKE ? OR full_name LIKE ?)";
      params.push(pattern, pattern, pattern);
    }

    sql += " ORDER BY id ASC";

    const users = await query(sql, params);

    res.status(200).json({
      success: true,
      count: users.length,
      users
    });
  } catch (error) {
    console.error("Error in getUsers:", error.message);
    res.status(500).json({
      success: false,
      error: "Database error while fetching users."
    });
  }
};

/**
 * POST /api/users
 * Admin Only: Create new user account with hashed password
 */
exports.createUser = async (req, res) => {
  try {
    const { username, email, password, role, full_name } = req.body || {};

    // Validation
    if (!username || !email || !password || !role || !full_name) {
      return res.status(400).json({
        success: false,
        error: "All fields are required: username, email, password, role, full_name."
      });
    }

    const cleanUsername = username.trim().toLowerCase();
    const cleanEmail = email.trim().toLowerCase();
    const cleanFullName = full_name.trim();

    if (!/^[a-zA-Z0-9._-]{3,50}$/.test(cleanUsername)) {
      return res.status(400).json({
        success: false,
        error: "Username must be 3-50 alphanumeric characters (dots, underscores, dashes allowed)."
      });
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      return res.status(400).json({
        success: false,
        error: "Invalid email address format."
      });
    }

    if (!VALID_ROLES.includes(role)) {
      return res.status(400).json({
        success: false,
        error: `Invalid role '${role}'. Allowed roles: student, faculty, admin.`
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        error: "Password must be at least 6 characters long."
      });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    const insertSql = `
      INSERT INTO users (username, email, password_hash, role, full_name)
      VALUES (?, ?, ?, ?, ?)
    `;

    const result = await query(insertSql, [
      cleanUsername,
      cleanEmail,
      passwordHash,
      role,
      cleanFullName
    ]);

    const newUser = await query(
      "SELECT id, username, email, role, full_name, created_at FROM users WHERE id = ?",
      [result.insertId]
    );

    res.status(201).json({
      success: true,
      message: "User account created successfully.",
      user: newUser[0]
    });
  } catch (error) {
    if (error.code === "ER_DUP_ENTRY") {
      return res.status(409).json({
        success: false,
        error: "Duplicate error: A user with this username or email address already exists."
      });
    }
    console.error("Error in createUser:", error.message);
    res.status(500).json({
      success: false,
      error: "Database error while creating user."
    });
  }
};

/**
 * PUT /api/users/:id
 * Admin Only: Update existing user's role and/or full name
 */
exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { full_name, email, role } = req.body || {};

    const existing = await query("SELECT * FROM users WHERE id = ?", [id]);
    if (existing.length === 0) {
      return res.status(404).json({
        success: false,
        error: `User with ID ${id} not found.`
      });
    }

    const targetUser = existing[0];

    // Check last admin protection if demoting an admin
    if (targetUser.role === "admin" && role && role !== "admin") {
      const [adminCountRow] = await query("SELECT COUNT(*) as admin_count FROM users WHERE role = 'admin'");
      if (adminCountRow.admin_count <= 1) {
        return res.status(400).json({
          success: false,
          error: "Cannot demote the last remaining administrator account."
        });
      }
    }

    const newRole = role || targetUser.role;
    if (!VALID_ROLES.includes(newRole)) {
      return res.status(400).json({
        success: false,
        error: `Invalid role '${newRole}'. Allowed roles: student, faculty, admin.`
      });
    }

    const newFullName = (full_name !== undefined ? full_name : targetUser.full_name).trim();
    const newEmail = (email !== undefined ? email : targetUser.email).trim().toLowerCase();

    if (!newFullName) {
      return res.status(400).json({
        success: false,
        error: "Full name cannot be empty."
      });
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newEmail)) {
      return res.status(400).json({
        success: false,
        error: "Invalid email address format."
      });
    }

    await query(
      "UPDATE users SET full_name = ?, email = ?, role = ? WHERE id = ?",
      [newFullName, newEmail, newRole, id]
    );

    const updated = await query(
      "SELECT id, username, email, role, full_name, created_at, updated_at FROM users WHERE id = ?",
      [id]
    );

    res.status(200).json({
      success: true,
      message: "User updated successfully.",
      user: updated[0]
    });
  } catch (error) {
    if (error.code === "ER_DUP_ENTRY") {
      return res.status(409).json({
        success: false,
        error: "Duplicate error: Email address is already in use by another user."
      });
    }
    console.error("Error in updateUser:", error.message);
    res.status(500).json({
      success: false,
      error: "Database error while updating user."
    });
  }
};

/**
 * DELETE /api/users/:id
 * Admin Only: Delete user account
 */
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const targetId = parseInt(id, 10);

    if (isNaN(targetId)) {
      return res.status(400).json({
        success: false,
        error: "Invalid user ID."
      });
    }

    // Safety 1: Cannot delete self
    if (req.user && req.user.id === targetId) {
      return res.status(400).json({
        success: false,
        error: "Action prohibited: Administrators cannot delete their own active account."
      });
    }

    const existing = await query("SELECT * FROM users WHERE id = ?", [targetId]);
    if (existing.length === 0) {
      return res.status(404).json({
        success: false,
        error: `User with ID ${targetId} not found.`
      });
    }

    const targetUser = existing[0];

    // Safety 2: Cannot delete the last remaining admin
    if (targetUser.role === "admin") {
      const [adminCountRow] = await query("SELECT COUNT(*) as admin_count FROM users WHERE role = 'admin'");
      if (adminCountRow.admin_count <= 1) {
        return res.status(400).json({
          success: false,
          error: "Action prohibited: Cannot delete the last remaining administrator account."
        });
      }
    }

    await query("DELETE FROM users WHERE id = ?", [targetId]);

    res.status(200).json({
      success: true,
      message: `User '${targetUser.username}' (${targetUser.full_name}) has been deleted successfully.`,
      deletedId: targetId
    });
  } catch (error) {
    console.error("Error in deleteUser:", error.message);
    res.status(500).json({
      success: false,
      error: "Database error while deleting user."
    });
  }
};
