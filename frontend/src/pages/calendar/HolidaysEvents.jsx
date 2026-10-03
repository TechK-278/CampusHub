import React, { useState, useMemo } from "react";
import { cn } from "@/lib/utils";

/**
 * HolidaysEvents — Semester holidays and events list
 * Practical 6: Demonstrates Tailwind card layout, responsive grid,
 * peer-checked filter pattern, disabled states, and conditional type styling.
 */

const TYPE_FILTERS = [
  { value: "all", label: "All" },
  { value: "holiday", label: "Holidays" },
  { value: "event", label: "Events" },
  { value: "exam-break", label: "Exam Breaks" },
];

const TYPE_CONFIG = {
  holiday: { bg: "bg-red-50", border: "border-red-200", badge: "bg-red-100 text-red-700", dot: "bg-red-400" },
  event: { bg: "bg-blue-50", border: "border-blue-200", badge: "bg-blue-100 text-blue-700", dot: "bg-blue-400" },
  "exam-break": { bg: "bg-amber-50", border: "border-amber-200", badge: "bg-amber-100 text-amber-700", dot: "bg-amber-400" },
};

export function HolidaysEvents({ holidays }) {
  const [activeFilter, setActiveFilter] = useState("all");

  const filtered = useMemo(() => {
    const items = activeFilter === "all"
      ? holidays
      : holidays.filter((h) => h.type === activeFilter);
    return items.sort((a, b) => new Date(a.date) - new Date(b.date));
  }, [holidays, activeFilter]);

  // Group by month
  const grouped = useMemo(() => {
    const groups = {};
    filtered.forEach((item) => {
      const d = new Date(item.date);
      const monthKey = d.toLocaleDateString("en-IN", { month: "long", year: "numeric" });
      if (!groups[monthKey]) groups[monthKey] = [];
      groups[monthKey].push(item);
    });
    return groups;
  }, [filtered]);

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString("en-IN", {
      weekday: "short",
      day: "2-digit",
      month: "short",
    });
  };

  const isPast = (dateStr) => new Date(dateStr) < new Date();

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        {TYPE_FILTERS.map((f) => (
          <button
            key={f.value}
            onClick={() => setActiveFilter(f.value)}
            className={cn(
              "rounded-md px-3 py-1.5 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-1",
              activeFilter === f.value
                ? "bg-blue-600 text-white"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Events grouped by month */}
      {Object.keys(grouped).length === 0 ? (
        <div className="rounded-lg border border-slate-200 bg-white py-12 text-center">
          <p className="text-xs text-slate-400">No events match the selected filter.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(grouped).map(([month, items]) => (
            <div key={month}>
              <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
                {month}
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {items.map((item) => {
                  const config = TYPE_CONFIG[item.type] || TYPE_CONFIG.event;
                  const past = isPast(item.date);
                  return (
                    <div
                      key={`${item.date}-${item.name}`}
                      className={cn(
                        "rounded-lg border p-4 transition-colors",
                        config.bg,
                        config.border,
                        past ? "opacity-60" : "hover:shadow-sm"
                      )}
                    >
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="flex items-center gap-2">
                          <span className={cn("h-2 w-2 rounded-full shrink-0", config.dot)} />
                          <span className="text-xs font-semibold text-slate-900 leading-tight">
                            {item.name}
                          </span>
                        </div>
                        <span className={cn(
                          "rounded px-1.5 py-0.5 text-[9px] font-semibold shrink-0 capitalize",
                          config.badge
                        )}>
                          {item.type === "exam-break" ? "Exam" : item.type}
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-600 leading-relaxed mb-2">
                        {item.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-medium text-slate-500">
                          {formatDate(item.date)}
                        </span>
                        {past && (
                          <span className="text-[9px] text-slate-400 italic">Passed</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      <p className="text-[10px] text-slate-400 text-right">
        {filtered.length} event{filtered.length !== 1 ? "s" : ""} this semester
      </p>
    </div>
  );
}
