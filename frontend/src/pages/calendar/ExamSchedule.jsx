import React, { useState, useMemo } from "react";
import { cn } from "@/lib/utils";

/**
 * ExamSchedule — Exam timetable with filters
 * Practical 6: Demonstrates Tailwind table styling, responsive horizontal scroll,
 * conditional badge variants, hover states, and filter interactions.
 */

const EXAM_TYPES = ["All", "Mid-Semester", "End-Semester"];

export function ExamSchedule({ exams }) {
  const [typeFilter, setTypeFilter] = useState("All");
  const [deptFilter, setDeptFilter] = useState("All");

  const departments = useMemo(() => {
    const depts = [...new Set(exams.map((e) => e.department))];
    return ["All", ...depts.sort()];
  }, [exams]);

  const filtered = useMemo(() => {
    return exams.filter((exam) => {
      if (typeFilter !== "All" && exam.type !== typeFilter) return false;
      if (deptFilter !== "All" && exam.department !== deptFilter) return false;
      return true;
    }).sort((a, b) => new Date(a.date) - new Date(b.date));
  }, [exams, typeFilter, deptFilter]);

  const typeBadge = (type) => {
    if (type === "Mid-Semester") return "bg-amber-100 text-amber-700";
    if (type === "End-Semester") return "bg-red-100 text-red-700";
    return "bg-slate-100 text-slate-600";
  };

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-slate-500 shrink-0">Type:</span>
          <div className="flex gap-1.5 flex-wrap">
            {EXAM_TYPES.map((t) => (
              <button
                key={t}
                onClick={() => setTypeFilter(t)}
                className={cn(
                  "rounded-md px-2.5 py-1 text-[11px] font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500",
                  typeFilter === t
                    ? "bg-blue-600 text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200 active:bg-slate-300"
                )}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-slate-500 shrink-0">Dept:</span>
          <select
            value={deptFilter}
            onChange={(e) => setDeptFilter(e.target.value)}
            className="rounded-md border border-slate-200 bg-white px-2.5 py-1 text-[11px] text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {departments.map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-lg border border-slate-200">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-slate-500">Code</th>
              <th className="px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-slate-500">Course</th>
              <th className="px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-slate-500 hidden sm:table-cell">Date</th>
              <th className="px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-slate-500 hidden md:table-cell">Time</th>
              <th className="px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-slate-500 hidden lg:table-cell">Room</th>
              <th className="px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-slate-500">Type</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-xs text-slate-400">
                  No examinations match the selected filters.
                </td>
              </tr>
            ) : (
              filtered.map((exam, idx) => (
                <tr
                  key={`${exam.courseCode}-${exam.date}-${idx}`}
                  className="hover:bg-slate-50 transition-colors"
                >
                  <td className="px-4 py-3 text-xs font-semibold text-slate-900">{exam.courseCode}</td>
                  <td className="px-4 py-3">
                    <div className="text-xs text-slate-800">{exam.courseName}</div>
                    {/* Show date inline on mobile since column is hidden */}
                    <div className="text-[10px] text-slate-500 mt-0.5 sm:hidden">
                      {new Date(exam.date).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-xs text-slate-600 hidden sm:table-cell">
                    {new Date(exam.date).toLocaleDateString("en-IN", { weekday: "short", day: "2-digit", month: "short" })}
                  </td>
                  <td className="px-4 py-3 text-xs text-slate-600 hidden md:table-cell">{exam.time}</td>
                  <td className="px-4 py-3 text-xs text-slate-500 hidden lg:table-cell">{exam.room}</td>
                  <td className="px-4 py-3">
                    <span className={cn("rounded px-2 py-0.5 text-[10px] font-semibold", typeBadge(exam.type))}>
                      {exam.type}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <p className="text-[10px] text-slate-400 text-right">
        Showing {filtered.length} of {exams.length} examination{exams.length !== 1 ? "s" : ""}
      </p>
    </div>
  );
}
