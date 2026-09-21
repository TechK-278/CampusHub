import React, { useState, useEffect } from "react";
import { PortalLayout } from "@/components/layout/PortalLayout";
import { DashboardPage } from "@/pages/DashboardPage";
import { CoursesPage } from "@/pages/CoursesPage";
import { AttendancePage } from "@/pages/AttendancePage";
import { AssignmentsPage } from "@/pages/AssignmentsPage";
import { ResultsPage } from "@/pages/ResultsPage";
import { NoticesPage } from "@/pages/NoticesPage";
import { TasksPage } from "@/pages/TasksPage";
import { ProfilePage } from "@/pages/ProfilePage";
import { mockStudent } from "@/data/mockData";
import { getStorageItem, setStorageItem, STORAGE_KEYS } from "@/lib/storage";

const VALID_TABS = [
  "dashboard",
  "courses",
  "attendance",
  "assignments",
  "results",
  "notices",
  "tasks",
  "profile"
];

export default function App() {
  // Practical 4: Initialize active navigation tab from Local Storage preference
  const [activeTab, setActiveTab] = useState(() => {
    const saved = getStorageItem(STORAGE_KEYS.LAST_VISITED_PAGE, "dashboard");
    return VALID_TABS.includes(saved) ? saved : "dashboard";
  });

  // Practical 4: Persist tab selection in Local Storage
  const handleSelectTab = (tabId) => {
    setActiveTab(tabId);
    setStorageItem(STORAGE_KEYS.LAST_VISITED_PAGE, tabId);
  };

  const renderActivePage = () => {
    switch (activeTab) {
      case "dashboard":
        return <DashboardPage onNavigate={handleSelectTab} />;
      case "courses":
        return <CoursesPage />;
      case "attendance":
        return <AttendancePage />;
      case "assignments":
        return <AssignmentsPage />;
      case "results":
        return <ResultsPage />;
      case "notices":
        return <NoticesPage />;
      case "tasks":
        return <TasksPage />;
      case "profile":
        return <ProfilePage />;
      default:
        return <DashboardPage onNavigate={handleSelectTab} />;
    }
  };

  return (
    <PortalLayout
      student={mockStudent}
      activeTab={activeTab}
      onSelectTab={handleSelectTab}
    >
      {renderActivePage()}
    </PortalLayout>
  );
}
