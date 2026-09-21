import React, { useState } from "react";
import {
  Palette,
  LayoutGrid,
  Layers,
  Sparkles,
  MousePointerClick,
  Table as TableIcon,
  CheckCircle2,
  AlertCircle,
  Clock,
  BookOpen,
  GraduationCap,
  Sliders,
  Eye,
  Code2,
  Smartphone,
  Tablet,
  Laptop,
  Monitor
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

// Fictional academic demo records for data table
const DEMO_ACADEMIC_COURSES = [
  {
    code: "CS501",
    title: "Full Stack Web Development",
    faculty: "Prof. Sanjay Patel",
    credits: 4,
    type: "Core Theory + Lab",
    attendance: "92%",
    status: "Active"
  },
  {
    code: "CS502",
    title: "Database Management Systems",
    faculty: "Dr. Ananya Roy",
    credits: 4,
    type: "Core Theory + Lab",
    attendance: "88%",
    status: "Active"
  },
  {
    code: "CS503",
    title: "Computer Networks",
    faculty: "Prof. Vikram Joshi",
    credits: 4,
    type: "Core Theory",
    attendance: "85%",
    status: "Active"
  },
  {
    code: "CS504",
    title: "Operating Systems",
    faculty: "Dr. Neha Verma",
    credits: 3,
    type: "Core Theory",
    attendance: "94%",
    status: "Completed"
  },
  {
    code: "CS505",
    title: "Design & Analysis of Algorithms",
    faculty: "Prof. Harish Nair",
    credits: 4,
    type: "Core Theory + Lab",
    attendance: "78%",
    status: "Warning"
  }
];

export function TailwindDemoPage() {
  const [activeTab, setActiveTab] = useState("all"); // all, utilities, grid-flex, states, components
  const [activeBreakpoint, setActiveBreakpoint] = useState("all");
  const [interactiveInput, setInteractiveInput] = useState("");
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [selectedItemForInspector, setSelectedItemForInspector] = useState({
    title: "Metric Stat Card",
    classes: "rounded-lg border border-slate-200 bg-white p-4 shadow-2xs transition-all hover:border-blue-300 hover:shadow-xs"
  });

  return (
    <div className="space-y-6">
      
      {/* 1. Header Banner — Responsive Flex & Typography */}
      <div className="flex flex-col gap-3 rounded-lg border border-slate-200 bg-white p-5 sm:flex-row sm:items-center sm:justify-between shadow-2xs">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-0.5 text-xs font-semibold text-blue-700 border border-blue-200">
              Practical 6
            </span>
            <span className="inline-flex items-center rounded-md bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-700 border border-slate-200">
              Tailwind CSS Engine v3.4
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
            Tailwind CSS Design System & Utility Demonstration
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 max-w-3xl leading-relaxed">
            Practical 6 demonstrates utility-first CSS, multi-breakpoint responsive modifiers (<code className="font-mono text-xs text-blue-600">sm:</code>, <code className="font-mono text-xs text-blue-600">md:</code>, <code className="font-mono text-xs text-blue-600">lg:</code>, <code className="font-mono text-xs text-blue-600">xl:</code>), flexbox alignment, CSS grid layouts, interactive state variants, and reusable component compositions.
          </p>
        </div>

        {/* Action badge */}
        <div className="shrink-0 pt-2 sm:pt-0">
          <div className="flex items-center gap-2 rounded-md bg-slate-50 border border-slate-200 p-2 text-xs text-slate-600">
            <Sparkles className="h-4 w-4 text-blue-600 shrink-0" />
            <span className="font-medium">Primary Styling Engine</span>
          </div>
        </div>
      </div>

      {/* 2. Interactive Navigation Tabs for Practical 6 */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-2">
        {[
          { id: "all", label: "All Demonstrations", icon: Layers },
          { id: "utilities", label: "1. Utility-First Tokens", icon: Palette },
          { id: "grid-flex", label: "2. Flexbox & CSS Grid", icon: LayoutGrid },
          { id: "states", label: "3. State Variants", icon: MousePointerClick },
          { id: "components", label: "4. Reusable Components & Tables", icon: TableIcon },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                isActive
                  ? "bg-blue-600 text-white shadow-2xs font-semibold"
                  : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              <Icon className={`h-3.5 w-3.5 ${isActive ? "text-white" : "text-slate-400"}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* ============================================================
       * SECTION 1: UTILITY-FIRST STYLING (Colors, Typography, Spacing, Elevation)
       * ============================================================ */}
      {(activeTab === "all" || activeTab === "utilities") && (
        <Card className="border-slate-200 shadow-2xs">
          <CardHeader className="pb-3 border-b border-slate-100">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2">
                  <Palette className="h-4 w-4 text-blue-600" />
                  1. Utility-First Design Tokens
                </CardTitle>
                <CardDescription className="text-xs text-slate-500 mt-0.5">
                  Tailwind provides atomic utility classes for consistent colors, typography, spacing, borders, and shadows without custom CSS overhead.
                </CardDescription>
              </div>
              <Badge variant="outline" className="text-[10px] font-mono">
                Tokens & Hierarchy
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="pt-4 space-y-6">
            
            {/* Color Tokens Matrix */}
            <div className="space-y-2">
              <span className="text-xs font-semibold text-slate-700 uppercase tracking-wider block">
                A. Academic Color Palette Utilities
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                <div 
                  onClick={() => setSelectedItemForInspector({
                    title: "Primary Blue Utility",
                    classes: "bg-blue-600 text-white rounded-md p-3 font-semibold"
                  })}
                  className="cursor-pointer rounded-md border border-slate-200 bg-white p-3 hover:border-blue-400 transition-colors"
                >
                  <div className="h-7 w-full rounded bg-blue-600 mb-2 shadow-2xs"></div>
                  <span className="text-xs font-semibold text-slate-900 block">Primary Blue</span>
                  <span className="text-[10px] font-mono text-slate-500">bg-blue-600</span>
                </div>

                <div 
                  onClick={() => setSelectedItemForInspector({
                    title: "Secondary Slate Utility",
                    classes: "bg-slate-800 text-white rounded-md p-3 font-semibold"
                  })}
                  className="cursor-pointer rounded-md border border-slate-200 bg-white p-3 hover:border-slate-400 transition-colors"
                >
                  <div className="h-7 w-full rounded bg-slate-800 mb-2 shadow-2xs"></div>
                  <span className="text-xs font-semibold text-slate-900 block">Dark Slate</span>
                  <span className="text-[10px] font-mono text-slate-500">bg-slate-800</span>
                </div>

                <div 
                  onClick={() => setSelectedItemForInspector({
                    title: "Success Emerald Utility",
                    classes: "bg-emerald-600 text-white rounded-md p-3 font-semibold"
                  })}
                  className="cursor-pointer rounded-md border border-slate-200 bg-white p-3 hover:border-emerald-400 transition-colors"
                >
                  <div className="h-7 w-full rounded bg-emerald-600 mb-2 shadow-2xs"></div>
                  <span className="text-xs font-semibold text-slate-900 block">Success Emerald</span>
                  <span className="text-[10px] font-mono text-slate-500">bg-emerald-600</span>
                </div>

                <div 
                  onClick={() => setSelectedItemForInspector({
                    title: "Warning Amber Utility",
                    classes: "bg-amber-500 text-white rounded-md p-3 font-semibold"
                  })}
                  className="cursor-pointer rounded-md border border-slate-200 bg-white p-3 hover:border-amber-400 transition-colors"
                >
                  <div className="h-7 w-full rounded bg-amber-500 mb-2 shadow-2xs"></div>
                  <span className="text-xs font-semibold text-slate-900 block">Warning Amber</span>
                  <span className="text-[10px] font-mono text-slate-500">bg-amber-500</span>
                </div>

                <div 
                  onClick={() => setSelectedItemForInspector({
                    title: "Destructive Rose Utility",
                    classes: "bg-rose-600 text-white rounded-md p-3 font-semibold"
                  })}
                  className="cursor-pointer rounded-md border border-slate-200 bg-white p-3 hover:border-rose-400 transition-colors"
                >
                  <div className="h-7 w-full rounded bg-rose-600 mb-2 shadow-2xs"></div>
                  <span className="text-xs font-semibold text-slate-900 block">Destructive Rose</span>
                  <span className="text-[10px] font-mono text-slate-500">bg-rose-600</span>
                </div>

                <div 
                  onClick={() => setSelectedItemForInspector({
                    title: "Subtle Neutral Surface Utility",
                    classes: "bg-slate-50 text-slate-700 border border-slate-200 rounded-md p-3"
                  })}
                  className="cursor-pointer rounded-md border border-slate-200 bg-white p-3 hover:border-slate-400 transition-colors"
                >
                  <div className="h-7 w-full rounded bg-slate-100 border border-slate-200 mb-2 shadow-2xs"></div>
                  <span className="text-xs font-semibold text-slate-900 block">Neutral Surface</span>
                  <span className="text-[10px] font-mono text-slate-500">bg-slate-100</span>
                </div>
              </div>
            </div>

            {/* Typography & Spacing Scale */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              
              {/* Typography Scale */}
              <div className="rounded-lg border border-slate-200 bg-slate-50/50 p-4 space-y-3">
                <span className="text-xs font-semibold text-slate-700 uppercase tracking-wider block">
                  B. Typography Utilities
                </span>
                <div className="space-y-2">
                  <div className="flex items-center justify-between border-b border-slate-200/60 pb-1.5">
                    <span className="text-lg font-bold text-slate-900">Heading Large</span>
                    <code className="text-[11px] font-mono text-slate-500">text-lg font-bold</code>
                  </div>
                  <div className="flex items-center justify-between border-b border-slate-200/60 pb-1.5">
                    <span className="text-sm font-semibold text-slate-800">Section Subtitle</span>
                    <code className="text-[11px] font-mono text-slate-500">text-sm font-semibold</code>
                  </div>
                  <div className="flex items-center justify-between border-b border-slate-200/60 pb-1.5">
                    <span className="text-xs font-normal text-slate-600">Standard Body Copy</span>
                    <code className="text-[11px] font-mono text-slate-500">text-xs font-normal</code>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">Metadata Code</span>
                    <code className="text-[11px] font-mono text-slate-500">text-[10px] font-mono</code>
                  </div>
                </div>
              </div>

              {/* Elevation & Border Radius Scale */}
              <div className="rounded-lg border border-slate-200 bg-slate-50/50 p-4 space-y-3">
                <span className="text-xs font-semibold text-slate-700 uppercase tracking-wider block">
                  C. Elevation, Borders & Radius
                </span>
                <div className="grid grid-cols-2 gap-2.5">
                  <div className="rounded-md border border-slate-200 bg-white p-2.5 shadow-2xs text-center">
                    <span className="text-xs font-medium text-slate-700 block">Subtle Elevation</span>
                    <span className="text-[10px] font-mono text-slate-400">shadow-2xs border</span>
                  </div>
                  <div className="rounded-lg border border-slate-200 bg-white p-2.5 shadow-xs text-center">
                    <span className="text-xs font-medium text-slate-700 block">Card Elevation</span>
                    <span className="text-[10px] font-mono text-slate-400">shadow-xs rounded-lg</span>
                  </div>
                  <div className="rounded-xl border border-slate-200 bg-white p-2.5 shadow-sm text-center">
                    <span className="text-xs font-medium text-slate-700 block">Popover Elevation</span>
                    <span className="text-[10px] font-mono text-slate-400">shadow-sm rounded-xl</span>
                  </div>
                  <div className="rounded-full border border-blue-200 bg-blue-50/70 p-2.5 text-center">
                    <span className="text-xs font-medium text-blue-700 block">Pill Badge Shape</span>
                    <span className="text-[10px] font-mono text-blue-500">rounded-full</span>
                  </div>
                </div>
              </div>

            </div>

          </CardContent>
        </Card>
      )}

      {/* ============================================================
       * SECTION 2: RESPONSIVE UTILITIES & BREAKPOINTS (sm:, md:, lg:, xl:)
       * ============================================================ */}
      {(activeTab === "all" || activeTab === "grid-flex") && (
        <Card className="border-slate-200 shadow-2xs">
          <CardHeader className="pb-3 border-b border-slate-100">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2">
                  <LayoutGrid className="h-4 w-4 text-blue-600" />
                  2. Responsive Breakpoint Modifiers (<code className="font-mono text-xs">sm:</code>, <code className="font-mono text-xs">md:</code>, <code className="font-mono text-xs">lg:</code>, <code className="font-mono text-xs">xl:</code>)
                </CardTitle>
                <CardDescription className="text-xs text-slate-500 mt-0.5">
                  Responsive classes adapt column counts, font sizes, and layout direction depending on screen viewport width.
                </CardDescription>
              </div>
              <Badge variant="outline" className="text-[10px] font-mono">
                Mobile-First
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="pt-4 space-y-4">
            
            {/* Live Breakpoint Reference Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <div className="rounded-md border border-slate-200 bg-white p-2.5 flex items-center gap-2">
                <Smartphone className="h-4 w-4 text-slate-500 shrink-0" />
                <div>
                  <span className="text-xs font-semibold text-slate-800 block">&lt; 640px</span>
                  <span className="text-[10px] font-mono text-slate-500">Default (Mobile)</span>
                </div>
              </div>
              <div className="rounded-md border border-slate-200 bg-white p-2.5 flex items-center gap-2">
                <Tablet className="h-4 w-4 text-blue-600 shrink-0" />
                <div>
                  <span className="text-xs font-semibold text-slate-800 block">sm: 640px+</span>
                  <span className="text-[10px] font-mono text-blue-600">Tablet / Phablet</span>
                </div>
              </div>
              <div className="rounded-md border border-slate-200 bg-white p-2.5 flex items-center gap-2">
                <Laptop className="h-4 w-4 text-emerald-600 shrink-0" />
                <div>
                  <span className="text-xs font-semibold text-slate-800 block">md: 768px+</span>
                  <span className="text-[10px] font-mono text-emerald-600">Laptop / Desktop</span>
                </div>
              </div>
              <div className="rounded-md border border-slate-200 bg-white p-2.5 flex items-center gap-2">
                <Monitor className="h-4 w-4 text-purple-600 shrink-0" />
                <div>
                  <span className="text-xs font-semibold text-slate-800 block">lg: 1024px+</span>
                  <span className="text-[10px] font-mono text-purple-600">Wide Desktop</span>
                </div>
              </div>
            </div>

            {/* Responsive Multi-Card Grid Demo */}
            <div className="space-y-2 pt-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-700 uppercase tracking-wider block">
                  Responsive Academic Metric Cards
                </span>
                <code className="text-[10px] font-mono text-slate-500">
                  grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3
                </code>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                
                <div className="rounded-lg border border-slate-200 bg-white p-3.5 shadow-2xs hover:border-blue-300 transition-colors">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-500 font-medium">Overall Attendance</span>
                    <span className="rounded bg-blue-50 px-1.5 py-0.5 text-[10px] font-semibold text-blue-700">88.4%</span>
                  </div>
                  <div className="mt-2 text-lg sm:text-xl font-bold text-slate-900">88.4%</div>
                  <p className="mt-1 text-[11px] text-emerald-600 font-medium flex items-center gap-1">
                    <CheckCircle2 className="h-3 w-3" /> Eligible for End-Sem
                  </p>
                </div>

                <div className="rounded-lg border border-slate-200 bg-white p-3.5 shadow-2xs hover:border-blue-300 transition-colors">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-500 font-medium">Enrolled Courses</span>
                    <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-semibold text-slate-700">Sem 5</span>
                  </div>
                  <div className="mt-2 text-lg sm:text-xl font-bold text-slate-900">5 Courses</div>
                  <p className="mt-1 text-[11px] text-slate-500 font-medium">19 Total Credits</p>
                </div>

                <div className="rounded-lg border border-slate-200 bg-white p-3.5 shadow-2xs hover:border-blue-300 transition-colors">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-500 font-medium">Pending Assignments</span>
                    <span className="rounded bg-amber-50 px-1.5 py-0.5 text-[10px] font-semibold text-amber-700">Due Soon</span>
                  </div>
                  <div className="mt-2 text-lg sm:text-xl font-bold text-slate-900">3 Submissions</div>
                  <p className="mt-1 text-[11px] text-amber-600 font-medium flex items-center gap-1">
                    <Clock className="h-3 w-3" /> Next due in 3 days
                  </p>
                </div>

                <div className="rounded-lg border border-slate-200 bg-white p-3.5 shadow-2xs hover:border-blue-300 transition-colors">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-500 font-medium">Cumulative CGPA</span>
                    <span className="rounded bg-emerald-50 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-700">Rank #4</span>
                  </div>
                  <div className="mt-2 text-lg sm:text-xl font-bold text-slate-900">8.62 / 10</div>
                  <p className="mt-1 text-[11px] text-slate-500 font-medium">Semester 4 Grade: 8.85</p>
                </div>

              </div>
            </div>

          </CardContent>
        </Card>
      )}

      {/* ============================================================
       * SECTION 3: FLEXBOX & CSS GRID IN ACADEMIC LAYOUTS
       * ============================================================ */}
      {(activeTab === "all" || activeTab === "grid-flex") && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Flexbox Showcase */}
          <Card className="border-slate-200 shadow-2xs">
            <CardHeader className="pb-3 border-b border-slate-100">
              <CardTitle className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Layers className="h-4 w-4 text-blue-600" />
                Flexbox Layout Utilities
              </CardTitle>
              <CardDescription className="text-xs text-slate-500">
                Demonstrates <code className="font-mono text-xs">flex</code>, <code className="font-mono text-xs">items-center</code>, <code className="font-mono text-xs">justify-between</code>, <code className="font-mono text-xs">flex-wrap</code>, and gap control.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-4 space-y-3">
              
              {/* Faculty Info Bar with Flexbox */}
              <div className="rounded-lg border border-slate-200 bg-slate-50/50 p-3 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs shrink-0">
                    SP
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-slate-900 block">Prof. Sanjay Patel</span>
                    <span className="text-[11px] text-slate-500">Course Coordinator — FSD</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 text-[10px] font-semibold">
                    Available
                  </span>
                  <button className="rounded-md border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-700 hover:bg-slate-100 transition-colors">
                    Contact
                  </button>
                </div>
              </div>

              {/* Flex alignment matrix */}
              <div className="space-y-2">
                <div className="flex items-center justify-between p-2 rounded bg-white border border-slate-200 text-xs">
                  <span className="text-slate-600">Left Aligned Title</span>
                  <span className="text-blue-600 font-mono text-[11px]">justify-between</span>
                  <span className="text-slate-900 font-semibold">Right Aligned Value</span>
                </div>
                <div className="flex items-center justify-center p-2 rounded bg-white border border-slate-200 text-xs">
                  <span className="text-slate-600 font-mono text-[11px]">justify-center items-center</span>
                </div>
              </div>

            </CardContent>
          </Card>

          {/* CSS Grid Showcase */}
          <Card className="border-slate-200 shadow-2xs">
            <CardHeader className="pb-3 border-b border-slate-100">
              <CardTitle className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <LayoutGrid className="h-4 w-4 text-blue-600" />
                CSS Grid Layout Utilities
              </CardTitle>
              <CardDescription className="text-xs text-slate-500">
                Demonstrates multi-span columns, auto-fitting, and column spans (<code className="font-mono text-xs">col-span-*</code>).
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-4 space-y-3">
              
              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div className="col-span-2 rounded border border-blue-200 bg-blue-50/60 p-2.5 font-medium text-blue-800">
                  col-span-2 (Academic Core)
                </div>
                <div className="col-span-1 rounded border border-slate-200 bg-slate-50 p-2.5 font-medium text-slate-700">
                  col-span-1
                </div>
                <div className="col-span-1 rounded border border-slate-200 bg-slate-50 p-2.5 font-medium text-slate-700">
                  col-span-1
                </div>
                <div className="col-span-2 rounded border border-emerald-200 bg-emerald-50/60 p-2.5 font-medium text-emerald-800">
                  col-span-2 (Lab Assessment)
                </div>
                <div className="col-span-3 rounded border border-slate-200 bg-white p-2 font-mono text-[11px] text-slate-500">
                  col-span-3 (Full Width Span)
                </div>
              </div>

            </CardContent>
          </Card>

        </div>
      )}

      {/* ============================================================
       * SECTION 4: STATE VARIANTS (Hover, Focus, Active, Disabled)
       * ============================================================ */}
      {(activeTab === "all" || activeTab === "states") && (
        <Card className="border-slate-200 shadow-2xs">
          <CardHeader className="pb-3 border-b border-slate-100">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2">
                  <MousePointerClick className="h-4 w-4 text-blue-600" />
                  3. State Variants (Hover, Focus, Active, Disabled)
                </CardTitle>
                <CardDescription className="text-xs text-slate-500 mt-0.5">
                  Interactive state modifiers respond to user interaction with immediate visual feedback.
                </CardDescription>
              </div>
              <Badge variant="outline" className="text-[10px] font-mono">
                Pseudo-Classes
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="pt-4 space-y-4">
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              
              {/* Button State Variants */}
              <div className="rounded-lg border border-slate-200 bg-slate-50/40 p-3.5 space-y-2.5">
                <span className="text-xs font-semibold text-slate-700 block">Button Hover & Active</span>
                
                <button className="w-full rounded-md bg-blue-600 px-3 py-2 text-xs font-semibold text-white shadow-2xs transition-colors hover:bg-blue-700 active:scale-98 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-1">
                  Primary Button (Hover: bg-blue-700)
                </button>

                <button className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-xs font-medium text-slate-700 shadow-2xs transition-colors hover:bg-slate-100 hover:text-slate-900 active:scale-98 focus:outline-none focus:ring-2 focus:ring-slate-400">
                  Outline Button (Hover: bg-slate-100)
                </button>

                <button className="w-full rounded-md bg-rose-600 px-3 py-2 text-xs font-semibold text-white shadow-2xs transition-colors hover:bg-rose-700 active:scale-98 focus:outline-none focus:ring-2 focus:ring-rose-500">
                  Destructive Action (Hover: bg-rose-700)
                </button>
              </div>

              {/* Form Input Focus Variants */}
              <div className="rounded-lg border border-slate-200 bg-slate-50/40 p-3.5 space-y-2.5">
                <span className="text-xs font-semibold text-slate-700 block">Input Focus Ring States</span>
                
                <div className="space-y-1">
                  <label className="text-[11px] font-medium text-slate-600">Standard Focus Ring</label>
                  <input
                    type="text"
                    placeholder="Click to test focus ring..."
                    className="w-full rounded-md border border-slate-300 px-3 py-1.5 text-xs text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/30 transition-all"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-medium text-slate-600">Interactive Bound Input</label>
                  <input
                    type="text"
                    value={interactiveInput}
                    onChange={(e) => setInteractiveInput(e.target.value)}
                    placeholder="Type to see live reflection..."
                    className="w-full rounded-md border border-slate-300 px-3 py-1.5 text-xs text-slate-900 placeholder:text-slate-400 focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-600/30 transition-all"
                  />
                  {interactiveInput && (
                    <span className="text-[10px] text-emerald-600 font-medium block">
                      Active text: {interactiveInput}
                    </span>
                  )}
                </div>
              </div>

              {/* Disabled & Conditional States */}
              <div className="rounded-lg border border-slate-200 bg-slate-50/40 p-3.5 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-700 block">Disabled State Modifier</span>
                  <button
                    type="button"
                    onClick={() => setIsButtonDisabled(!isButtonDisabled)}
                    className="text-[10px] text-blue-600 hover:underline font-medium"
                  >
                    Toggle {isButtonDisabled ? "Enabled" : "Disabled"}
                  </button>
                </div>

                <button
                  disabled={isButtonDisabled}
                  className="w-full rounded-md bg-emerald-600 px-3 py-2 text-xs font-semibold text-white shadow-2xs transition-all hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-emerald-600"
                >
                  {isButtonDisabled ? "Action Disabled (opacity-50)" : "Action Enabled (Clickable)"}
                </button>

                <div className={`p-2.5 rounded-md border text-xs transition-colors ${
                  isButtonDisabled 
                    ? "bg-slate-100 border-slate-200 text-slate-500" 
                    : "bg-emerald-50 border-emerald-200 text-emerald-800"
                }`}>
                  State: <strong className="font-semibold">{isButtonDisabled ? "Inactive / Disabled" : "Active / Operational"}</strong>
                </div>
              </div>

            </div>

          </CardContent>
        </Card>
      )}

      {/* ============================================================
       * SECTION 5: REUSABLE ACADEMIC COMPONENTS & DATA TABLE
       * ============================================================ */}
      {(activeTab === "all" || activeTab === "components") && (
        <Card className="border-slate-200 shadow-2xs">
          <CardHeader className="pb-3 border-b border-slate-100">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2">
                  <TableIcon className="h-4 w-4 text-blue-600" />
                  4. Reusable Academic Data Table with Hover & Responsive Overflow
                </CardTitle>
                <CardDescription className="text-xs text-slate-500 mt-0.5">
                  Demonstrates structured table typography, subtle hover row highlights (<code className="font-mono text-xs">hover:bg-slate-50/80</code>), badge statuses, and mobile-friendly scrolling.
                </CardDescription>
              </div>
              <Badge variant="outline" className="text-[10px] font-mono">
                Academic Dataset
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="pt-4 space-y-4">
            
            {/* Table Container with Horizontal Scroll on Mobile */}
            <div className="overflow-x-auto rounded-md border border-slate-200">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-50 border-b border-slate-200 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                  <tr>
                    <th scope="col" className="px-3.5 py-2.5">Course Code</th>
                    <th scope="col" className="px-3.5 py-2.5">Course Title</th>
                    <th scope="col" className="px-3.5 py-2.5 hidden sm:table-cell">Instructor</th>
                    <th scope="col" className="px-3.5 py-2.5">Credits</th>
                    <th scope="col" className="px-3.5 py-2.5 hidden md:table-cell">Attendance</th>
                    <th scope="col" className="px-3.5 py-2.5 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {DEMO_ACADEMIC_COURSES.map((course) => (
                    <tr 
                      key={course.code}
                      className="transition-colors hover:bg-slate-50/80"
                    >
                      <td className="px-3.5 py-2.5 font-mono font-semibold text-blue-700">
                        {course.code}
                      </td>
                      <td className="px-3.5 py-2.5 font-medium text-slate-900">
                        <div>{course.title}</div>
                        <span className="text-[10px] text-slate-400 sm:hidden">{course.faculty}</span>
                      </td>
                      <td className="px-3.5 py-2.5 text-slate-600 hidden sm:table-cell">
                        {course.faculty}
                      </td>
                      <td className="px-3.5 py-2.5 text-slate-600">
                        <span className="inline-flex items-center rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-semibold text-slate-700">
                          {course.credits} Credits
                        </span>
                      </td>
                      <td className="px-3.5 py-2.5 text-slate-600 hidden md:table-cell font-medium">
                        {course.attendance}
                      </td>
                      <td className="px-3.5 py-2.5 text-right">
                        <Badge 
                          variant={
                            course.status === "Active" 
                              ? "success" 
                              : course.status === "Completed" 
                              ? "outline" 
                              : "warning"
                          }
                          className="text-[10px]"
                        >
                          {course.status}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Table Metadata Footer */}
            <div className="flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500 pt-1">
              <span>Showing 5 academic courses registered for Semester 5 (2025-2026)</span>
              <span className="font-mono text-slate-400">Total Enrolled Credits: 19</span>
            </div>

          </CardContent>
        </Card>
      )}

      {/* 6. Utility Class Live Inspector Box */}
      <div className="rounded-lg border border-slate-200 bg-slate-900 text-slate-100 p-4 shadow-sm">
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Code2 className="h-4 w-4 text-blue-400" />
            <span className="text-xs font-semibold text-slate-200">
              Live Tailwind Utility Class Inspector
            </span>
          </div>
          <span className="text-[10px] font-mono text-slate-400">
            Selected: {selectedItemForInspector.title}
          </span>
        </div>
        <div className="mt-2 font-mono text-xs text-emerald-400 overflow-x-auto py-1">
          <code>{selectedItemForInspector.classes}</code>
        </div>
        <div className="mt-2 text-[11px] text-slate-400 flex items-center justify-between">
          <span>Click on any color or card above to inspect its atomic utility classes.</span>
          <span className="text-[10px] text-slate-500 font-mono">Zero CSS Bloat</span>
        </div>
      </div>

    </div>
  );
}
