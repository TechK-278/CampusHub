import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { mockNotices } from "@/data/mockData";
import { BellRing, Calendar, User, FileText } from "lucide-react";

export function NoticesPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">Official Notices & Circulars</h1>
          <p className="text-xs text-slate-500">University, Departmental, and Examination Announcements</p>
        </div>
        <Badge variant="secondary" className="text-xs">3 Published Notices</Badge>
      </div>

      <div className="space-y-4">
        {mockNotices.map((notice) => (
          <Card key={notice.id} className="hover:border-slate-300 transition-colors">
            <CardHeader className="p-5 pb-3">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  {notice.isUrgent && (
                    <span className="flex h-2.5 w-2.5 rounded-full bg-rose-500 shrink-0" title="Urgent Notice" />
                  )}
                  <CardTitle className="text-base font-semibold">{notice.title}</CardTitle>
                </div>
                <Badge variant={notice.badgeVariant} className="text-xs shrink-0">
                  {notice.category}
                </Badge>
              </div>
              <CardDescription className="flex items-center gap-4 pt-1 text-xs">
                <span className="flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5 text-slate-400" /> Date: {notice.date}
                </span>
                <span className="flex items-center gap-1">
                  <User className="h-3.5 w-3.5 text-slate-400" /> Issued By: {notice.issuedBy}
                </span>
              </CardDescription>
            </CardHeader>
            <CardContent className="p-5 pt-0 text-xs text-slate-700 leading-relaxed border-t border-slate-100 mt-2">
              <p className="pt-3">{notice.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
