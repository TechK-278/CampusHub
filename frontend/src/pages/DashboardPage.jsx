import React from "react";
import { StatCards } from "@/components/dashboard/StatCards";
import { ScheduleWidget } from "@/components/dashboard/ScheduleWidget";
import { AssignmentsWidget } from "@/components/dashboard/AssignmentsWidget";
import { NoticesWidget } from "@/components/dashboard/NoticesWidget";
import { ActivityWidget } from "@/components/dashboard/ActivityWidget";
import { Badge } from "@/components/ui/badge";
import { 
  mockStudent, 
  mockStats, 
  mockSchedule, 
  mockAssignments, 
  mockNotices, 
  mockActivities 
} from "@/data/mockData";
import { Sparkles, Calendar, BookOpen, UserCheck } from "lucide-react";

export function DashboardPage({ onNavigate }) {
  return (
    <div className="space-y-6">
      {/* Welcome Banner (Restrained Academic Style) */}
      <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold tracking-tight text-slate-900">
                Welcome back, {mockStudent.name}
              </h1>
              <Badge variant="default" className="text-[11px]">
                Active Term
              </Badge>
            </div>
            <p className="text-xs text-slate-600 mt-1">
              {mockStudent.program} • {mockStudent.division} ({mockStudent.batch}) • Roll No: <span className="font-mono font-semibold">{mockStudent.rollNo}</span>
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs text-slate-600 bg-slate-50 p-2.5 rounded-md border border-slate-100">
            <div className="flex items-center gap-1.5">
              <UserCheck className="h-4 w-4 text-blue-600" />
              <span>Mentor: <strong>{mockStudent.mentor}</strong></span>
            </div>
            <span className="hidden sm:inline text-slate-300">|</span>
            <div className="flex items-center gap-1.5">
              <Calendar className="h-4 w-4 text-slate-500" />
              <span>Academic Year: <strong>{mockStudent.academicYear}</strong></span>
            </div>
          </div>
        </div>
      </div>

      {/* Primary Academic Metrics */}
      <section aria-label="Academic Statistics">
        <StatCards stats={mockStats} />
      </section>

      {/* Main Content Grid: Schedule & Assignments */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7">
          <ScheduleWidget schedule={mockSchedule} />
        </div>
        <div className="lg:col-span-5">
          <AssignmentsWidget 
            assignments={mockAssignments} 
            onViewAll={() => onNavigate("assignments")} 
          />
        </div>
      </section>

      {/* Secondary Content Grid: Notices & Recent Activity */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7">
          <NoticesWidget 
            notices={mockNotices} 
            onViewAll={() => onNavigate("notices")} 
          />
        </div>
        <div className="lg:col-span-5">
          <ActivityWidget activities={mockActivities} />
        </div>
      </section>
    </div>
  );
}
