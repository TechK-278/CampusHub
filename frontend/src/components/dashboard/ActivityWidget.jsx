import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { History, CheckCircle2, Clock, BookMarked, Download } from "lucide-react";

export function ActivityWidget({ activities }) {
  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold flex items-center gap-2">
          <History className="h-4 w-4 text-blue-600" />
          Recent Activity
        </CardTitle>
        <CardDescription>Your recent portal interactions</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {activities.map((activity, index) => (
          <div key={activity.id} className="relative flex items-start gap-3 text-xs">
            <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-600 border border-blue-100">
              <CheckCircle2 className="h-3.5 w-3.5" />
            </div>
            <div className="flex-1 space-y-0.5">
              <p className="font-semibold text-slate-800 leading-tight">
                {activity.title}
              </p>
              <p className="text-[11px] text-slate-500">
                {activity.detail}
              </p>
            </div>
            <span className="shrink-0 text-[10px] text-slate-400">
              {activity.timestamp}
            </span>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
