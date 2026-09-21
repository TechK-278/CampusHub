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
import { Calendar, UserCheck, Sparkles } from "lucide-react";

export function DashboardPage({ onNavigate }) {
  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Welcome Banner (Practical 3: Responsive fluid typography & adaptive layout) */}
      <div className="rounded-lg border border-slate-200 bg-white p-4 sm:p-5 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              {/* Practical 3: text-fluid-title uses clamp() with vw units */}
              <h1 className="text-fluid-title text-slate-900">
                Welcome back, {mockStudent.name}
              </h1>
              <Badge variant="default" className="text-[10px] sm:text-[11px]">
                Active Term
              </Badge>
            </div>
            <p className="text-fluid-subtitle text-slate-600">
              {mockStudent.program} • {mockStudent.division} ({mockStudent.batch}) • Roll No: <span className="font-mono font-semibold">{mockStudent.rollNo}</span>
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-[11px] sm:text-xs text-slate-600 bg-slate-50 p-2 sm:p-2.5 rounded-md border border-slate-100 self-start md:self-auto">
            <div className="flex items-center gap-1.5">
              <UserCheck className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-blue-600 shrink-0" />
              <span>Mentor: <strong>{mockStudent.mentor}</strong></span>
            </div>
            <span className="hidden sm:inline text-slate-300">|</span>
            <div className="flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-slate-500 shrink-0" />
              <span>Academic Session: <strong>{mockStudent.academicYear}</strong></span>
            </div>
          </div>
        </div>
      </div>

      {/* Primary Academic Metrics (1 col mobile, 2 cols tablet, 4 cols desktop) */}
      <section aria-label="Academic Statistics">
        <StatCards stats={mockStats} />
      </section>

      {/* Main Content Grid: Schedule & Assignments (Stacks on mobile/tablet, 7-5 split on desktop) */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6">
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

      {/* Secondary Content Grid: Notices & Activity */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6">
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
