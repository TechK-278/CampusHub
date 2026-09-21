import React, { useState } from "react";
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

export default function App() {
  const [activeTab, setActiveTab] = useState("dashboard");

  const renderActivePage = () => {
    switch (activeTab) {
      case "dashboard":
        return <DashboardPage onNavigate={setActiveTab} />;
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
        return <DashboardPage onNavigate={setActiveTab} />;
    }
  };

  return (
    <PortalLayout
      student={mockStudent}
      activeTab={activeTab}
      onSelectTab={setActiveTab}
    >
      {renderActivePage()}
    </PortalLayout>
  );
}
