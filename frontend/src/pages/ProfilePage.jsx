import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { mockStudent } from "@/data/mockData";
import { User, Mail, GraduationCap, Building2, Phone, ShieldCheck, Award } from "lucide-react";

export function ProfilePage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">Student Profile</h1>
          <p className="text-xs text-slate-500">Official Enrollment & Identification Record</p>
        </div>
        <Badge variant="success" className="text-xs">Enrolled & Active</Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1 text-center p-6">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-blue-100 text-blue-700 text-2xl font-bold border-2 border-blue-200">
            {mockStudent.initials}
          </div>
          <h2 className="mt-3 text-base font-bold text-slate-900">{mockStudent.name}</h2>
          <p className="font-mono text-xs text-blue-700 bg-blue-50 py-0.5 px-2 rounded inline-block mt-1">
            {mockStudent.rollNo}
          </p>
          <div className="mt-4 border-t border-slate-100 pt-4 text-xs text-slate-600 space-y-1">
            <p><strong>Program:</strong> {mockStudent.program}</p>
            <p><strong>Department:</strong> {mockStudent.department}</p>
            <p><strong>Semester:</strong> {mockStudent.semester} ({mockStudent.division})</p>
          </div>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold">Academic & Administrative Information</CardTitle>
            <CardDescription>Verified institution records for current term</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                <span className="text-slate-400 block text-[11px]">Official Email</span>
                <span className="font-medium text-slate-800">{mockStudent.email}</span>
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

            <div className="p-3 bg-blue-50/50 rounded-lg border border-blue-100 flex items-start gap-2.5">
              <ShieldCheck className="h-4 w-4 text-blue-600 shrink-0 mt-0.5" />
              <div className="text-[11px] text-blue-900 leading-relaxed">
                <strong>Academic Verification Notice:</strong> This profile reflects active enrollment in B.Tech Semester 5. All attendance, grades, and task statuses are synchronized with the central CampusHub academic records.
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
