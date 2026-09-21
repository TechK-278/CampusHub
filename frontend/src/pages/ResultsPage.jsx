import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Award, CheckCircle2, TrendingUp } from "lucide-react";

export function ResultsPage() {
  const semesters = [
    { sem: "Semester 4", spi: 8.80, cpi: 8.62, status: "Passed (Distinction)", credits: 22 },
    { sem: "Semester 3", spi: 8.55, cpi: 8.56, status: "Passed (Distinction)", credits: 24 },
    { sem: "Semester 2", spi: 8.70, cpi: 8.57, status: "Passed (Distinction)", credits: 20 },
    { sem: "Semester 1", spi: 8.44, cpi: 8.44, status: "Passed (First Class)", credits: 20 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">Academic Grade History</h1>
          <p className="text-xs text-slate-500">Official Semester Performance Index (SPI) & Cumulative Grade Records</p>
        </div>
        <Badge variant="default" className="text-xs">Cumulative CPI: 8.62</Badge>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {semesters.map((s) => (
          <Card key={s.sem}>
            <CardHeader className="p-4 pb-2">
              <div className="flex justify-between items-center">
                <span className="text-xs font-semibold text-slate-500">{s.sem}</span>
                <Badge variant="secondary" className="text-[10px]">{s.credits} Credits</Badge>
              </div>
              <CardTitle className="text-2xl font-bold text-slate-900 mt-1">{s.spi} <span className="text-xs font-normal text-slate-500">SPI</span></CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0 text-xs text-slate-600">
              <div className="flex justify-between border-t border-slate-100 pt-2 mt-2">
                <span>Result:</span>
                <span className="font-medium text-emerald-700">{s.status}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
