/**
 * CampusHub — Express Backend Server
 * Phase 1: Foundation & Health Check API
 */

const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = process.env.PORT || 5000;

// Standard Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Root Route
app.get("/", (req, res) => {
  res.json({
    application: "CampusHub",
    subtitle: "College Management Portal",
    version: "1.0.0",
    phase: "Phase 1 - Foundation",
    documentation: "/api/health"
  });
});

// API Health Check Route (Required by Phase 1 spec)
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    application: "CampusHub"
  });
});

// Task Management Routes (Phase 2)
const taskRoutes = require("./routes/taskRoutes");
app.use("/api/tasks", taskRoutes);

// Optional Read-only Demo Data Endpoint
app.get("/api/demo-data", (req, res) => {
  try {
    const demoDataPath = path.join(__dirname, "data", "demo.json");
    const data = JSON.parse(fs.readFileSync(demoDataPath, "utf8"));
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: "Failed to read demo data", message: error.message });
  }
});

// Start Server if executed directly
if (require.main === module) {
  app.listen(PORT, () => {
    console.log("==================================================");
    console.log(` CampusHub Backend Server running on port ${PORT}`);
    console.log(` - Health API : http://localhost:${PORT}/api/health`);
    console.log(` - Root API   : http://localhost:${PORT}/`);
    console.log("==================================================");
  });
}

module.exports = app;
