import React, { useState, useEffect } from "react";
import { PortalLayout } from "@/components/layout/PortalLayout";
import { DashboardPage } from "@/pages/DashboardPage";
import { StudentsPage } from "@/pages/StudentsPage";
import { CoursesPage } from "@/pages/CoursesPage";
import { AttendancePage } from "@/pages/AttendancePage";
import { AssignmentsPage } from "@/pages/AssignmentsPage";
import { ResultsPage } from "@/pages/ResultsPage";
import { NoticesPage } from "@/pages/NoticesPage";
import { TasksPage } from "@/pages/TasksPage";
import { AdmissionsPage } from "@/pages/admissions/AdmissionsPage";
import { AcademicCalendarPage } from "@/pages/calendar/AcademicCalendarPage";
import { LibraryPage } from "@/pages/library/LibraryPage";
import { UserManagementPage } from "@/pages/UserManagementPage";
import { MyAccessPage } from "@/pages/MyAccessPage";
import { ProfilePage } from "@/pages/ProfilePage";
import { LoginPage } from "@/pages/LoginPage";
import { ProtectedTab } from "@/components/auth/ProtectedTab";
import { useAuth } from "@/context/AuthContext";
import { ALL_VALID_TABS, isTabAllowed } from "@/lib/permissions";
import { getStorageItem, setStorageItem, STORAGE_KEYS } from "@/lib/storage";
import { mockStudent } from "@/data/mockData";
import { Loader2 } from "lucide-react";

export default function App() {
  const { user, loading, isAuthenticated } = useAuth();

  // Practical 4: Initialize active navigation tab from Local Storage preference
  const [activeTab, setActiveTab] = useState(() => {
    const saved = getStorageItem(STORAGE_KEYS.LAST_VISITED_PAGE, "dashboard");
    return ALL_VALID_TABS.includes(saved) ? saved : "dashboard";
  });

  // Ensure active tab is allowed for current user role whenever user changes
  useEffect(() => {
    if (user && !isTabAllowed(activeTab, user.role)) {
      setActiveTab("dashboard");
      setStorageItem(STORAGE_KEYS.LAST_VISITED_PAGE, "dashboard");
    }
  }, [user, activeTab]);

  // Practical 4: Persist tab selection in Local Storage
  const handleSelectTab = (tabId) => {
    setActiveTab(tabId);
    setStorageItem(STORAGE_KEYS.LAST_VISITED_PAGE, tabId);
  };

  // Neutral initial authentication loading state
  if (loading) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center bg-slate-50 text-slate-500 space-y-3">
        <Loader2 className="h-7 w-7 animate-spin text-blue-600" />
        <span className="text-xs font-semibold tracking-wide text-slate-600">Restoring CampusHub Session...</span>
      </div>
    );
  }

  // Render Login page if not authenticated
  if (!isAuthenticated) {
    return <LoginPage />;
  }

  // Active student/user representation
  const activeUserRepresentation = {
    name: user?.full_name || mockStudent.name,
    email: user?.email || mockStudent.email,
    rollNo: user?.username || mockStudent.rollNo,
    semester: mockStudent.semester,
    initials: user?.full_name
      ? user.full_name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
      : mockStudent.initials,
    role: user?.role || "student"
  };

  const renderActivePage = () => {
    switch (activeTab) {
      case "dashboard":
        return <DashboardPage onNavigate={handleSelectTab} />;
      case "students":
        return <StudentsPage />;
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
      case "student-registration":
        return <AdmissionsPage />;
      case "tailwind-demo":
        return <AcademicCalendarPage />;
      case "vue-demo":
        return <LibraryPage />;
      case "user-management":
        return <UserManagementPage />;
      case "access":
        return <MyAccessPage />;
      case "profile":
        return <ProfilePage />;
      default:
        return <DashboardPage onNavigate={handleSelectTab} />;
    }
  };

  return (
    <PortalLayout
      student={activeUserRepresentation}
      activeTab={activeTab}
      onSelectTab={handleSelectTab}
    >
      <ProtectedTab tabId={activeTab} onNavigate={handleSelectTab}>
        {renderActivePage()}
      </ProtectedTab>
    </PortalLayout>
  );
}

