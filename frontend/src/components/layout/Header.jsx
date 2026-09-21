import React, { useState } from "react";
import { 
  Search, 
  Bell, 
  Menu, 
  GraduationCap, 
  ChevronDown,
  User,
  LogOut,
  Settings,
  ShieldCheck,
  X
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function Header({ student, onToggleMobileMenu }) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-200 bg-white/95 px-3 sm:px-6 backdrop-blur">
      {/* Mobile Search Overlay when expanded */}
      {mobileSearchOpen ? (
        <div className="flex flex-1 items-center gap-2 md:hidden">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Search courses, tasks, notices..."
              autoFocus
              className="h-9 w-full rounded-md border border-slate-200 bg-slate-50 pl-9 pr-3 text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
            />
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setMobileSearchOpen(false)}
            className="h-9 px-2 text-xs"
            aria-label="Close search"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <>
          {/* Left section: Mobile menu trigger + Portal brand title on small screens */}
          <div className="flex items-center gap-2 sm:gap-3">
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden text-slate-600 h-9 w-9 shrink-0"
              onClick={onToggleMobileMenu}
              aria-label="Toggle navigation menu"
            >
              <Menu className="h-5 w-5" />
            </Button>

            <div className="flex items-center gap-2 lg:hidden">
              <div className="flex h-8 w-8 items-center justify-center rounded-md bg-blue-600 text-white font-bold shrink-0">
                <GraduationCap className="h-5 w-5" />
              </div>
              <div className="hidden min-[380px]:block">
                <h1 className="text-sm font-bold tracking-tight text-slate-900 leading-tight">CampusHub</h1>
                <p className="text-[10px] text-slate-500 font-medium leading-none">College Portal</p>
              </div>
            </div>

            {/* Desktop Global Academic Search */}
            <div className="hidden md:flex relative items-center w-64 lg:w-80 xl:w-96">
              <Search className="absolute left-3 h-4 w-4 text-slate-400 pointer-events-none" />
              <input
                type="text"
                placeholder="Search courses, assignments, notices..."
                className="h-9 w-full rounded-md border border-slate-200 bg-slate-50 pl-9 pr-12 text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600 transition-colors"
              />
              <kbd className="absolute right-2.5 top-2 hidden h-5 select-none items-center gap-1 rounded border border-slate-200 bg-white px-1.5 font-mono text-[10px] font-medium text-slate-400 lg:flex">
                ⌘K
              </kbd>
            </div>
          </div>

          {/* Right section: Mobile Search Trigger, Academic Session, Notifications, Profile */}
          <div className="flex items-center gap-1.5 sm:gap-3">
            {/* Mobile Search Button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden text-slate-600 h-8 w-8"
              onClick={() => setMobileSearchOpen(true)}
              aria-label="Open search"
            >
              <Search className="h-4 w-4" />
            </Button>

            {/* Academic Session Indicator (Hidden on small mobile) */}
            <div className="hidden sm:flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs text-slate-600">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
              <span className="font-medium text-slate-700">Odd Sem 2025-26</span>
            </div>

            {/* Notifications Dropdown */}
            <div className="relative">
              <Button
                variant="ghost"
                size="icon"
                className="relative text-slate-600 hover:text-slate-900 h-8 w-8 sm:h-9 sm:w-9"
                onClick={() => {
                  setShowNotifications(!showNotifications);
                  setShowProfileMenu(false);
                }}
                aria-label="Notifications"
              >
                <Bell className="h-4 w-4 sm:h-5 sm:w-5" />
                <span className="absolute top-1 right-1 flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-400 opacity-75"></span>
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-blue-600"></span>
                </span>
              </Button>

              {showNotifications && (
                <div className="absolute right-0 mt-2 w-72 sm:w-80 rounded-lg border border-slate-200 bg-white p-3 shadow-lg z-50 text-left">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-2">
                    <span className="text-xs font-semibold text-slate-900">Notifications (2)</span>
                    <span className="text-[11px] text-blue-600 hover:underline cursor-pointer">Mark all read</span>
                  </div>
                  <div className="space-y-2">
                    <div className="rounded-md bg-slate-50 p-2.5 text-xs">
                      <div className="font-semibold text-slate-900">Mid-Sem Timetable Published</div>
                      <div className="text-[11px] text-slate-500 mt-0.5">Exam schedule for Sem 5 is now available.</div>
                      <span className="text-[10px] text-slate-400 mt-1 block">15 mins ago</span>
                    </div>
                    <div className="rounded-md bg-slate-50 p-2.5 text-xs">
                      <div className="font-semibold text-slate-900">Practical 2 Task Verified</div>
                      <div className="text-[11px] text-slate-500 mt-0.5">JSON task manager ready for evaluation.</div>
                      <span className="text-[10px] text-slate-400 mt-1 block">1 hour ago</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowProfileMenu(!showProfileMenu);
                  setShowNotifications(false);
                }}
                className="flex items-center gap-1.5 sm:gap-2.5 rounded-lg p-1 hover:bg-slate-100 transition-colors focus:outline-none"
                aria-label="Student Profile Menu"
              >
                <Avatar className="h-7 w-7 sm:h-8 sm:w-8 border border-slate-300 shrink-0">
                  <AvatarFallback className="text-[11px]">{student.initials}</AvatarFallback>
                </Avatar>
                <div className="hidden md:block text-left">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-semibold text-slate-900">{student.name}</span>
                    <Badge variant="secondary" className="px-1.5 py-0 text-[10px]">Sem {student.semester}</Badge>
                  </div>
                  <span className="text-[11px] text-slate-500 block leading-tight">{student.rollNo}</span>
                </div>
                <ChevronDown className="hidden md:block h-3.5 w-3.5 text-slate-400" />
              </button>

              {showProfileMenu && (
                <div className="absolute right-0 mt-2 w-56 sm:w-60 rounded-lg border border-slate-200 bg-white p-2 shadow-lg z-50 text-left">
                  <div className="border-b border-slate-100 p-2 pb-3">
                    <p className="text-xs font-semibold text-slate-900">{student.name}</p>
                    <p className="text-[11px] text-slate-500 truncate">{student.email}</p>
                    <div className="mt-1 flex items-center gap-1 text-[11px] text-emerald-600">
                      <ShieldCheck className="h-3.5 w-3.5" />
                      <span>Student Portal (Verified)</span>
                    </div>
                  </div>
                  <div className="py-1 space-y-0.5">
                    <button className="flex w-full items-center gap-2 rounded px-2 py-1.5 text-xs text-slate-700 hover:bg-slate-50">
                      <User className="h-3.5 w-3.5 text-slate-500" /> Academic Profile
                    </button>
                    <button className="flex w-full items-center gap-2 rounded px-2 py-1.5 text-xs text-slate-700 hover:bg-slate-50">
                      <Settings className="h-3.5 w-3.5 text-slate-500" /> Portal Preferences
                    </button>
                  </div>
                  <div className="border-t border-slate-100 pt-1 mt-1">
                    <button className="flex w-full items-center gap-2 rounded px-2 py-1.5 text-xs text-rose-600 hover:bg-rose-50 font-medium">
                      <LogOut className="h-3.5 w-3.5" /> Sign Out (Demo)
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </header>
  );
}
