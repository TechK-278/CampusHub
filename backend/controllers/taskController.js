/**
 * CampusHub — Task Controller
 * Phase 2: JSON File-Based CRUD Operations
 */

const fs = require("fs");
const path = require("path");

const tasksFilePath = path.join(__dirname, "..", "data", "tasks.json");

/**
 * Helper: Safely reads and parses tasks.json
 */
function readTasksFile() {
  if (!fs.existsSync(tasksFilePath)) {
    const initialData = { tasks: [] };
    fs.writeFileSync(tasksFilePath, JSON.stringify(initialData, null, 2), "utf8");
    return initialData;
  }
  const raw = fs.readFileSync(tasksFilePath, "utf8");
  try {
    return JSON.parse(raw);
  } catch (err) {
    console.error("Error parsing tasks.json:", err.message);
    return { tasks: [] };
  }
}

/**
 * Helper: Safely writes tasks data to tasks.json with 2-space indentation
 */
function writeTasksFile(data) {
  fs.writeFileSync(tasksFilePath, JSON.stringify(data, null, 2), "utf8");
}

/**
 * GET /api/tasks
 * Retrieves all tasks
 */
exports.getAllTasks = (req, res) => {
  try {
    const data = readTasksFile();
    res.json({
      success: true,
      count: data.tasks.length,
      tasks: data.tasks
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Unable to retrieve tasks from JSON storage.",
      error: error.message
    });
  }
};

/**
 * GET /api/tasks/:id
 * Retrieves a single task by ID
 */
exports.getTaskById = (req, res) => {
  try {
    const taskId = parseInt(req.params.id, 10);
    if (isNaN(taskId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid task ID format. Must be an integer."
      });
    }

    const data = readTasksFile();
    const task = data.tasks.find((t) => t.id === taskId);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: `Task with ID ${taskId} not found.`
      });
    }

    res.json({
      success: true,
      task
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching task.",
      error: error.message
    });
  }
};

/**
 * POST /api/tasks
 * Creates a new task and appends it to tasks.json
 */
exports.createTask = (req, res) => {
  try {
    const { title, description, course, dueDate } = req.body;

    // Validation: Title is required
    if (!title || typeof title !== "string" || !title.trim()) {
      return res.status(400).json({
        success: false,
        message: "Task title is required."
      });
    }

    // Validation: Course is required
    if (!course || typeof course !== "string" || !course.trim()) {
      return res.status(400).json({
        success: false,
        message: "Course name is required."
      });
    }

    const data = readTasksFile();

    // Generate unique sequential ID
    const maxId = data.tasks.reduce((max, t) => (t.id > max ? t.id : max), 0);
    const newTask = {
      id: maxId + 1,
      title: title.trim(),
      description: description ? description.trim() : "",
      course: course.trim(),
      dueDate: dueDate || new Date().toISOString().split("T")[0],
      completed: false,
      createdAt: new Date().toISOString()
    };

    data.tasks.push(newTask);
    writeTasksFile(data);

    res.status(201).json({
      success: true,
      message: "Task created successfully.",
      task: newTask
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create task in JSON storage.",
      error: error.message
    });
  }
};

/**
 * PUT /api/tasks/:id
 * Updates an existing task by ID (completion status, title, description, course, dueDate)
 */
exports.updateTask = (req, res) => {
  try {
    const taskId = parseInt(req.params.id, 10);
    if (isNaN(taskId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid task ID format."
      });
    }

    const data = readTasksFile();
    const taskIndex = data.tasks.findIndex((t) => t.id === taskId);

    if (taskIndex === -1) {
      return res.status(404).json({
        success: false,
        message: `Task with ID ${taskId} not found.`
      });
    }

    const existingTask = data.tasks[taskIndex];
    const { title, description, course, dueDate, completed } = req.body;

    // Apply partial updates
    if (typeof completed === "boolean") {
      existingTask.completed = completed;
    }
    if (typeof title === "string" && title.trim()) {
      existingTask.title = title.trim();
    }
    if (typeof description === "string") {
      existingTask.description = description.trim();
    }
    if (typeof course === "string" && course.trim()) {
      existingTask.course = course.trim();
    }
    if (typeof dueDate === "string" && dueDate.trim()) {
      existingTask.dueDate = dueDate.trim();
    }

    existingTask.updatedAt = new Date().toISOString();

    data.tasks[taskIndex] = existingTask;
    writeTasksFile(data);

    res.json({
      success: true,
      message: "Task updated successfully.",
      task: existingTask
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update task.",
      error: error.message
    });
  }
};

/**
 * DELETE /api/tasks/:id
 * Deletes a task by ID from tasks.json
 */
exports.deleteTask = (req, res) => {
  try {
    const taskId = parseInt(req.params.id, 10);
    if (isNaN(taskId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid task ID format."
      });
    }

    const data = readTasksFile();
    const taskIndex = data.tasks.findIndex((t) => t.id === taskId);

    if (taskIndex === -1) {
      return res.status(404).json({
        success: false,
        message: `Task with ID ${taskId} not found.`
      });
    }

    const deletedTask = data.tasks.splice(taskIndex, 1)[0];
    writeTasksFile(data);

    res.json({
      success: true,
      message: "Task deleted successfully.",
      deletedTask
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete task.",
      error: error.message
    });
  }
};
