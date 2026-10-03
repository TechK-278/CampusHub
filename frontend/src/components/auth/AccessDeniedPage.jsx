/**
 * CampusHub — Access Denied (403) Page Component
 * Practical 9: RBAC Guard Fallback
 */

import React from "react";
import { ShieldAlert, ArrowLeft, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function AccessDeniedPage({ tabId, userRole, requiredRoles = [], onNavigate }) {
  return (
    <div className="flex items-center justify-center min-h-[60vh] px-4 py-8">
      <Card className="max-w-md w-full border-slate-200 shadow-sm text-center">
        <CardHeader className="pb-4">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-rose-50 border border-rose-200 mb-3">
            <ShieldAlert className="h-7 w-7 text-rose-600" />
          </div>
          <CardTitle className="text-xl font-bold text-slate-900">403 — Access Denied</CardTitle>
          <CardDescription className="text-xs text-slate-500 mt-1">
            Your current academic role does not possess the authorization privileges required to access the requested module.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4 text-xs">
          <div className="rounded-lg bg-slate-50 p-3.5 border border-slate-200 text-left space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-slate-500 font-medium">Your Active Role:</span>
              <Badge variant="outline" className="capitalize text-slate-700 font-semibold">
                {userRole || "Unknown"}
              </Badge>
            </div>
            {requiredRoles.length > 0 && (
              <div className="flex items-center justify-between">
                <span className="text-slate-500 font-medium">Required Authorization:</span>
                <div className="flex gap-1">
                  {requiredRoles.map((r) => (
                    <Badge key={r} variant="secondary" className="capitalize text-[10px]">
                      {r}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            <div className="flex items-center justify-between">
              <span className="text-slate-500 font-medium">Module Identifier:</span>
              <span className="font-mono text-slate-600 text-[11px]">{tabId}</span>
            </div>
          </div>

          <div className="pt-2">
            <Button
              onClick={() => onNavigate?.("dashboard")}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white text-xs"
            >
              <ArrowLeft className="h-3.5 w-3.5 mr-1.5" />
              Return to Dashboard
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
