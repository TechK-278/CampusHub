import React, { useState } from "react";
import { StatCards } from "@/components/dashboard/StatCards";
import { ScheduleWidget } from "@/components/dashboard/ScheduleWidget";
import { AssignmentsWidget } from "@/components/dashboard/AssignmentsWidget";
import { NoticesWidget } from "@/components/dashboard/NoticesWidget";
import { ActivityWidget } from "@/components/dashboard/ActivityWidget";
import { LocationWidget } from "@/components/dashboard/LocationWidget";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  mockStudent, 
  mockStats, 
  mockSchedule, 
  mockAssignments, 
  mockNotices, 
  mockActivities 
} from "@/data/mockData";
import { Calendar, UserCheck, SlidersHorizontal, RotateCcw } from "lucide-react";
import { 
  getStorageItem, 
  setStorageItem, 
  STORAGE_KEYS, 
  resetCampusHubPreferences 
} from "@/lib/storage";

export function DashboardPage({ onNavigate }) {
  // Practical 4: User Preference for Compact Dashboard stored in Local Storage
  const [compactView, setCompactView] = useState(() => 
    getStorageItem(STORAGE_KEYS.COMPACT_DASHBOARD, false)
  );
  const [preferenceFeedback, setPreferenceFeedback] = useState("");

  const toggleCompactView = () => {
    const newValue = !compactView;
    setCompactView(newValue);
    setStorageItem(STORAGE_KEYS.COMPACT_DASHBOARD, newValue);
    setPreferenceFeedback(newValue ? "Compact dashboard enabled (saved to Local Storage)" : "Detailed dashboard enabled (saved to Local Storage)");
    setTimeout(() => setPreferenceFeedback(""), 3000);
  };

  const handleResetPreferences = () => {
    resetCampusHubPreferences();
    setCompactView(false);
    setPreferenceFeedback("Local Storage preferences reset to defaults.");
    setTimeout(() => setPreferenceFeedback(""), 3000);
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Welcome Banner (Practical 3: Responsive fluid typography & adaptive layout) */}
      <div className="rounded-lg border border-slate-200 bg-white p-4 sm:p-5 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
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
              <span>Session: <strong>{mockStudent.academicYear}</strong></span>
            </div>
          </div>
        </div>

        {/* Practical 4: Local Storage Preference Controls Bar */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2">
            <Button
              variant={compactView ? "secondary" : "outline"}
              size="sm"
              onClick={toggleCompactView}
              className="h-7 text-[11px] gap-1.5 px-2.5"
            >
              <SlidersHorizontal className="h-3 w-3" />
              {compactView ? "Compact View: ON" : "Compact View: OFF"}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleResetPreferences}
              className="h-7 text-[11px] gap-1 px-2 text-slate-500 hover:text-slate-800"
              title="Reset Local Storage preferences"
            >
              <RotateCcw className="h-3 w-3" />
              Reset Preferences
            </Button>
          </div>

          {preferenceFeedback && (
            <span className="text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              {preferenceFeedback}
            </span>
          )}
        </div>
      </div>

      {/* Primary Academic Metrics */}
      <section aria-label="Academic Statistics">
        <StatCards stats={mockStats} compact={compactView} />
      </section>

      {/* Main Content Grid: Schedule, Assignments, and Geolocation */}
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

      {/* Secondary Content Grid: Notices, Geolocation Widget & Activity */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-4 sm:gap-6">
        <div className="lg:col-span-4 md:col-span-1">
          {/* Practical 4: Browser Geolocation Widget */}
          <LocationWidget />
        </div>
        <div className="lg:col-span-4 md:col-span-1">
          <NoticesWidget 
            notices={mockNotices} 
            onViewAll={() => onNavigate("notices")} 
          />
        </div>
        <div className="lg:col-span-4 md:col-span-2">
          <ActivityWidget activities={mockActivities} />
        </div>
      </section>
    </div>
  );
}
