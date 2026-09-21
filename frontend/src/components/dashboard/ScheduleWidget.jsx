import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, MapPin, User, CalendarDays } from "lucide-react";

export function ScheduleWidget({ schedule }) {
  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <div>
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <CalendarDays className="h-4 w-4 text-blue-600" />
            Today's Schedule
          </CardTitle>
          <CardDescription>Monday, Academic Timetable (Sem 5)</CardDescription>
        </div>
        <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
          4 Sessions
        </span>
      </CardHeader>
      <CardContent className="space-y-3">
        {schedule.map((item) => (
          <div
            key={item.id}
            className="flex flex-col sm:flex-row sm:items-center justify-between p-3 rounded-lg border border-slate-100 bg-slate-50/60 hover:bg-slate-50 transition-colors gap-2"
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200">
                  {item.courseCode}
                </span>
                <span className="text-xs font-semibold text-slate-900">
                  {item.courseName}
                </span>
                <Badge variant={item.type.includes("Lab") ? "secondary" : "outline"} className="text-[10px]">
                  {item.type}
                </Badge>
              </div>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-slate-500">
                <span className="flex items-center gap-1">
                  <MapPin className="h-3 w-3 text-slate-400" />
                  {item.room}
                </span>
                <span className="flex items-center gap-1">
                  <User className="h-3 w-3 text-slate-400" />
                  {item.faculty}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 pt-1 sm:pt-0 border-t sm:border-t-0 border-slate-200">
              <span className="flex items-center gap-1 text-xs font-medium text-slate-700">
                <Clock className="h-3.5 w-3.5 text-slate-400" />
                {item.time}
              </span>
              <Badge
                variant={
                  item.status === "Completed"
                    ? "success"
                    : item.status === "In Progress"
                    ? "warning"
                    : "secondary"
                }
                className="text-[10px]"
              >
                {item.status}
              </Badge>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
