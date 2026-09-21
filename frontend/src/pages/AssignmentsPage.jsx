import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { mockAssignments } from "@/data/mockData";
import { FileText, Calendar, Upload, CheckCircle2 } from "lucide-react";

export function AssignmentsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">Assignments & Lab Submissions</h1>
          <p className="text-xs text-slate-500">Continuous Evaluation & Practical Work for Semester 5</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="warning" className="text-xs">3 Action Required</Badge>
        </div>
      </div>

      <div className="space-y-3">
        {mockAssignments.map((assignment) => (
          <Card key={assignment.id} className="hover:border-slate-300 transition-colors">
            <CardContent className="p-4 sm:p-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                      {assignment.courseCode}
                    </span>
                    <h3 className="text-sm font-semibold text-slate-900">{assignment.title}</h3>
                  </div>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500 pt-1">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5 text-slate-400" /> Due: {assignment.dueDate} at {assignment.dueTime}
                    </span>
                    <span>Max Marks: {assignment.totalMarks}</span>
                    <Badge variant={assignment.badgeVariant} className="text-[10px]">
                      {assignment.status}
                    </Badge>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                  <Button variant="outline" size="sm" className="text-xs">
                    View Problem Statement
                  </Button>
                  <Button size="sm" className="text-xs gap-1.5">
                    <Upload className="h-3.5 w-3.5" /> Submit File
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
