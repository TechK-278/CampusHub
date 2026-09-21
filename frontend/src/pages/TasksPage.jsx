import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckSquare, Square, Plus, Trash2 } from "lucide-react";

export function TasksPage() {
  const [tasks, setTasks] = useState([
    { id: 1, text: "Revise Unit 2 notes for CS502 DBMS Mid-Sem", completed: false, tag: "Study" },
    { id: 2, text: "Verify CS501 Practical 1 server demonstration scripts", completed: true, tag: "Practical" },
    { id: 3, text: "Submit mentor meeting acknowledgment form", completed: false, tag: "Administrative" },
    { id: 4, text: "Download IEEE research paper for Seminar topic", completed: false, tag: "Research" },
  ]);
  const [inputVal, setInputVal] = useState("");

  const toggleTask = (id) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const addTask = (e) => {
    e.preventDefault();
    if (!inputVal.trim()) return;
    setTasks([...tasks, { id: Date.now(), text: inputVal.trim(), completed: false, tag: "General" }]);
    setInputVal("");
  };

  const removeTask = (id) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">Academic Task Planner</h1>
          <p className="text-xs text-slate-500">Personal study items, reminders, and lab preparation checklist</p>
        </div>
        <Badge variant="secondary" className="text-xs">{tasks.filter(t => !t.completed).length} Pending</Badge>
      </div>

      <Card>
        <CardHeader className="p-4 pb-2">
          <CardTitle className="text-sm font-semibold">Add Quick Checklist Item</CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-2">
          <form onSubmit={addTask} className="flex gap-2">
            <input
              type="text"
              placeholder="e.g., Read Computer Networks Chapter 4 on Routing..."
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              className="flex-1 rounded-md border border-slate-200 px-3 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-blue-600"
            />
            <Button type="submit" size="sm" className="text-xs gap-1">
              <Plus className="h-3.5 w-3.5" /> Add Task
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0 divide-y divide-slate-100">
          {tasks.map((task) => (
            <div key={task.id} className="flex items-center justify-between p-3.5 hover:bg-slate-50/75 transition-colors">
              <div className="flex items-center gap-3 cursor-pointer select-none" onClick={() => toggleTask(task.id)}>
                {task.completed ? (
                  <CheckSquare className="h-4 w-4 text-emerald-600" />
                ) : (
                  <Square className="h-4 w-4 text-slate-400" />
                )}
                <span className={`text-xs ${task.completed ? "line-through text-slate-400" : "text-slate-800 font-medium"}`}>
                  {task.text}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="text-[10px]">{task.tag}</Badge>
                <button
                  onClick={() => removeTask(task.id)}
                  className="text-slate-400 hover:text-rose-600 p-1"
                  aria-label="Delete task"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
