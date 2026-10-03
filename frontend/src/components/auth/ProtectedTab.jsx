/**
 * CampusHub — Protected Tab Guard Component
 * Practical 9: RBAC Tab Guard
 */

import React from "react";
import { useAuth } from "@/context/AuthContext";
import { isTabAllowed, TAB_PERMISSIONS } from "@/lib/permissions";
import { AccessDeniedPage } from "./AccessDeniedPage";

export function ProtectedTab({ tabId, children, onNavigate }) {
  const { user } = useAuth();
  const role = user?.role;

  const allowed = isTabAllowed(tabId, role);

  if (!allowed) {
    const requiredRoles = TAB_PERMISSIONS[tabId] || [];
    return (
      <AccessDeniedPage
        tabId={tabId}
        userRole={role}
        requiredRoles={requiredRoles}
        onNavigate={onNavigate}
      />
    );
  }

  return children;
}
