import React from "react";
import {
  LayoutDashboard,
  BookOpen,
  CalendarCheck2,
  FileText,
  Award,
  BellRing,
  CheckSquare,
  UserCircle,
  GraduationCap,
  Sparkles,
  Server
} from "lucide-react";
import { cn } from "@/lib/utils";

export const navigationItems = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "courses", label: "Courses", icon: BookOpen },
  { id: "attendance", label: "Attendance", icon: CalendarCheck2 },
  { id: "assignments", label: "Assignments", icon: FileText, badge: "3" },
  { id: "results", label: "Results", icon: Award },
  { id: "notices", label: "Notices", icon: BellRing, badge: "New" },
  { id: "tasks", label: "Tasks", icon: CheckSquare },
  { id: "profile", label: "Profile", icon: UserCircle },
];

export function Sidebar({ activeTab, onSelectTab, isMobile, onCloseMobile }) {
  return (
    <aside className={cn(
      "flex flex-col border-r border-slate-200 bg-white select-none",
      isMobile ? "w-72 h-full" : "w-64 shrink-0 hidden lg:flex min-h-screen"
    )}>
      {/* Brand Header */}
      <div className="flex h-16 items-center gap-3 border-b border-slate-200 px-6">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 text-white shadow-sm">
          <GraduationCap className="h-5 w-5" />
        </div>
        <div>
          <div className="flex items-center gap-1.5">
            <span className="text-base font-bold tracking-tight text-slate-900 leading-none">CampusHub</span>
          </div>
          <span className="text-[11px] font-medium text-slate-500 block leading-tight mt-0.5">College Management Portal</span>
        </div>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        <div className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
          Academic Modules
        </div>
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                onSelectTab(item.id);
                if (isMobile && onCloseMobile) {
                  onCloseMobile();
                }
              }}
              className={cn(
                "flex w-full items-center justify-between rounded-md px-3 py-2 text-xs font-medium transition-colors text-left",
                isActive
                  ? "bg-blue-50 text-blue-700 font-semibold border-l-4 border-blue-600 pl-2 rounded-l-none"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              )}
            >
              <div className="flex items-center gap-3">
                <Icon className={cn("h-4 w-4 shrink-0", isActive ? "text-blue-600" : "text-slate-400")} />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span className={cn(
                  "rounded px-1.5 py-0.5 text-[10px] font-semibold",
                  isActive ? "bg-blue-100 text-blue-700" : "bg-slate-100 text-slate-600"
                )}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Footer System Box */}
      <div className="p-4 border-t border-slate-200 bg-slate-50/75">
        <div className="rounded-md border border-slate-200 bg-white p-3 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-700 flex items-center gap-1.5">
              <Server className="h-3 w-3 text-emerald-500" />
              Phase 1 Shell
            </span>
            <span className="inline-flex items-center rounded-full bg-emerald-50 px-1.5 py-0.2 text-[10px] font-medium text-emerald-700 border border-emerald-200">
              Active
            </span>
          </div>
          <p className="mt-1 text-[10px] text-slate-500">
            Node.js + Express API Connected
          </p>
        </div>
      </div>
    </aside>
  );
}
