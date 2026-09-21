import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { mockCourses } from "@/data/mockData";
import { CalendarCheck, ShieldCheck, AlertCircle } from "lucide-react";

export function AttendancePage() {
  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-fluid-title text-slate-900">Attendance Overview</h1>
          <p className="text-fluid-subtitle text-slate-500">Semester 5 Session Attendance Records (Mandatory minimum: 85%)</p>
        </div>
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <Badge variant="success" className="text-xs px-2.5 py-1 flex items-center gap-1">
            <ShieldCheck className="h-3.5 w-3.5" /> Exam Eligible (88.4% Aggregate)
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        <Card className="p-4">
          <div className="text-xs text-slate-500 font-medium">Total Classes Held</div>
          <div className="text-2xl font-bold text-slate-900 mt-1">112</div>
          <div className="text-[11px] text-slate-500 mt-0.5">Across all 5 subjects</div>
        </Card>
        <Card className="p-4">
          <div className="text-xs text-slate-500 font-medium">Classes Attended</div>
          <div className="text-2xl font-bold text-emerald-700 mt-1">99</div>
          <div className="text-[11px] text-slate-500 mt-0.5">Present & Lab Verified</div>
        </Card>
        <Card className="p-4">
          <div className="text-xs text-slate-500 font-medium">Leave / Absence</div>
          <div className="text-2xl font-bold text-amber-700 mt-1">13</div>
          <div className="text-[11px] text-slate-500 mt-0.5">Approved medical: 8</div>
        </Card>
      </div>

      <Card className="w-full">
        <CardHeader className="p-4 sm:p-6 pb-3">
          <CardTitle className="text-base font-semibold">Subject-wise Breakdown</CardTitle>
          <CardDescription>Official attendance status per enrolled course</CardDescription>
        </CardHeader>
        {/* Practical 3: Contained horizontal scroll area for table on mobile viewports */}
        <CardContent className="overflow-x-auto p-0 w-full">
          <table className="w-full min-w-[620px] text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-slate-600 font-semibold">
                <th className="py-3 px-4">Course Code</th>
                <th className="py-3 px-4">Course Title</th>
                <th className="py-3 px-4">Faculty</th>
                <th className="py-3 px-4">Classes (Attended / Total)</th>
                <th className="py-3 px-4">Percentage</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {mockCourses.map((c) => (
                <tr key={c.code} className="hover:bg-slate-50/75 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-blue-700">{c.code}</td>
                  <td className="py-3 px-4 font-medium text-slate-900">{c.name}</td>
                  <td className="py-3 px-4 text-slate-500">{c.faculty}</td>
                  <td className="py-3 px-4">{Math.round(24 * (parseFloat(c.attendance) / 100))} / 24</td>
                  <td className="py-3 px-4 font-semibold">{c.attendance}</td>
                  <td className="py-3 px-4">
                    <Badge variant={parseFloat(c.attendance) >= 85 ? "success" : "warning"} className="text-[10px]">
                      {parseFloat(c.attendance) >= 85 ? "Regular" : "Low Attendance"}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
