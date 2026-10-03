import React, { useState } from "react";
import { CalendarDays, Grid3X3, BookOpenCheck, PartyPopper } from "lucide-react";
import { cn } from "@/lib/utils";
import { mockTimetable, mockExamSchedule, mockHolidays } from "@/data/mockData";
import { WeeklyTimetable } from "./WeeklyTimetable";
import { ExamSchedule } from "./ExamSchedule";
import { HolidaysEvents } from "./HolidaysEvents";

/**
 * AcademicCalendarPage — Academic Calendar & Timetable Module
 * Practical 6: Tailwind CSS
 *
 * Demonstrates real usage of Tailwind utilities for layout, responsive design,
 * state variants, CSS Grid, Flexbox, and component composition — through
 * a genuine academic scheduling interface rather than a utility showcase.
 */

const TABS = [
  { id: "timetable", label: "Timetable", icon: Grid3X3 },
  { id: "exams", label: "Exam Schedule", icon: BookOpenCheck },
  { id: "holidays", label: "Holidays & Events", icon: PartyPopper },
];

export function AcademicCalendarPage() {
  const [activeTab, setActiveTab] = useState("timetable");
  const [division, setDivision] = useState("A");

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <CalendarDays className="h-5 w-5 text-blue-600" />
            <h1 className="text-lg font-bold text-slate-900">Academic Calendar</h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Semester 5, 2025–2026
          </p>
        </div>

        {/* Division picker — only visible on timetable tab */}
        {activeTab === "timetable" && (
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-slate-500">Division:</span>
            {["A", "B"].map((d) => (
              <button
                key={d}
                onClick={() => setDivision(d)}
                className={cn(
                  "rounded-md px-3 py-1.5 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-1",
                  division === d
                    ? "bg-blue-600 text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                )}
              >
                Div {d}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Tab navigation */}
      <div className="flex gap-1 rounded-lg bg-slate-100 p-1">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex items-center gap-2 rounded-md px-4 py-2 text-xs font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500",
                isActive
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-500 hover:text-slate-700"
              )}
            >
              <Icon className={cn("h-3.5 w-3.5", isActive ? "text-blue-600" : "text-slate-400")} />
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab content */}
      <div>
        {activeTab === "timetable" && (
          <WeeklyTimetable timetable={mockTimetable} division={`Division ${division}`} />
        )}
        {activeTab === "exams" && (
          <ExamSchedule exams={mockExamSchedule} />
        )}
        {activeTab === "holidays" && (
          <HolidaysEvents holidays={mockHolidays} />
        )}
      </div>
    </div>
  );
}
