import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText, Calendar, ArrowRight, CheckCircle } from "lucide-react";

export function AssignmentsWidget({ assignments, onViewAll }) {
  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <div>
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <FileText className="h-4 w-4 text-blue-600" />
            Upcoming Assignments
          </CardTitle>
          <CardDescription>Tasks requiring submission</CardDescription>
        </div>
        <Button variant="ghost" size="sm" onClick={onViewAll} className="text-xs text-blue-600 hover:text-blue-700">
          View all
          <ArrowRight className="ml-1 h-3 w-3" />
        </Button>
      </CardHeader>
      <CardContent className="space-y-3">
        {assignments.map((assignment) => (
          <div
            key={assignment.id}
            className="flex items-center justify-between p-3 rounded-lg border border-slate-100 bg-white hover:border-slate-300 transition-colors"
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded">
                  {assignment.courseCode}
                </span>
                <span className="text-xs font-semibold text-slate-900 line-clamp-1">
                  {assignment.title}
                </span>
              </div>
              <div className="flex items-center gap-3 text-[11px] text-slate-500">
                <span className="flex items-center gap-1">
                  <Calendar className="h-3 w-3 text-slate-400" />
                  Due: {assignment.dueDate} at {assignment.dueTime}
                </span>
                <span>•</span>
                <span>Max: {assignment.totalMarks} Marks</span>
              </div>
            </div>

            <div className="shrink-0 pl-2">
              <Badge variant={assignment.badgeVariant} className="text-[10px]">
                {assignment.status}
              </Badge>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
