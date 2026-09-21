/**
 * CampusHub — Task API Service
 * Phase 2: Frontend Client Service for Task Operations
 */

const API_BASE_URL = "/api/tasks";

/**
 * Fetch all academic tasks from backend JSON storage
 */
export async function getTasks() {
  const response = await fetch(API_BASE_URL);
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `Failed to fetch tasks (HTTP ${response.status})`);
  }
  const data = await response.json();
  return data.tasks || [];
}

/**
 * Fetch a single task by ID
 */
export async function getTaskById(id) {
  const response = await fetch(`${API_BASE_URL}/${id}`);
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `Failed to fetch task ${id}`);
  }
  const data = await response.json();
  return data.task;
}

/**
 * Create a new task in backend JSON storage
 * @param {Object} taskData - { title, description, course, dueDate }
 */
export async function createTask(taskData) {
  const response = await fetch(API_BASE_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(taskData),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `Failed to create task (HTTP ${response.status})`);
  }

  const data = await response.json();
  return data.task;
}

/**
 * Update an existing task
 * @param {number} id - Task ID
 * @param {Object} updates - { completed, title, description, course, dueDate }
 */
export async function updateTask(id, updates) {
  const response = await fetch(`${API_BASE_URL}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updates),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `Failed to update task ${id}`);
  }

  const data = await response.json();
  return data.task;
}

/**
 * Delete a task by ID
 * @param {number} id - Task ID
 */
export async function deleteTask(id) {
  const response = await fetch(`${API_BASE_URL}/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `Failed to delete task ${id}`);
  }

  const data = await response.json();
  return data.deletedTask;
}
