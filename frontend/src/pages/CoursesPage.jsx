import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { mockCourses } from "@/data/mockData";
import { BookOpen, User, Clock, CheckCircle2 } from "lucide-react";

export function CoursesPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">Enrolled Courses</h1>
          <p className="text-xs text-slate-500">Semester 5 Course Registration & Faculty Directory</p>
        </div>
        <Badge variant="secondary" className="self-start sm:self-auto">5 Total Courses</Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {mockCourses.map((course) => (
          <Card key={course.code} className="hover:border-slate-300 transition-colors">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                  {course.code}
                </span>
                <span className="text-xs font-medium text-slate-500">{course.credits} Credits</span>
              </div>
              <CardTitle className="text-base font-semibold mt-1.5">{course.name}</CardTitle>
              <CardDescription className="flex items-center gap-1.5 pt-1">
                <User className="h-3.5 w-3.5 text-slate-400" />
                {course.faculty}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 pt-2 text-xs border-t border-slate-100">
              <div className="flex items-center justify-between">
                <span className="text-slate-500 flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5 text-slate-400" /> Timetable
                </span>
                <span className="font-medium text-slate-800">{course.schedule}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Current Attendance</span>
                <span className="font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                  {course.attendance}
                </span>
              </div>
              <div className="space-y-1 pt-1">
                <div className="flex justify-between text-[11px] text-slate-500">
                  <span>Syllabus Covered</span>
                  <span>{course.syllabusProgress}%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-1.5">
                  <div className="bg-blue-600 h-1.5 rounded-full" style={{ width: `${course.syllabusProgress}%` }}></div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
