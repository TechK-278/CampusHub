import React, { useMemo } from "react";
import { cn } from "@/lib/utils";

/**
 * WeeklyTimetable — CSS Grid-based weekly class schedule
 * Practical 6: Demonstrates Tailwind CSS grid, responsive variants,
 * hover/focus-visible states, group variants, and conditional styling.
 */

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const PERIODS = [
  { num: 1, time: "09:15–10:15" },
  { num: 2, time: "10:30–11:30" },
  { num: 3, time: "11:45–12:45" },
  { num: 4, time: "13:00–14:00" },
  { num: 5, time: "14:00–16:00" },
];

const TYPE_STYLES = {
  Lecture: "bg-blue-50 border-blue-200 text-blue-800",
  Lab: "bg-emerald-50 border-emerald-200 text-emerald-800",
  Tutorial: "bg-amber-50 border-amber-200 text-amber-800",
};

const TYPE_BADGE = {
  Lecture: "bg-blue-100 text-blue-700",
  Lab: "bg-emerald-100 text-emerald-700",
  Tutorial: "bg-amber-100 text-amber-700",
};

export function WeeklyTimetable({ timetable, division }) {
  // Build lookup: day+period → entry
  const grid = useMemo(() => {
    const map = {};
    timetable.forEach((entry) => {
      const key = `${entry.day}-${entry.period}`;
      map[key] = entry;
    });
    return map;
  }, [timetable]);

  const visibleDays = DAYS;

  return (
    <div className="space-y-4">
      {/* Desktop: Full grid layout (hidden below lg) */}
      <div className="hidden lg:block overflow-x-auto">
        <div
          className="grid gap-px bg-slate-200 rounded-lg overflow-hidden border border-slate-200"
          style={{
            gridTemplateColumns: `120px repeat(${PERIODS.length}, 1fr)`,
            gridTemplateRows: `auto repeat(${visibleDays.length}, 1fr)`,
          }}
        >
          {/* Header row */}
          <div className="bg-slate-100 p-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
            {division}
          </div>
          {PERIODS.map((p) => (
            <div
              key={p.num}
              className="bg-slate-100 p-3 text-center"
            >
              <div className="text-xs font-semibold text-slate-700">Period {p.num}</div>
              <div className="text-[10px] text-slate-500 mt-0.5">{p.time}</div>
            </div>
          ))}

          {/* Day rows */}
          {visibleDays.map((day) => (
            <React.Fragment key={day}>
              <div className="bg-slate-50 p-3 flex items-center">
                <span className="text-xs font-semibold text-slate-700">{day}</span>
              </div>
              {PERIODS.map((p) => {
                const entry = grid[`${day}-${p.num}`];
                return (
                  <div
                    key={`${day}-${p.num}`}
                    className={cn(
                      "bg-white p-2 min-h-[72px] transition-colors",
                      entry ? "group hover:bg-slate-50" : ""
                    )}
                  >
                    {entry ? (
                      <div className={cn(
                        "h-full rounded-md border p-2",
                        TYPE_STYLES[entry.type] || "bg-slate-50 border-slate-200 text-slate-700"
                      )}>
                        <div className="flex items-start justify-between gap-1">
                          <span className="text-[11px] font-bold">{entry.courseCode}</span>
                          <span className={cn(
                            "rounded px-1.5 py-0.5 text-[9px] font-semibold shrink-0",
                            TYPE_BADGE[entry.type] || "bg-slate-100 text-slate-600"
                          )}>
                            {entry.type}
                          </span>
                        </div>
                        <p className="text-[10px] font-medium mt-1 leading-tight truncate group-hover:whitespace-normal">
                          {entry.courseName}
                        </p>
                        <p className="text-[9px] opacity-70 mt-0.5">{entry.room}</p>
                      </div>
                    ) : (
                      <div className="h-full flex items-center justify-center">
                        <span className="text-[10px] text-slate-300">—</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Mobile/Tablet: Stacked day-by-day list (visible below lg) */}
      <div className="lg:hidden space-y-4">
        {visibleDays.map((day) => {
          const dayEntries = timetable
            .filter((e) => e.day === day)
            .sort((a, b) => a.period - b.period);

          return (
            <div key={day} className="bg-white rounded-lg border border-slate-200 overflow-hidden">
              <div className="bg-slate-50 px-4 py-2 border-b border-slate-200">
                <span className="text-xs font-semibold text-slate-700">{day}</span>
                <span className="text-[10px] text-slate-500 ml-2">
                  {dayEntries.length} class{dayEntries.length !== 1 ? "es" : ""}
                </span>
              </div>
              {dayEntries.length === 0 ? (
                <div className="px-4 py-6 text-center">
                  <span className="text-xs text-slate-400">No classes scheduled</span>
                </div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {dayEntries.map((entry) => (
                    <div key={`${entry.day}-${entry.period}`} className="px-4 py-3 hover:bg-slate-50 transition-colors">
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-900">{entry.courseCode}</span>
                          <span className={cn(
                            "rounded px-1.5 py-0.5 text-[9px] font-semibold",
                            TYPE_BADGE[entry.type] || "bg-slate-100 text-slate-600"
                          )}>
                            {entry.type}
                          </span>
                        </div>
                        <span className="text-[10px] text-slate-500">{entry.time}</span>
                      </div>
                      <p className="text-xs text-slate-700">{entry.courseName}</p>
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-[10px] text-slate-500">{entry.room}</span>
                        <span className="text-[10px] text-slate-500">{entry.faculty}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
