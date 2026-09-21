import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  CalendarCheck, 
  BookOpen, 
  FileCheck2, 
  Award,
  TrendingUp
} from "lucide-react";

const statIcons = {
  attendance: CalendarCheck,
  courses: BookOpen,
  assignments: FileCheck2,
  cgpa: Award,
};

export function StatCards({ stats }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => {
        const Icon = statIcons[stat.id] || Award;
        return (
          <Card key={stat.id} className="relative overflow-hidden transition-all hover:border-slate-300">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  {stat.title}
                </span>
                <div className="flex h-8 w-8 items-center justify-center rounded-md bg-slate-100 text-slate-700">
                  <Icon className="h-4 w-4" />
                </div>
              </div>

              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-2xl font-bold tracking-tight text-slate-900">
                  {stat.value}
                </span>
                <Badge variant={stat.badgeVariant} className="text-[10px] px-1.5 py-0">
                  {stat.statusBadge}
                </Badge>
              </div>

              <div className="mt-3 flex items-center justify-between text-xs text-slate-500 border-t border-slate-100 pt-2.5">
                <span className="truncate">{stat.caption}</span>
                <span className="shrink-0 text-[11px] font-medium text-slate-600">
                  {stat.trend}
                </span>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
