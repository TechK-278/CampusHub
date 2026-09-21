import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BellRing, Calendar, ChevronRight, AlertCircle } from "lucide-react";

export function NoticesWidget({ notices, onViewAll }) {
  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <div>
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <BellRing className="h-4 w-4 text-blue-600" />
            Recent Academic Notices
          </CardTitle>
          <CardDescription>Departmental announcements and circulars</CardDescription>
        </div>
        <Button variant="ghost" size="sm" onClick={onViewAll} className="text-xs text-blue-600 hover:text-blue-700">
          All Notices
          <ChevronRight className="ml-1 h-3 w-3" />
        </Button>
      </CardHeader>
      <CardContent className="space-y-3">
        {notices.map((notice) => (
          <div
            key={notice.id}
            className="p-3 rounded-lg border border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition-colors space-y-1.5"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2">
                {notice.isUrgent && (
                  <span className="flex h-2 w-2 rounded-full bg-rose-500 shrink-0" title="Urgent" />
                )}
                <h4 className="text-xs font-semibold text-slate-900 leading-tight">
                  {notice.title}
                </h4>
              </div>
              <Badge variant={notice.badgeVariant} className="text-[10px] shrink-0">
                {notice.category}
              </Badge>
            </div>

            <p className="text-[11px] text-slate-600 line-clamp-2">
              {notice.description}
            </p>

            <div className="flex items-center justify-between pt-1 text-[10px] text-slate-400">
              <span className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {notice.date}
              </span>
              <span>Issued by: {notice.issuedBy}</span>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
