import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { mockStudent } from "@/data/mockData";
import { User, Mail, GraduationCap, Building2, Phone, ShieldCheck, Award, Calendar, BookOpen } from "lucide-react";

export function ProfilePage() {
  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-fluid-title text-slate-900">Student Profile</h1>
          <p className="text-fluid-subtitle text-slate-500">Official Enrollment & Academic Identity Record</p>
        </div>
        <Badge variant="success" className="text-xs self-start sm:self-auto">Enrolled & Active</Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Left Column: Student Identity Card (Practical 3: Responsive width & media) */}
        <Card className="lg:col-span-1 text-center p-5 sm:p-6 w-full max-w-full">
          {/* Responsive Profile Avatar / Media Container */}
          <div className="mx-auto flex h-20 w-20 sm:h-24 sm:w-24 items-center justify-center rounded-full bg-blue-100 text-blue-700 text-2xl sm:text-3xl font-bold border-2 border-blue-200 shadow-2xs transition-all">
            {mockStudent.initials}
          </div>

          <h2 className="mt-3 text-base sm:text-lg font-bold text-slate-900 leading-tight">
            {mockStudent.name}
          </h2>
          <p className="font-mono text-xs text-blue-700 bg-blue-50 py-0.5 px-2.5 rounded-full inline-block mt-1 border border-blue-100">
            {mockStudent.rollNo}
          </p>

          <div className="mt-4 border-t border-slate-100 pt-4 text-xs text-slate-600 space-y-1.5 text-left sm:text-center">
            <p className="truncate"><strong>Program:</strong> {mockStudent.program}</p>
            <p className="truncate"><strong>Department:</strong> {mockStudent.department}</p>
            <p><strong>Semester:</strong> {mockStudent.semester} ({mockStudent.division})</p>
          </div>
        </Card>

        {/* Right Column: Academic Information */}
        <Card className="lg:col-span-2 w-full max-w-full">
          <CardHeader className="pb-3 p-4 sm:p-6">
            <CardTitle className="text-base font-semibold">Academic & Administrative Information</CardTitle>
            <CardDescription>Verified institution records for current term</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-xs p-4 sm:p-6 pt-0">
            {/* Grid of info items: 1 col on mobile, 2 cols on tablet/desktop */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                <span className="text-slate-400 block text-[11px]">Official Email</span>
                <span className="font-medium text-slate-800 break-all">{mockStudent.email}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                <span className="text-slate-400 block text-[11px]">Assigned Faculty Mentor</span>
                <span className="font-medium text-slate-800">{mockStudent.mentor}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                <span className="text-slate-400 block text-[11px]">Batch Allocation</span>
                <span className="font-medium text-slate-800">{mockStudent.division} - {mockStudent.batch}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                <span className="text-slate-400 block text-[11px]">Academic Session</span>
                <span className="font-medium text-slate-800">{mockStudent.academicYear} (Odd Term)</span>
              </div>
            </div>

            <div className="p-3 sm:p-4 bg-blue-50/50 rounded-lg border border-blue-100 flex items-start gap-2.5">
              <ShieldCheck className="h-4 w-4 text-blue-600 shrink-0 mt-0.5" />
              <div className="text-[11px] text-blue-900 leading-relaxed">
                <strong>Academic Verification Notice:</strong> This profile reflects active enrollment in B.Tech Semester 5. All attendance records, grades, and task statuses are synchronized with the central CampusHub academic database.
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
