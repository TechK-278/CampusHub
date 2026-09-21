import React, { useState, useEffect } from "react";
import { 
  getTasks, 
  createTask, 
  updateTask, 
  deleteTask 
} from "@/services/taskService";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription, 
  DialogFooter 
} from "@/components/ui/dialog";
import { 
  CheckSquare, 
  Square, 
  Plus, 
  Trash2, 
  Calendar, 
  BookOpen, 
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  Loader2,
  RefreshCw,
  Layers,
  Inbox
} from "lucide-react";

const COURSE_OPTIONS = [
  "Full Stack Web Development",
  "Database Management Systems",
  "Computer Networks",
  "Operating Systems",
  "Design & Analysis of Algorithms",
  "General Academic"
];

export function TasksPage() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("all"); // "all" | "pending" | "completed"
  const [feedback, setFeedback] = useState(null);

  // Add Task Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    course: "Full Stack Web Development",
    dueDate: new Date().toISOString().split("T")[0]
  });
  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  // Delete Confirmation Modal State
  const [taskToDelete, setTaskToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // Load tasks on mount
  useEffect(() => {
    fetchTasksList();
  }, []);

  // Auto-clear feedback after 4 seconds
  useEffect(() => {
    if (feedback) {
      const timer = setTimeout(() => setFeedback(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [feedback]);

  const fetchTasksList = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getTasks();
      setTasks(data);
    } catch (err) {
      console.error("Failed to load tasks:", err);
      setError("Unable to load tasks from server. Please verify backend is running.");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleComplete = async (task) => {
    const newStatus = !task.completed;
    try {
      const updated = await updateTask(task.id, { completed: newStatus });
      setTasks(tasks.map(t => t.id === task.id ? updated : t));
      setFeedback({
        type: "success",
        message: newStatus ? `Task marked as completed.` : `Task moved back to pending.`
      });
    } catch (err) {
      console.error("Failed to toggle task completion:", err);
      setFeedback({
        type: "error",
        message: "Failed to update task status. Please try again."
      });
    }
  };

  const handleOpenAddModal = () => {
    setFormData({
      title: "",
      description: "",
      course: "Full Stack Web Development",
      dueDate: new Date().toISOString().split("T")[0]
    });
    setFormErrors({});
    setIsAddModalOpen(true);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.title.trim()) {
      errors.title = "Task title is required.";
    } else if (formData.title.trim().length < 3) {
      errors.title = "Title must be at least 3 characters.";
    }

    if (!formData.course.trim()) {
      errors.course = "Course is required.";
    }

    if (!formData.dueDate) {
      errors.dueDate = "Due date is required.";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setSubmitting(true);
    try {
      const created = await createTask(formData);
      setTasks(prev => [created, ...prev]);
      setIsAddModalOpen(false);
      setFeedback({
        type: "success",
        message: `Task "${created.title}" created successfully.`
      });
    } catch (err) {
      console.error("Failed to create task:", err);
      setFormErrors({ general: err.message || "Failed to create task." });
    } finally {
      setSubmitting(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!taskToDelete) return;
    setDeleting(true);
    try {
      await deleteTask(taskToDelete.id);
      setTasks(tasks.filter(t => t.id !== taskToDelete.id));
      setFeedback({
        type: "success",
        message: `Task "${taskToDelete.title}" deleted.`
      });
      setTaskToDelete(null);
    } catch (err) {
      console.error("Failed to delete task:", err);
      setFeedback({
        type: "error",
        message: "Failed to delete task from server."
      });
    } finally {
      setDeleting(false);
    }
  };

  // Metrics Calculation
  const totalCount = tasks.length;
  const pendingCount = tasks.filter(t => !t.completed).length;
  const completedCount = tasks.filter(t => t.completed).length;

  const filteredTasks = tasks.filter(task => {
    if (filter === "pending") return !task.completed;
    if (filter === "completed") return task.completed;
    return true;
  });

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Page Header (Practical 3: Responsive fluid heading & wrapping controls) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-fluid-title text-slate-900">My Tasks</h1>
            <Badge variant="secondary" className="text-xs">JSON Storage</Badge>
          </div>
          <p className="text-fluid-subtitle text-slate-500 mt-0.5">
            Manage your academic tasks, assignments, and practical deadlines
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={fetchTasksList} 
            disabled={loading}
            className="text-xs gap-1.5 h-8 sm:h-9"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
            <span className="hidden min-[380px]:inline">Refresh</span>
          </Button>
          <Button 
            size="sm" 
            onClick={handleOpenAddModal} 
            className="text-xs gap-1.5 h-8 sm:h-9"
          >
            <Plus className="h-4 w-4" />
            Add Task
          </Button>
        </div>
      </div>

      {/* Feedback Banner */}
      {feedback && (
        <div className={`p-3 rounded-lg border text-xs flex items-center justify-between transition-all ${
          feedback.type === "success" 
            ? "bg-emerald-50 border-emerald-200 text-emerald-800" 
            : "bg-rose-50 border-rose-200 text-rose-800"
        }`}>
          <div className="flex items-center gap-2">
            {feedback.type === "success" ? (
              <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle className="h-4 w-4 text-rose-600 shrink-0" />
            )}
            <span className="break-words">{feedback.message}</span>
          </div>
          <button 
            onClick={() => setFeedback(null)} 
            className="text-slate-400 hover:text-slate-600 font-bold ml-3 shrink-0"
            aria-label="Dismiss feedback"
          >
            ✕
          </button>
        </div>
      )}

      {/* Task Summary Metrics (1 col mobile, 3 cols tablet/desktop) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        <Card className="p-4 border-slate-200 w-full">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Total Tasks</span>
            <Layers className="h-4 w-4 text-slate-400" />
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-1">{totalCount}</div>
          <div className="text-[11px] text-slate-500 mt-0.5 truncate">Stored in backend/data/tasks.json</div>
        </Card>

        <Card className="p-4 border-slate-200 w-full">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Pending</span>
            <Clock className="h-4 w-4 text-amber-500" />
          </div>
          <div className="text-2xl font-bold text-amber-700 mt-1">{pendingCount}</div>
          <div className="text-[11px] text-amber-600 mt-0.5">Requires student action</div>
        </Card>

        <Card className="p-4 border-slate-200 w-full">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Completed</span>
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-bold text-emerald-700 mt-1">{completedCount}</div>
          <div className="text-[11px] text-emerald-600 mt-0.5">
            {totalCount > 0 ? `${Math.round((completedCount / totalCount) * 100)}% completion rate` : "0% completion"}
          </div>
        </Card>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setFilter("all")}
          className={`px-3 py-1.5 text-xs rounded-md font-medium transition-colors ${
            filter === "all"
              ? "bg-blue-50 text-blue-700 font-semibold border border-blue-200"
              : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          All ({totalCount})
        </button>
        <button
          onClick={() => setFilter("pending")}
          className={`px-3 py-1.5 text-xs rounded-md font-medium transition-colors ${
            filter === "pending"
              ? "bg-amber-50 text-amber-800 font-semibold border border-amber-200"
              : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          Pending ({pendingCount})
        </button>
        <button
          onClick={() => setFilter("completed")}
          className={`px-3 py-1.5 text-xs rounded-md font-medium transition-colors ${
            filter === "completed"
              ? "bg-emerald-50 text-emerald-800 font-semibold border border-emerald-200"
              : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          Completed ({completedCount})
        </button>
      </div>

      {/* Main Task List / States */}
      {loading ? (
        <Card className="p-8 text-center space-y-3">
          <Loader2 className="h-6 w-6 animate-spin text-blue-600 mx-auto" />
          <p className="text-xs text-slate-500">Loading academic tasks from server...</p>
        </Card>
      ) : error ? (
        <Card className="p-8 text-center border-rose-200 bg-rose-50/50 space-y-3">
          <AlertCircle className="h-8 w-8 text-rose-500 mx-auto" />
          <div className="space-y-1">
            <h3 className="text-sm font-semibold text-rose-900">Unable to Load Tasks</h3>
            <p className="text-xs text-rose-700">{error}</p>
          </div>
          <Button variant="outline" size="sm" onClick={fetchTasksList} className="text-xs">
            Try Again
          </Button>
        </Card>
      ) : filteredTasks.length === 0 ? (
        <Card className="p-8 sm:p-10 text-center space-y-3 border-dashed">
          <Inbox className="h-10 w-10 text-slate-300 mx-auto" />
          <div className="space-y-1">
            <h3 className="text-sm font-semibold text-slate-800">
              {filter === "all" ? "No Tasks Yet" : `No ${filter} tasks found`}
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              {filter === "all" 
                ? "Create your first academic task to track assignments, labs, and study goals."
                : `You currently have no tasks in the ${filter} state.`}
            </p>
          </div>
          {filter === "all" && (
            <Button size="sm" onClick={handleOpenAddModal} className="text-xs gap-1.5 mt-2">
              <Plus className="h-4 w-4" />
              Create Task
            </Button>
          )}
        </Card>
      ) : (
        <div className="space-y-3">
          {filteredTasks.map((task) => (
            <Card 
              key={task.id} 
              className={`transition-all hover:border-slate-300 w-full ${
                task.completed ? "bg-slate-50/70 border-slate-200" : "bg-white"
              }`}
            >
              <CardContent className="p-3.5 sm:p-5">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  {/* Left: Checkbox & Task details */}
                  <div className="flex items-start gap-2.5 sm:gap-3 flex-1 min-w-0">
                    <button
                      type="button"
                      onClick={() => handleToggleComplete(task)}
                      className="mt-0.5 text-slate-400 hover:text-blue-600 transition-colors focus:outline-none shrink-0"
                      aria-label={task.completed ? "Mark pending" : "Mark completed"}
                    >
                      {task.completed ? (
                        <CheckSquare className="h-5 w-5 text-emerald-600" />
                      ) : (
                        <Square className="h-5 w-5 text-slate-400 hover:text-slate-600" />
                      )}
                    </button>

                    <div className="space-y-1 min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                        <span className={`text-xs sm:text-sm font-semibold leading-snug break-words ${
                          task.completed ? "line-through text-slate-400" : "text-slate-900"
                        }`}>
                          {task.title}
                        </span>
                        <Badge variant="outline" className="text-[10px] font-mono shrink-0">
                          #{task.id}
                        </Badge>
                      </div>

                      {task.description && (
                        <p className={`text-xs break-words ${
                          task.completed ? "line-through text-slate-400" : "text-slate-600"
                        }`}>
                          {task.description}
                        </p>
                      )}

                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] sm:text-xs text-slate-500 pt-1">
                        <span className="flex items-center gap-1 truncate">
                          <BookOpen className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                          <span className="truncate">{task.course}</span>
                        </span>
                        <span className="flex items-center gap-1 shrink-0">
                          <Calendar className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                          Due: {task.dueDate}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right: Status Badge & Delete Trigger */}
                  <div className="flex items-center justify-between sm:justify-end gap-2 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                    <Badge 
                      variant={task.completed ? "success" : "warning"}
                      className="text-[10px]"
                    >
                      {task.completed ? "Completed" : "Pending"}
                    </Badge>

                    <button
                      type="button"
                      onClick={() => setTaskToDelete(task)}
                      className="rounded p-1 text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition-colors"
                      title="Delete task"
                      aria-label="Delete task"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Add Task Modal Dialog (Practical 3: Responsive width and viewport constraint) */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent onClose={() => setIsAddModalOpen(false)}>
          <DialogHeader>
            <DialogTitle>Add Academic Task</DialogTitle>
            <DialogDescription>
              Create a new task stored in the backend JSON database.
            </DialogDescription>
          </DialogHeader>

          {formErrors.general && (
            <div className="mb-4 rounded bg-rose-50 p-2.5 text-xs text-rose-700 border border-rose-200">
              {formErrors.general}
            </div>
          )}

          <form onSubmit={handleCreateTask} className="space-y-4">
            {/* Field: Title */}
            <div>
              <label htmlFor="task-title" className="block text-xs font-semibold text-slate-700 mb-1">
                Task Title <span className="text-rose-600">*</span>
              </label>
              <input
                id="task-title"
                name="title"
                type="text"
                value={formData.title}
                onChange={handleFormChange}
                placeholder="e.g., Complete Practical 3 Responsive Design"
                className={`w-full rounded-md border px-3 py-2 text-xs focus:outline-none focus:ring-1 ${
                  formErrors.title ? "border-rose-400 focus:ring-rose-500" : "border-slate-200 focus:ring-blue-600"
                }`}
              />
              {formErrors.title && (
                <p className="mt-1 text-[11px] text-rose-600">{formErrors.title}</p>
              )}
            </div>

            {/* Field: Course */}
            <div>
              <label htmlFor="task-course" className="block text-xs font-semibold text-slate-700 mb-1">
                Associated Course <span className="text-rose-600">*</span>
              </label>
              <select
                id="task-course"
                name="course"
                value={formData.course}
                onChange={handleFormChange}
                className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-blue-600"
              >
                {COURSE_OPTIONS.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
              {formErrors.course && (
                <p className="mt-1 text-[11px] text-rose-600">{formErrors.course}</p>
              )}
            </div>

            {/* Field: Due Date */}
            <div>
              <label htmlFor="task-dueDate" className="block text-xs font-semibold text-slate-700 mb-1">
                Due Date <span className="text-rose-600">*</span>
              </label>
              <input
                id="task-dueDate"
                name="dueDate"
                type="date"
                value={formData.dueDate}
                onChange={handleFormChange}
                className="w-full rounded-md border border-slate-200 px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-blue-600"
              />
              {formErrors.dueDate && (
                <p className="mt-1 text-[11px] text-rose-600">{formErrors.dueDate}</p>
              )}
            </div>

            {/* Field: Description */}
            <div>
              <label htmlFor="task-description" className="block text-xs font-semibold text-slate-700 mb-1">
                Description (Optional)
              </label>
              <textarea
                id="task-description"
                name="description"
                rows={3}
                value={formData.description}
                onChange={handleFormChange}
                placeholder="Details, lab manual references, or submission instructions..."
                className="w-full rounded-md border border-slate-200 px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-blue-600"
              />
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setIsAddModalOpen(false)}
                disabled={submitting}
                className="text-xs"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                size="sm"
                disabled={submitting}
                className="text-xs gap-1.5"
              >
                {submitting && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                Create Task
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal Dialog */}
      <Dialog open={!!taskToDelete} onOpenChange={() => !deleting && setTaskToDelete(null)}>
        <DialogContent onClose={() => !deleting && setTaskToDelete(null)}>
          <DialogHeader>
            <DialogTitle className="text-rose-600 flex items-center gap-2">
              <AlertCircle className="h-5 w-5 shrink-0" />
              Confirm Task Deletion
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this task? This action will permanently remove it from the backend JSON storage.
            </DialogDescription>
          </DialogHeader>

          {taskToDelete && (
            <div className="p-3 bg-slate-50 rounded-md border border-slate-100 text-xs space-y-1">
              <p className="font-semibold text-slate-900 break-words">{taskToDelete.title}</p>
              <p className="text-slate-500">{taskToDelete.course} • Due: {taskToDelete.dueDate}</p>
            </div>
          )}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setTaskToDelete(null)}
              disabled={deleting}
              className="text-xs"
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              size="sm"
              onClick={handleConfirmDelete}
              disabled={deleting}
              className="text-xs gap-1.5"
            >
              {deleting && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
              Delete Task
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
