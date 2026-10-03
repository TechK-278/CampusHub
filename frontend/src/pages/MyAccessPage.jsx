/**
 * CampusHub — My Access & Role Permissions Inspector
 * Practical 9: RBAC Active Privilege Verification & Live Authorization Checks
 */

import React, { useState, useEffect, useCallback } from "react";
import {
  ShieldCheck,
  KeyRound,
  Lock,
  Unlock,
  CheckCircle2,
  XCircle,
  RefreshCw,
  User,
  Shield,
  Layers,
  Activity,
  ArrowRight
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { authService } from "@/services/authService";
import { TAB_PERMISSIONS } from "@/lib/permissions";

const PROTECTED_ENDPOINTS = [
  {
    key: "profile",
    title: "General User Profile Endpoint",
    url: "GET /api/protected/profile",
    description: "Accessible to all authenticated sessions regardless of role.",
    allowedRoles: ["student", "faculty", "admin"]
  },
  {
    key: "academic",
    title: "Academic Administration Endpoint",
    url: "GET /api/protected/academic",
    description: "Restricted to Faculty and System Administrators only.",
    allowedRoles: ["faculty", "admin"]
  },
  {
    key: "admin",
    title: "System Administrator Console Endpoint",
    url: "GET /api/protected/admin",
    description: "Strictly isolated to System Administrators.",
    allowedRoles: ["admin"]
  }
];

export function MyAccessPage() {
  const { user } = useAuth();
  const [checkResults, setCheckResults] = useState({});
  const [checking, setChecking] = useState(false);

  const runLiveAccessCheck = useCallback(async () => {
    setChecking(true);
    const results = {};

    for (const ep of PROTECTED_ENDPOINTS) {
      try {
        const res = await authService.testProtectedEndpoint(ep.key);
        results[ep.key] = {
          status: res.status,
          ok: res.ok,
          message: res.data?.message || res.data?.error || `HTTP ${res.status}`
        };
      } catch (err) {
        results[ep.key] = {
          status: 500,
          ok: false,
          message: err.message
        };
      }
    }

    setCheckResults(results);
    setChecking(false);
  }, []);

  useEffect(() => {
    runLiveAccessCheck();
  }, [runLiveAccessCheck]);

  const userRole = user?.role || "student";

  // Tab permissions table for active role
  const tabPrivileges = Object.entries(TAB_PERMISSIONS).map(([tabId, roles]) => ({
    tabId,
    hasAccess: roles.includes(userRole),
    allowedRoles: roles
  }));

  const getRoleBadge = (role) => {
    switch (role) {
      case "admin":
        return <Badge className="bg-purple-100 text-purple-800 border-purple-200">Admin</Badge>;
      case "faculty":
        return <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200">Faculty</Badge>;
      default:
        return <Badge className="bg-blue-100 text-blue-800 border-blue-200">Student</Badge>;
    }
  };

  return (
    <div className="space-y-6 select-none">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            <ShieldCheck className="h-6 w-6 text-blue-600" />
            My Access & Security Profile
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Live evaluation of your active session credentials, role privileges, and server-side RBAC enforcement.
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={runLiveAccessCheck}
          disabled={checking}
          className="text-xs h-9"
        >
          <RefreshCw className={`h-3.5 w-3.5 mr-1.5 ${checking ? "animate-spin" : ""}`} />
          Re-evaluate Access
        </Button>
      </div>

      {/* User Information Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-slate-200 shadow-2xs md:col-span-1">
          <CardHeader className="py-3.5 px-4 border-b border-slate-100">
            <CardTitle className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <User className="h-4 w-4 text-blue-600" />
              Active Session Details
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 space-y-3 text-xs">
            <div>
              <span className="text-[11px] text-slate-400 font-medium block">Full Name</span>
              <span className="font-semibold text-slate-900 text-sm">{user?.full_name || "—"}</span>
            </div>
            <div>
              <span className="text-[11px] text-slate-400 font-medium block">Username</span>
              <span className="font-mono text-slate-700">{user?.username || "—"}</span>
            </div>
            <div>
              <span className="text-[11px] text-slate-400 font-medium block">Email Address</span>
              <span className="text-slate-700">{user?.email || "—"}</span>
            </div>
            <div>
              <span className="text-[11px] text-slate-400 font-medium block">Assigned Role</span>
              <div className="mt-1">{getRoleBadge(userRole)}</div>
            </div>
            <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-400">
              Session Authenticated via HS256 JWT
            </div>
          </CardContent>
        </Card>

        {/* Live Server-Side Verification Table */}
        <Card className="border-slate-200 shadow-2xs md:col-span-2">
          <CardHeader className="py-3.5 px-4 border-b border-slate-100 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Activity className="h-4 w-4 text-blue-600" />
                Live Endpoint Authorization Checks
              </CardTitle>
              <CardDescription className="text-xs text-slate-500">
                Server-side responses for role: <strong className="capitalize">{userRole}</strong>
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                  <tr>
                    <th className="py-2.5 px-4">Endpoint</th>
                    <th className="py-2.5 px-4">Required Roles</th>
                    <th className="py-2.5 px-4">Server Status</th>
                    <th className="py-2.5 px-4">Response Detail</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {PROTECTED_ENDPOINTS.map((ep) => {
                    const result = checkResults[ep.key];
                    const isAllowed = ep.allowedRoles.includes(userRole);

                    return (
                      <tr key={ep.key} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-3 px-4">
                          <span className="font-semibold text-slate-900 block">{ep.title}</span>
                          <span className="font-mono text-[11px] text-slate-500">{ep.url}</span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex flex-wrap gap-1">
                            {ep.allowedRoles.map((r) => (
                              <Badge key={r} variant="outline" className="text-[10px] capitalize">
                                {r}
                              </Badge>
                            ))}
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          {checking || !result ? (
                            <span className="text-slate-400">Testing...</span>
                          ) : result.status === 200 ? (
                            <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200 flex items-center gap-1 w-fit">
                              <CheckCircle2 className="h-3 w-3" />
                              200 OK
                            </Badge>
                          ) : result.status === 403 ? (
                            <Badge className="bg-rose-100 text-rose-800 border-rose-200 flex items-center gap-1 w-fit">
                              <XCircle className="h-3 w-3" />
                              403 Forbidden
                            </Badge>
                          ) : (
                            <Badge variant="destructive">HTTP {result.status}</Badge>
                          )}
                        </td>
                        <td className="py-3 px-4 text-slate-600 text-[11px]">
                          {result?.message || "—"}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Navigation Privilege Matrix */}
      <Card className="border-slate-200 shadow-2xs">
        <CardHeader className="py-3.5 px-4 border-b border-slate-100">
          <CardTitle className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Layers className="h-4 w-4 text-blue-600" />
            Portal Module Permissions Matrix
          </CardTitle>
          <CardDescription className="text-xs text-slate-500">
            Navigation tabs enabled for role: <strong className="capitalize">{userRole}</strong>
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-slate-100 p-3 gap-y-3">
            {tabPrivileges.map((item) => (
              <div key={item.tabId} className="flex items-center justify-between p-2 rounded-md hover:bg-slate-50">
                <div className="space-y-0.5">
                  <span className="font-semibold text-slate-900 capitalize text-xs block">
                    {item.tabId.replace("-", " ")}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">tab: {item.tabId}</span>
                </div>
                <div>
                  {item.hasAccess ? (
                    <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 text-[10px] flex items-center gap-1">
                      <CheckCircle2 className="h-3 w-3" />
                      Allowed
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="text-slate-400 bg-slate-50 border-slate-200 text-[10px] flex items-center gap-1">
                      <Lock className="h-3 w-3" />
                      Locked
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
