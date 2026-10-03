import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  Users,
  Plus,
  Search,
  Filter,
  Trash2,
  Edit2,
  RefreshCw,
  Calculator,
  AlertTriangle,
  CheckCircle2,
  Building2,
  Award,
  GraduationCap,
  BookOpen,
  TrendingUp,
  Layers,
  Check
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { studentService } from "@/services/studentService";
import { useAuth } from "@/context/AuthContext";

const INITIAL_FORM = {
  roll_number: "",
  first_name: "",
  last_name: "",
  email: "",
  mobile: "",
  department: "Computer Science & Engineering",
  semester: 5,
  division: "A"
};

export function StudentsPage() {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";
  const canModify = user?.role === "faculty" || user?.role === "admin";

  const [activeTab, setActiveTab] = useState("directory"); // "directory", "evaluation", "departments"
  const [students, setStudents] = useState([]);

  const [departments, setDepartments] = useState([]);
  const [selectedDept, setSelectedDept] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Dialog states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [studentToEdit, setStudentToEdit] = useState(null);
  const [studentToDelete, setStudentToDelete] = useState(null);
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [formErrors, setFormErrors] = useState({});
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [successBanner, setSuccessBanner] = useState(null);

  // Grade Evaluation states
  const [evalStudentRoll, setEvalStudentRoll] = useState("");
  const [evalCourse, setEvalCourse] = useState("CS501 - Full Stack Web Development");
  const [midSemMarks, setMidSemMarks] = useState(25); // out of 30
  const [practicalMarks, setPracticalMarks] = useState(27); // out of 30
  const [endSemMarks, setEndSemMarks] = useState(34); // out of 40
  const [evalResult, setEvalResult] = useState(null);
  const [evalLoading, setEvalLoading] = useState(false);

  // Fetch student records & distinct departments
  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [studentsRes, depts] = await Promise.all([
        studentService.getStudents({ department: selectedDept, search: searchQuery }),
        studentService.getDistinctDepartments()
      ]);
      setStudents(studentsRes.students || []);
      setDepartments(depts || []);
    } catch (err) {
      setError(err.message || "Failed to fetch student records");
    } finally {
      setLoading(false);
    }
  }, [selectedDept, searchQuery]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Aggregate score for evaluation (out of 100)
  const computedTotalScore = useMemo(() => {
    const m = Math.min(30, Math.max(0, Number(midSemMarks) || 0));
    const p = Math.min(30, Math.max(0, Number(practicalMarks) || 0));
    const e = Math.min(40, Math.max(0, Number(endSemMarks) || 0));
    return Math.round(m + p + e);
  }, [midSemMarks, practicalMarks, endSemMarks]);

  // Handle Grade Calculation
  const handleCalculateGrade = async (e) => {
    e?.preventDefault();
    setEvalLoading(true);
    try {
      const res = await studentService.calculateGradeWithUDF(computedTotalScore);
      const selectedStudent = students.find((s) => s.roll_number === evalStudentRoll);
      setEvalResult({
        ...res,
        totalScore: computedTotalScore,
        course: evalCourse,
        student: selectedStudent || null,
        midSem: midSemMarks,
        practical: practicalMarks,
        endSem: endSemMarks,
      });
    } catch (err) {
      setEvalResult({ error: err.message });
    } finally {
      setEvalLoading(false);
    }
  };

  // Department distribution metrics
  const departmentStats = useMemo(() => {
    const counts = {};
    students.forEach((s) => {
      const dept = s.department || "Other";
      counts[dept] = (counts[dept] || 0) + 1;
    });

    const total = students.length || 1;
    return departments.map((dept) => {
      const count = counts[dept] || 0;
      const percentage = Math.round((count / total) * 100);
      return {
        name: dept,
        count,
        percentage
      };
    });
  }, [students, departments]);

  // Form Validation
  const validateForm = () => {
    const errs = {};
    if (!formData.roll_number.trim()) {
      errs.roll_number = "Roll number is required.";
    } else if (!/^[a-zA-Z0-9_-]{4,20}$/.test(formData.roll_number.trim())) {
      errs.roll_number = "Must be 4-20 alphanumeric characters (e.g. CS2026001).";
    }

    if (!formData.first_name.trim()) errs.first_name = "First name is required.";
    if (!formData.last_name.trim()) errs.last_name = "Last name is required.";

    if (!formData.email.trim()) {
      errs.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      errs.email = "Invalid email address.";
    }

    if (!formData.mobile.trim()) {
      errs.mobile = "Mobile number is required.";
    } else if (!/^[0-9+\s-]{8,15}$/.test(formData.mobile.trim())) {
      errs.mobile = "Invalid mobile number format.";
    }

    if (!formData.department) errs.department = "Department is required.";

    setFormErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "semester" ? parseInt(value, 10) : value
    }));
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  // Open Add Dialog
  const handleOpenAdd = () => {
    setFormData(INITIAL_FORM);
    setFormErrors({});
    setIsAddModalOpen(true);
  };

  // Submit Add
  const handleSubmitAdd = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setFormSubmitting(true);
    try {
      const res = await studentService.createStudent(formData);
      setIsAddModalOpen(false);
      setSuccessBanner(`Student record created successfully: ${formData.first_name} ${formData.last_name} (${formData.roll_number.toUpperCase()})`);
      loadData();
      setTimeout(() => setSuccessBanner(null), 4000);
    } catch (err) {
      setFormErrors({ form: err.message });
    } finally {
      setFormSubmitting(false);
    }
  };

  // Open Edit Dialog
  const handleOpenEdit = (student) => {
    setStudentToEdit(student);
    setFormData({
      roll_number: student.roll_number,
      first_name: student.first_name,
      last_name: student.last_name,
      email: student.email,
      mobile: student.mobile,
      department: student.department,
      semester: student.semester,
      division: student.division || "A"
    });
    setFormErrors({});
    setIsEditModalOpen(true);
  };

  // Submit Edit
  const handleSubmitEdit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setFormSubmitting(true);
    try {
      await studentService.updateStudent(studentToEdit.id, formData);
      setIsEditModalOpen(false);
      setSuccessBanner(`Student #${studentToEdit.id} (${formData.roll_number}) updated successfully.`);
      loadData();
      setTimeout(() => setSuccessBanner(null), 4000);
    } catch (err) {
      setFormErrors({ form: err.message });
    } finally {
      setFormSubmitting(false);
    }
  };

  // Open Delete Dialog
  const handleOpenDelete = (student) => {
    setStudentToDelete(student);
    setIsDeleteModalOpen(true);
  };

  // Submit Delete
  const handleSubmitDelete = async () => {
    if (!studentToDelete) return;
    setFormSubmitting(true);
    try {
      await studentService.deleteStudent(studentToDelete.id);
      setIsDeleteModalOpen(false);
      setSuccessBanner(`Student record for ${studentToDelete.first_name} ${studentToDelete.last_name} (${studentToDelete.roll_number}) removed.`);
      loadData();
      setTimeout(() => setSuccessBanner(null), 4000);
    } catch (err) {
      setError(err.message);
    } finally {
      setFormSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* 1. Module Header */}
      <div className="flex flex-col gap-1 rounded-lg border border-slate-200 bg-white p-5 shadow-2xs">
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
          Student Academic Records
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 max-w-3xl leading-relaxed">
          Manage student directory records, department allocations, academic grading calculations, and enrollment metrics.
        </p>
      </div>

      {/* 2. Success Banner */}
      {successBanner && (
        <div className="rounded-md border border-emerald-200 bg-emerald-50 p-3 text-xs text-emerald-800 flex items-center justify-between shadow-2xs">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
            <span className="font-medium">{successBanner}</span>
          </div>
          <button
            type="button"
            onClick={() => setSuccessBanner(null)}
            className="text-emerald-700 hover:text-emerald-900 font-bold"
          >
            ×
          </button>
        </div>
      )}

      {/* 3. Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-2">
        {[
          { id: "directory", label: "Student Directory", icon: Users },
          { id: "evaluation", label: "Grade Evaluation", icon: Calculator },
          { id: "departments", label: "Department Allocations", icon: Building2 },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                isActive
                  ? "bg-blue-600 text-white font-semibold shadow-2xs"
                  : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              <Icon className={`h-3.5 w-3.5 ${isActive ? "text-white" : "text-slate-400"}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* ============================================================
       * SECTION 1: STUDENT DIRECTORY
       * ============================================================ */}
      {activeTab === "directory" && (
        <Card className="border-slate-200 shadow-2xs">
          <CardHeader className="pb-3 border-b border-slate-100">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <CardTitle className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2">
                  <Users className="h-4 w-4 text-blue-600" />
                  Academic Student Management
                </CardTitle>
                <CardDescription className="text-xs text-slate-500 mt-0.5">
                  Manage and view all registered student records.
                </CardDescription>
              </div>
              {canModify && (
                <Button
                  onClick={handleOpenAdd}
                  size="sm"
                  className="bg-blue-600 hover:bg-blue-700 text-white text-xs flex items-center gap-1.5 self-start sm:self-auto shadow-2xs"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>Add Student</span>
                </Button>
              )}
            </div>
          </CardHeader>

          <CardContent className="pt-4 space-y-4">
            
            {/* Filter & Search Bar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
                <Input
                  type="text"
                  placeholder="Search by name, roll number, or email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8 text-xs h-9"
                />
              </div>

              {/* Department Dropdown */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500 font-medium shrink-0 flex items-center gap-1">
                  <Filter className="h-3.5 w-3.5 text-slate-400" />
                  <span>Department:</span>
                </span>
                <select
                  value={selectedDept}
                  onChange={(e) => setSelectedDept(e.target.value)}
                  className="rounded-md border border-slate-300 bg-white px-2.5 py-1.5 text-xs text-slate-900 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600 h-9"
                >
                  <option value="all">All Departments ({departments.length})</option>
                  {departments.map((dept) => (
                    <option key={dept} value={dept}>
                      {dept}
                    </option>
                  ))}
                </select>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={loadData}
                className="text-xs h-9 shrink-0 flex items-center gap-1"
                title="Refresh Table"
              >
                <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
                <span>Reload</span>
              </Button>
            </div>

            {/* Error Message */}
            {error && (
              <div className="rounded-md border border-rose-200 bg-rose-50 p-3 text-xs text-rose-800 flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-rose-600 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Student Records Table */}
            <div className="overflow-x-auto rounded-md border border-slate-200">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-50 border-b border-slate-200 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                  <tr>
                    <th className="py-2.5 px-3">Roll No</th>
                    <th className="py-2.5 px-3">Student Name</th>
                    <th className="py-2.5 px-3">Department</th>
                    <th className="py-2.5 px-3 text-center">Sem / Div</th>
                    <th className="py-2.5 px-3">Email</th>
                    <th className="py-2.5 px-3">Mobile</th>
                    <th className="py-2.5 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {loading ? (
                    <tr>
                      <td colSpan="7" className="py-8 text-center text-slate-400">
                        <RefreshCw className="h-5 w-5 animate-spin mx-auto mb-2 text-blue-600" />
                        Loading student records...
                      </td>
                    </tr>
                  ) : students.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="py-8 text-center text-slate-400">
                        No students found matching the selected filter.
                      </td>
                    </tr>
                  ) : (
                    students.map((student) => (
                      <tr key={student.id} className="hover:bg-slate-50/75 transition-colors">
                        <td className="py-2.5 px-3 font-mono font-semibold text-blue-700">
                          {student.roll_number}
                        </td>
                        <td className="py-2.5 px-3 font-medium text-slate-900">
                          {student.first_name} {student.last_name}
                        </td>
                        <td className="py-2.5 px-3 text-slate-600">
                          <span className="inline-block max-w-[200px] truncate" title={student.department}>
                            {student.department}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-center">
                          <span className="inline-flex items-center rounded-md bg-slate-100 px-1.5 py-0.5 text-[10px] font-medium text-slate-700">
                            Sem {student.semester} - {student.division || "A"}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-slate-500 font-mono text-[11px]">
                          {student.email}
                        </td>
                        <td className="py-2.5 px-3 text-slate-500 font-mono text-[11px]">
                          {student.mobile}
                        </td>
                        <td className="py-2.5 px-3 text-right space-x-1 whitespace-nowrap">
                          {canModify && (
                            <button
                              type="button"
                              onClick={() => handleOpenEdit(student)}
                              className="rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-blue-600 transition-colors"
                              title="Edit Student"
                            >
                              <Edit2 className="h-3.5 w-3.5" />
                            </button>
                          )}
                          {isAdmin ? (
                            <button
                              type="button"
                              onClick={() => handleOpenDelete(student)}
                              className="rounded p-1 text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition-colors"
                              title="Delete Student"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          ) : (
                            <span 
                              className="inline-block p-1 text-slate-300 cursor-not-allowed" 
                              title="Admin authorization required to delete student records"
                            >
                              <Trash2 className="h-3.5 w-3.5 opacity-40" />
                            </span>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Footer Summary */}
            <div className="flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500 pt-1">
              <span>Showing {students.length} student records</span>
              <span className="font-mono text-slate-400">Total Departments: {departments.length}</span>
            </div>

          </CardContent>
        </Card>
      )}

      {/* ============================================================
       * SECTION 2: GRADE & PERFORMANCE EVALUATION (REAL ACADEMIC APP)
       * ============================================================ */}
      {activeTab === "evaluation" && (
        <div className="space-y-6">
          <Card className="border-slate-200 shadow-2xs">
            <CardHeader className="pb-3 border-b border-slate-100">
              <CardTitle className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2">
                <Calculator className="h-4 w-4 text-blue-600" />
                Academic Grade & Performance Evaluation
              </CardTitle>
              <CardDescription className="text-xs text-slate-500">
                Calculate letter grades, grade points, and academic standing based on semester assessment components.
              </CardDescription>
            </CardHeader>

            <CardContent className="pt-4 space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* Assessment Input Form (Left Column) */}
                <div className="lg:col-span-7 space-y-4">
                  <div className="rounded-lg border border-slate-200 bg-slate-50/50 p-4 space-y-4">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                      Assessment Component Breakdown
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-medium text-slate-700 mb-1">
                          Select Enrolled Student (Optional)
                        </label>
                        <select
                          value={evalStudentRoll}
                          onChange={(e) => setEvalStudentRoll(e.target.value)}
                          className="w-full rounded-md border border-slate-300 bg-white px-2.5 py-1.5 text-xs text-slate-900 h-9"
                        >
                          <option value="">General Evaluation / Demo</option>
                          {students.map((s) => (
                            <option key={s.id} value={s.roll_number}>
                              {s.roll_number} — {s.first_name} {s.last_name}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-[11px] font-medium text-slate-700 mb-1">
                          Academic Course
                        </label>
                        <select
                          value={evalCourse}
                          onChange={(e) => setEvalCourse(e.target.value)}
                          className="w-full rounded-md border border-slate-300 bg-white px-2.5 py-1.5 text-xs text-slate-900 h-9"
                        >
                          <option value="CS501 - Full Stack Web Development">CS501 - Full Stack Web Development</option>
                          <option value="CS502 - Database Management Systems">CS502 - Database Management Systems</option>
                          <option value="CS503 - Computer Networks">CS503 - Computer Networks</option>
                          <option value="CS504 - Operating Systems">CS504 - Operating Systems</option>
                          <option value="CS505 - Design & Analysis of Algorithms">CS505 - Design & Analysis of Algorithms</option>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-3 pt-2 border-t border-slate-200/60">
                      {/* Mid-Sem Exam */}
                      <div>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="font-medium text-slate-700">1. Mid-Semester Theory Exam (Weight: 30%)</span>
                          <span className="font-mono font-bold text-blue-700">{midSemMarks} / 30</span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="30"
                          value={midSemMarks}
                          onChange={(e) => setMidSemMarks(Number(e.target.value))}
                          className="w-full accent-blue-600"
                        />
                      </div>

                      {/* Lab Work */}
                      <div>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="font-medium text-slate-700">2. Continuous Practical & Lab Work (Weight: 30%)</span>
                          <span className="font-mono font-bold text-blue-700">{practicalMarks} / 30</span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="30"
                          value={practicalMarks}
                          onChange={(e) => setPracticalMarks(Number(e.target.value))}
                          className="w-full accent-blue-600"
                        />
                      </div>

                      {/* End-Sem Exam */}
                      <div>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="font-medium text-slate-700">3. End-Semester Final Exam (Weight: 40%)</span>
                          <span className="font-mono font-bold text-blue-700">{endSemMarks} / 40</span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="40"
                          value={endSemMarks}
                          onChange={(e) => setEndSemMarks(Number(e.target.value))}
                          className="w-full accent-blue-600"
                        />
                      </div>
                    </div>

                    {/* Total Score Display Bar */}
                    <div className="flex items-center justify-between rounded-md bg-blue-50/75 border border-blue-200 p-3">
                      <div>
                        <span className="text-xs font-semibold text-slate-800 block">Computed Aggregate Score</span>
                        <span className="text-[11px] text-slate-500">Sum of continuous & term-end assessments</span>
                      </div>
                      <div className="text-right">
                        <span className="text-xl font-bold text-blue-800 font-mono">{computedTotalScore}</span>
                        <span className="text-xs text-slate-500 font-mono"> / 100</span>
                      </div>
                    </div>

                    <Button
                      onClick={handleCalculateGrade}
                      disabled={evalLoading}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white text-xs shadow-2xs h-10"
                    >
                      {evalLoading ? "Evaluating Grade..." : `Evaluate Grade (${computedTotalScore} Total Marks)`}
                    </Button>
                  </div>
                </div>

                {/* Grade Card Result (Right Column) */}
                <div className="lg:col-span-5 flex flex-col justify-between">
                  <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-2xs space-y-4">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 border-b border-slate-100 pb-2 flex items-center justify-between">
                      <span>Official Academic Grade Card</span>
                      <Award className="h-4 w-4 text-amber-500" />
                    </h3>

                    {evalResult ? (
                      <div className="space-y-4">
                        {evalResult.student && (
                          <div className="bg-slate-50 rounded-md p-3 border border-slate-200 text-xs">
                            <span className="text-[11px] text-slate-500 block">Candidate:</span>
                            <span className="font-bold text-slate-900">{evalResult.student.first_name} {evalResult.student.last_name}</span>
                            <span className="text-slate-500 block font-mono text-[11px] mt-0.5">{evalResult.student.roll_number} • {evalResult.student.department}</span>
                          </div>
                        )}

                        <div className="rounded-lg bg-emerald-50/80 border border-emerald-200 p-4 text-center">
                          <span className="text-[11px] uppercase font-bold text-emerald-700 tracking-wider block">Awarded Grade & Points</span>
                          <div className="text-3xl font-black text-emerald-900 mt-1">{evalResult.grade}</div>
                          <span className="text-xs font-medium text-emerald-700 mt-1 block">
                            {computedTotalScore >= 85 ? "Passed with Distinction" : computedTotalScore >= 65 ? "Passed (First Class)" : computedTotalScore >= 35 ? "Passed (General)" : "Remedial Required"}
                          </span>
                        </div>

                        {/* Breakdown Table */}
                        <div className="rounded-md border border-slate-200 overflow-hidden text-xs">
                          <table className="w-full text-left">
                            <thead className="bg-slate-50 text-[11px] font-semibold text-slate-500 border-b border-slate-200">
                              <tr>
                                <th className="p-2">Component</th>
                                <th className="p-2 text-right">Marks</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 text-slate-700 text-[11px]">
                              <tr>
                                <td className="p-2">Mid-Semester Exam</td>
                                <td className="p-2 text-right font-mono">{midSemMarks} / 30</td>
                              </tr>
                              <tr>
                                <td className="p-2">Continuous Practical/Lab</td>
                                <td className="p-2 text-right font-mono">{practicalMarks} / 30</td>
                              </tr>
                              <tr>
                                <td className="p-2">End-Semester Final</td>
                                <td className="p-2 text-right font-mono">{endSemMarks} / 40</td>
                              </tr>
                              <tr className="font-bold bg-slate-50 text-slate-900">
                                <td className="p-2">Total Score</td>
                                <td className="p-2 text-right font-mono">{computedTotalScore} / 100</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>

                        <div className="text-[11px] text-slate-500 pt-1">
                          <span className="font-medium text-slate-700">Course:</span> {evalCourse}
                        </div>
                      </div>
                    ) : (
                      <div className="rounded-lg border border-dashed border-slate-200 p-8 text-center text-slate-400 space-y-2">
                        <Award className="h-8 w-8 mx-auto text-slate-300" />
                        <p className="text-xs text-slate-500">
                          Configure assessment marks on the left and click "Evaluate Grade" to generate the academic grade report.
                        </p>
                      </div>
                    )}
                  </div>
                </div>

              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* ============================================================
       * SECTION 3: DEPARTMENT ALLOCATIONS & ENROLLMENT METRICS
       * ============================================================ */}
      {activeTab === "departments" && (
        <div className="space-y-6">
          <Card className="border-slate-200 shadow-2xs">
            <CardHeader className="pb-3 border-b border-slate-100">
              <CardTitle className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2">
                <Building2 className="h-4 w-4 text-blue-600" />
                Department Allocations & Branch Distribution
              </CardTitle>
              <CardDescription className="text-xs text-slate-500">
                Department-wise student distribution across engineering and technology branches.
              </CardDescription>
            </CardHeader>

            <CardContent className="pt-4 space-y-6">
              
              {/* Summary Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {departmentStats.map((dept) => (
                  <Card key={dept.name} className="border-slate-200 shadow-2xs">
                    <CardHeader className="p-4 pb-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-slate-700 truncate max-w-[200px]" title={dept.name}>
                          {dept.name}
                        </span>
                        <Badge variant="secondary" className="text-[10px] font-mono">
                          {dept.percentage}% Share
                        </Badge>
                      </div>
                      <CardTitle className="text-2xl font-bold text-slate-900 mt-1">
                        {dept.count} <span className="text-xs font-normal text-slate-500">Enrolled Students</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-0 space-y-2">
                      <div className="w-full bg-slate-100 rounded-full h-2 mt-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${Math.max(dept.percentage, 5)}%` }}
                        />
                      </div>
                      <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                        <span>Active Term: Sem 5</span>
                        <span className="font-medium text-blue-600">Division A & B</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

            </CardContent>
          </Card>
        </div>
      )}

      {/* ============================================================
       * MODAL: ADD STUDENT
       * ============================================================ */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent onClose={() => setIsAddModalOpen(false)}>
          <DialogHeader>
            <DialogTitle>Add Student Record</DialogTitle>
            <DialogDescription>
              Enter academic details to add a new student record.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmitAdd} className="space-y-3 py-2">
            {formErrors.form && (
              <div className="rounded bg-rose-50 border border-rose-200 p-2 text-xs text-rose-700">
                {formErrors.form}
              </div>
            )}

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-medium text-slate-700 mb-1">Roll Number *</label>
                <Input
                  name="roll_number"
                  placeholder="e.g. CS2026006"
                  value={formData.roll_number}
                  onChange={handleInputChange}
                  className={formErrors.roll_number ? "border-rose-400" : ""}
                />
                {formErrors.roll_number && <span className="text-[10px] text-rose-600">{formErrors.roll_number}</span>}
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-700 mb-1">Mobile Number *</label>
                <Input
                  name="mobile"
                  placeholder="e.g. 9876543210"
                  value={formData.mobile}
                  onChange={handleInputChange}
                  className={formErrors.mobile ? "border-rose-400" : ""}
                />
                {formErrors.mobile && <span className="text-[10px] text-rose-600">{formErrors.mobile}</span>}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-medium text-slate-700 mb-1">First Name *</label>
                <Input
                  name="first_name"
                  placeholder="e.g. Priya"
                  value={formData.first_name}
                  onChange={handleInputChange}
                  className={formErrors.first_name ? "border-rose-400" : ""}
                />
                {formErrors.first_name && <span className="text-[10px] text-rose-600">{formErrors.first_name}</span>}
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-700 mb-1">Last Name *</label>
                <Input
                  name="last_name"
                  placeholder="e.g. Desai"
                  value={formData.last_name}
                  onChange={handleInputChange}
                  className={formErrors.last_name ? "border-rose-400" : ""}
                />
                {formErrors.last_name && <span className="text-[10px] text-rose-600">{formErrors.last_name}</span>}
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-700 mb-1">Email ID *</label>
              <Input
                name="email"
                type="email"
                placeholder="priya.desai@university.edu"
                value={formData.email}
                onChange={handleInputChange}
                className={formErrors.email ? "border-rose-400" : ""}
              />
              {formErrors.email && <span className="text-[10px] text-rose-600">{formErrors.email}</span>}
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="col-span-1">
                <label className="block text-[11px] font-medium text-slate-700 mb-1">Department</label>
                <select
                  name="department"
                  value={formData.department}
                  onChange={handleInputChange}
                  className="w-full rounded-md border border-slate-300 bg-white px-2.5 py-1.5 text-xs text-slate-900"
                >
                  <option value="Computer Science & Engineering">CSE</option>
                  <option value="Information Technology">IT</option>
                  <option value="Electronics & Communication">ECE</option>
                  <option value="Mechanical Engineering">ME</option>
                  <option value="Civil Engineering">Civil</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-700 mb-1">Semester</label>
                <select
                  name="semester"
                  value={formData.semester}
                  onChange={handleInputChange}
                  className="w-full rounded-md border border-slate-300 bg-white px-2.5 py-1.5 text-xs text-slate-900"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
                    <option key={s} value={s}>
                      Sem {s}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-700 mb-1">Division</label>
                <select
                  name="division"
                  value={formData.division}
                  onChange={handleInputChange}
                  className="w-full rounded-md border border-slate-300 bg-white px-2.5 py-1.5 text-xs text-slate-900"
                >
                  <option value="A">Div A</option>
                  <option value="B">Div B</option>
                  <option value="C">Div C</option>
                </select>
              </div>
            </div>

            <DialogFooter className="pt-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setIsAddModalOpen(false)}
                disabled={formSubmitting}
                className="text-xs"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                size="sm"
                disabled={formSubmitting}
                className="bg-blue-600 hover:bg-blue-700 text-white text-xs"
              >
                {formSubmitting ? "Creating..." : "Save Record"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* ============================================================
       * MODAL: EDIT STUDENT
       * ============================================================ */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent onClose={() => setIsEditModalOpen(false)}>
          <DialogHeader>
            <DialogTitle>Edit Student Record</DialogTitle>
            <DialogDescription>
              Modify academic details for {studentToEdit?.first_name} {studentToEdit?.last_name} ({studentToEdit?.roll_number}).
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmitEdit} className="space-y-3 py-2">
            {formErrors.form && (
              <div className="rounded bg-rose-50 border border-rose-200 p-2 text-xs text-rose-700">
                {formErrors.form}
              </div>
            )}

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-medium text-slate-700 mb-1">Roll Number *</label>
                <Input
                  name="roll_number"
                  value={formData.roll_number}
                  onChange={handleInputChange}
                  className={formErrors.roll_number ? "border-rose-400 font-mono" : "font-mono"}
                />
                {formErrors.roll_number && <span className="text-[10px] text-rose-600">{formErrors.roll_number}</span>}
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-700 mb-1">Mobile Number *</label>
                <Input
                  name="mobile"
                  value={formData.mobile}
                  onChange={handleInputChange}
                  className={formErrors.mobile ? "border-rose-400" : ""}
                />
                {formErrors.mobile && <span className="text-[10px] text-rose-600">{formErrors.mobile}</span>}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-medium text-slate-700 mb-1">First Name *</label>
                <Input
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleInputChange}
                  className={formErrors.first_name ? "border-rose-400" : ""}
                />
                {formErrors.first_name && <span className="text-[10px] text-rose-600">{formErrors.first_name}</span>}
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-700 mb-1">Last Name *</label>
                <Input
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleInputChange}
                  className={formErrors.last_name ? "border-rose-400" : ""}
                />
                {formErrors.last_name && <span className="text-[10px] text-rose-600">{formErrors.last_name}</span>}
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-700 mb-1">Email ID *</label>
              <Input
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                className={formErrors.email ? "border-rose-400" : ""}
              />
              {formErrors.email && <span className="text-[10px] text-rose-600">{formErrors.email}</span>}
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="col-span-1">
                <label className="block text-[11px] font-medium text-slate-700 mb-1">Department</label>
                <select
                  name="department"
                  value={formData.department}
                  onChange={handleInputChange}
                  className="w-full rounded-md border border-slate-300 bg-white px-2.5 py-1.5 text-xs text-slate-900"
                >
                  <option value="Computer Science & Engineering">CSE</option>
                  <option value="Information Technology">IT</option>
                  <option value="Electronics & Communication">ECE</option>
                  <option value="Mechanical Engineering">ME</option>
                  <option value="Civil Engineering">Civil</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-700 mb-1">Semester</label>
                <select
                  name="semester"
                  value={formData.semester}
                  onChange={handleInputChange}
                  className="w-full rounded-md border border-slate-300 bg-white px-2.5 py-1.5 text-xs text-slate-900"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
                    <option key={s} value={s}>
                      Sem {s}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-700 mb-1">Division</label>
                <select
                  name="division"
                  value={formData.division}
                  onChange={handleInputChange}
                  className="w-full rounded-md border border-slate-300 bg-white px-2.5 py-1.5 text-xs text-slate-900"
                >
                  <option value="A">Div A</option>
                  <option value="B">Div B</option>
                  <option value="C">Div C</option>
                </select>
              </div>
            </div>

            <DialogFooter className="pt-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setIsEditModalOpen(false)}
                disabled={formSubmitting}
                className="text-xs"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                size="sm"
                disabled={formSubmitting}
                className="bg-blue-600 hover:bg-blue-700 text-white text-xs"
              >
                {formSubmitting ? "Saving..." : "Update Record"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* ============================================================
       * MODAL: DELETE STUDENT
       * ============================================================ */}
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent onClose={() => setIsDeleteModalOpen(false)}>
          <DialogHeader>
            <DialogTitle className="text-rose-600 flex items-center gap-2">
              <Trash2 className="h-4 w-4" />
              Delete Student Record
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to permanently delete record for <strong>{studentToDelete?.first_name} {studentToDelete?.last_name}</strong> (Roll No: <span className="font-mono text-slate-700">{studentToDelete?.roll_number}</span>)?
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsDeleteModalOpen(false)}
              disabled={formSubmitting}
              className="text-xs"
            >
              Cancel
            </Button>
            <Button
              type="button"
              size="sm"
              onClick={handleSubmitDelete}
              disabled={formSubmitting}
              className="bg-rose-600 hover:bg-rose-700 text-white text-xs"
            >
              {formSubmitting ? "Deleting..." : "Confirm Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  );
}
