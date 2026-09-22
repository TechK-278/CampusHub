import React, { useState, useEffect, useCallback } from "react";
import {
  Users,
  Database,
  Plus,
  Search,
  Filter,
  Trash2,
  Edit2,
  RefreshCw,
  Calculator,
  AlertTriangle,
  CheckCircle2,
  HelpCircle,
  Layers,
  GraduationCap,
  Sparkles,
  ShieldAlert
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
  const [activeTab, setActiveTab] = useState("directory"); // "directory", "udf", "drop-table"
  const [students, setStudents] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [selectedDept, setSelectedDept] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dbStatus, setDbStatus] = useState({ connected: false, loading: true });

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

  // UDF states
  const [udfScore, setUdfScore] = useState(88);
  const [udfResult, setUdfResult] = useState(null);
  const [udfLoading, setUdfLoading] = useState(false);

  // Drop table demo states
  const [confirmDropCheck, setConfirmDropCheck] = useState(false);
  const [dropDemoLog, setDropDemoLog] = useState(null);
  const [dropDemoLoading, setDropDemoLoading] = useState(false);

  // Check DB health
  const checkDb = useCallback(async () => {
    setDbStatus((prev) => ({ ...prev, loading: true }));
    const health = await studentService.getDatabaseHealth();
    if (health.ok && health.data.status === "connected") {
      setDbStatus({
        connected: true,
        loading: false,
        database: health.data.database,
        version: health.data.version
      });
    } else {
      setDbStatus({
        connected: false,
        loading: false,
        error: health.data.error || "Unable to connect to MySQL"
      });
    }
  }, []);

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
    checkDb();
    loadData();
  }, [checkDb, loadData]);

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
    setFormData((prev) => ({ ...prev, [name]: value }));
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
      division: student.division
    });
    setFormErrors({});
    setIsEditModalOpen(true);
  };

  // Submit Add
  const handleSubmitAdd = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setFormSubmitting(true);
    try {
      await studentService.createStudent(formData);
      setIsAddModalOpen(false);
      setSuccessBanner(`Student '${formData.first_name} ${formData.last_name}' added successfully to MySQL.`);
      loadData();
      checkDb();
      setTimeout(() => setSuccessBanner(null), 4000);
    } catch (err) {
      setFormErrors((prev) => ({ ...prev, form: err.message }));
    } finally {
      setFormSubmitting(false);
    }
  };

  // Submit Edit
  const handleSubmitEdit = async (e) => {
    e.preventDefault();
    if (!validateForm() || !studentToEdit) return;

    setFormSubmitting(true);
    try {
      await studentService.updateStudent(studentToEdit.id, formData);
      setIsEditModalOpen(false);
      setStudentToEdit(null);
      setSuccessBanner(`Student '${formData.first_name} ${formData.last_name}' updated successfully in MySQL.`);
      loadData();
      setTimeout(() => setSuccessBanner(null), 4000);
    } catch (err) {
      setFormErrors((prev) => ({ ...prev, form: err.message }));
    } finally {
      setFormSubmitting(false);
    }
  };

  // Delete Confirm
  const handleConfirmDelete = async () => {
    if (!studentToDelete) return;
    setFormSubmitting(true);
    try {
      await studentService.deleteStudent(studentToDelete.id);
      setIsDeleteModalOpen(false);
      setSuccessBanner(`Student record (${studentToDelete.roll_number}) deleted from MySQL.`);
      setStudentToDelete(null);
      loadData();
      checkDb();
      setTimeout(() => setSuccessBanner(null), 4000);
    } catch (err) {
      setError(err.message);
    } finally {
      setFormSubmitting(false);
    }
  };

  // Test UDF
  const handleExecuteUdf = async () => {
    setUdfLoading(true);
    try {
      const res = await studentService.calculateGradeWithUDF(udfScore);
      setUdfResult(res);
    } catch (err) {
      setUdfResult({ error: err.message });
    } finally {
      setUdfLoading(false);
    }
  };

  // Run Drop Table Demo
  const handleRunDropDemo = async () => {
    setDropDemoLoading(true);
    try {
      const res = await studentService.executeDropTableDemo();
      setDropDemoLog(res);
    } catch (err) {
      setDropDemoLog({ error: err.message });
    } finally {
      setDropDemoLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* 1. Module Header Banner with DB Health Indicator */}
      <div className="flex flex-col gap-3 rounded-lg border border-slate-200 bg-white p-5 sm:flex-row sm:items-center sm:justify-between shadow-2xs">
        <div className="space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-0.5 text-xs font-semibold text-blue-700 border border-blue-200">
              Practical 8
            </span>
            <span className="inline-flex items-center rounded-md bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-700 border border-slate-200">
              Node.js + MySQL 8.x
            </span>
            <span className="inline-flex items-center rounded-md bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700 border border-emerald-200">
              Direct SQL (mysql2/promise)
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
            Student Academic Records & MySQL Relational Engine
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 max-w-3xl leading-relaxed">
            Demonstrates real MySQL database integration using Node.js & <code>mysql2/promise</code> connection pool, full CRUD operations, <code>SELECT DISTINCT</code>, parameterized queries, and MySQL stored functions.
          </p>
        </div>

        {/* Database Live Status Card */}
        <div className="shrink-0 pt-2 sm:pt-0">
          <div className={`flex items-center gap-2 rounded-md border p-2.5 text-xs ${
            dbStatus.connected
              ? "bg-emerald-50/70 border-emerald-200 text-emerald-800"
              : "bg-amber-50/70 border-amber-200 text-amber-800"
          }`}>
            <Database className="h-4 w-4 shrink-0" />
            <div>
              <div className="flex items-center gap-1.5 font-semibold">
                <span className={`h-2 w-2 rounded-full ${dbStatus.connected ? "bg-emerald-500 animate-pulse" : "bg-amber-500"}`}></span>
                <span>{dbStatus.connected ? `MySQL Connected` : `DB Disconnected`}</span>
              </div>
              <span className="text-[10px] text-slate-500 block">
                {dbStatus.connected ? `DB: ${dbStatus.database} (v${dbStatus.version || "8.0"})` : `Check .env credentials`}
              </span>
            </div>
            <button
              type="button"
              onClick={checkDb}
              className="ml-1 rounded p-1 text-slate-400 hover:text-slate-700 transition-colors"
              title="Refresh Database Status"
            >
              <RefreshCw className="h-3 w-3" />
            </button>
          </div>
        </div>
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

      {/* 3. Navigation Tabs for Practical 8 Sections */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-2">
        {[
          { id: "directory", label: "1. Student Directory (CRUD & DISTINCT)", icon: Users },
          { id: "udf", label: "2. User-Defined Function (calculate_grade)", icon: Calculator },
          { id: "drop-table", label: "3. DROP TABLE Demonstration", icon: ShieldAlert },
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
       * SECTION 1: STUDENT DIRECTORY (SELECT, INSERT, UPDATE, DELETE, DISTINCT)
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
                  Direct MySQL relational records stored in table <code>campushub.students</code>.
                </CardDescription>
              </div>
              <Button
                onClick={handleOpenAdd}
                size="sm"
                className="bg-blue-600 hover:bg-blue-700 text-white text-xs flex items-center gap-1.5 self-start sm:self-auto shadow-2xs"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Add Student (INSERT)</span>
              </Button>
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

              {/* Requirement 5: SELECT DISTINCT Department Dropdown */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500 font-medium shrink-0 flex items-center gap-1">
                  <Filter className="h-3.5 w-3.5 text-slate-400" />
                  <span>Dept (DISTINCT):</span>
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
                    <th scope="col" className="px-3.5 py-2.5">Roll No</th>
                    <th scope="col" className="px-3.5 py-2.5">Student Name</th>
                    <th scope="col" className="px-3.5 py-2.5">Contact Details</th>
                    <th scope="col" className="px-3.5 py-2.5">Department</th>
                    <th scope="col" className="px-3.5 py-2.5 text-center">Sem / Div</th>
                    <th scope="col" className="px-3.5 py-2.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {loading ? (
                    <tr>
                      <td colSpan={6} className="px-3.5 py-8 text-center text-xs text-slate-500">
                        <div className="flex items-center justify-center gap-2">
                          <RefreshCw className="h-4 w-4 animate-spin text-blue-600" />
                          <span>Querying MySQL database...</span>
                        </div>
                      </td>
                    </tr>
                  ) : students.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-3.5 py-8 text-center text-xs text-slate-500">
                        No student records found in MySQL. Click <strong>Add Student</strong> to insert one.
                      </td>
                    </tr>
                  ) : (
                    students.map((student) => (
                      <tr key={student.id} className="transition-colors hover:bg-slate-50/80">
                        <td className="px-3.5 py-2.5 font-mono font-semibold text-blue-700">
                          {student.roll_number}
                        </td>
                        <td className="px-3.5 py-2.5 font-medium text-slate-900">
                          {student.first_name} {student.last_name}
                        </td>
                        <td className="px-3.5 py-2.5 text-slate-600">
                          <div>{student.email}</div>
                          <div className="text-[10px] text-slate-400 font-mono">+91 {student.mobile}</div>
                        </td>
                        <td className="px-3.5 py-2.5 text-slate-600">
                          <Badge variant="outline" className="text-[10px]">
                            {student.department}
                          </Badge>
                        </td>
                        <td className="px-3.5 py-2.5 text-center font-mono">
                          Sem {student.semester} - Div {student.division}
                        </td>
                        <td className="px-3.5 py-2.5 text-right space-x-1 shrink-0">
                          <button
                            type="button"
                            onClick={() => handleOpenEdit(student)}
                            className="rounded p-1 text-slate-400 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                            title="Edit Student (UPDATE)"
                          >
                            <Edit2 className="h-3.5 w-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setStudentToDelete(student);
                              setIsDeleteModalOpen(true);
                            }}
                            className="rounded p-1 text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition-colors"
                            title="Delete Student (DELETE)"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Footer Summary */}
            <div className="flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500 pt-1">
              <span>Showing {students.length} student records from MySQL <code>campushub.students</code></span>
              <span className="font-mono text-slate-400">Total Departments: {departments.length}</span>
            </div>

          </CardContent>
        </Card>
      )}

      {/* ============================================================
       * SECTION 2: USER-DEFINED FUNCTION (UDF) PLAYGROUND
       * ============================================================ */}
      {activeTab === "udf" && (
        <Card className="border-slate-200 shadow-2xs">
          <CardHeader className="pb-3 border-b border-slate-100">
            <CardTitle className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2">
              <Calculator className="h-4 w-4 text-blue-600" />
              MySQL Stored User-Defined Function: <code>calculate_grade(score)</code>
            </CardTitle>
            <CardDescription className="text-xs text-slate-500">
              Demonstrates invoking an actual MySQL stored function from Node.js via <code>SELECT calculate_grade(?) AS grade</code>.
            </CardDescription>
          </CardHeader>

          <CardContent className="pt-4 space-y-6">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Interactive UDF Tester */}
              <div className="rounded-lg border border-slate-200 bg-slate-50/50 p-4 space-y-4">
                <span className="text-xs font-semibold text-slate-800 block">
                  Execute Stored Function in MySQL
                </span>

                <div className="space-y-2">
                  <label className="text-xs font-medium text-slate-700 flex justify-between">
                    <span>Numeric Academic Score (0 - 100):</span>
                    <strong className="text-blue-700 font-mono">{udfScore} / 100</strong>
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={udfScore}
                    onChange={(e) => setUdfScore(parseInt(e.target.value, 10))}
                    className="w-full accent-blue-600"
                  />
                  <div className="flex gap-2 pt-1">
                    {[95, 82, 70, 58, 48, 38, 25].map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setUdfScore(s)}
                        className="rounded border border-slate-200 bg-white px-2 py-0.5 text-[10px] text-slate-600 hover:bg-slate-100 font-mono"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                <Button
                  onClick={handleExecuteUdf}
                  disabled={udfLoading}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white text-xs shadow-2xs"
                >
                  {udfLoading ? "Querying MySQL Function..." : `Run: SELECT calculate_grade(${udfScore})`}
                </Button>
              </div>

              {/* UDF Execution Output */}
              <div className="rounded-lg border border-slate-200 bg-white p-4 space-y-3 shadow-2xs flex flex-col justify-between">
                <div>
                  <span className="text-xs font-semibold text-slate-800 block mb-2">
                    MySQL Function Output:
                  </span>

                  {udfResult ? (
                    <div className="space-y-2 text-xs">
                      <div className="rounded bg-slate-50 p-2.5 border border-slate-200">
                        <span className="text-[10px] font-mono text-slate-400 block uppercase">Executed SQL:</span>
                        <code className="text-xs font-mono font-semibold text-slate-800">{udfResult.sql}</code>
                      </div>
                      <div className="rounded bg-emerald-50/70 p-3 border border-emerald-200">
                        <span className="text-[10px] font-mono text-emerald-700 block uppercase">Calculated Grade:</span>
                        <span className="text-lg font-bold text-emerald-900">{udfResult.grade}</span>
                      </div>
                    </div>
                  ) : (
                    <div className="rounded border border-dashed border-slate-300 p-6 text-center text-xs text-slate-400">
                      Click "Run SELECT calculate_grade({udfScore})" to invoke the stored function.
                    </div>
                  )}
                </div>

                <div className="text-[11px] text-slate-500 pt-2 border-t border-slate-100">
                  * Function executes inside MySQL engine using <code>DETERMINISTIC</code> stored routine.
                </div>
              </div>

            </div>

            {/* SQL Definition Box for Viva Evaluation */}
            <div className="rounded-md border border-slate-200 bg-slate-900 text-slate-200 p-4 font-mono text-xs overflow-x-auto">
              <span className="text-[10px] font-sans font-semibold uppercase tracking-wider text-slate-400 block mb-1">
                Stored Function SQL Definition (backend/database/functions.sql)
              </span>
              <code>
CREATE FUNCTION calculate_grade(score INT)<br />
RETURNS VARCHAR(15)<br />
DETERMINISTIC<br />
BEGIN<br />
&nbsp;&nbsp;IF score &gt;= 85 THEN RETURN 'AA (10)';<br />
&nbsp;&nbsp;ELSEIF score &gt;= 75 THEN RETURN 'AB (9)';<br />
&nbsp;&nbsp;ELSEIF score &gt;= 65 THEN RETURN 'BB (8)';<br />
&nbsp;&nbsp;ELSEIF score &gt;= 55 THEN RETURN 'BC (7)';<br />
&nbsp;&nbsp;ELSEIF score &gt;= 45 THEN RETURN 'CC (6)';<br />
&nbsp;&nbsp;ELSEIF score &gt;= 35 THEN RETURN 'CD (5)';<br />
&nbsp;&nbsp;ELSE RETURN 'FF (Fail)';<br />
&nbsp;&nbsp;END IF;<br />
END;
              </code>
            </div>

          </CardContent>
        </Card>
      )}

      {/* ============================================================
       * SECTION 3: DROP TABLE DEMONSTRATION (CONTROLLED & SAFE)
       * ============================================================ */}
      {activeTab === "drop-table" && (
        <Card className="border-slate-200 shadow-2xs">
          <CardHeader className="pb-3 border-b border-slate-100">
            <CardTitle className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2">
              <ShieldAlert className="h-4 w-4 text-rose-600" />
              Requirement 8: DROP TABLE Demonstration (Controlled & Safe)
            </CardTitle>
            <CardDescription className="text-xs text-slate-500">
              Demonstrates <code>DROP TABLE IF EXISTS</code> on a temporary demo table (<code>campushub_temp_demo</code>) with explicit safety confirmation to protect production data.
            </CardDescription>
          </CardHeader>

          <CardContent className="pt-4 space-y-4">
            
            <div className="rounded-md border border-amber-200 bg-amber-50/70 p-4 text-xs text-amber-900 space-y-2">
              <div className="flex items-center gap-2 font-semibold text-amber-800">
                <AlertTriangle className="h-4 w-4 text-amber-600" />
                <span>Educational Safety Notice</span>
              </div>
              <p>
                In accordance with <code>AGENTS.md</code> and Practical 8 guidelines, destructive SQL statements such as <code>DROP TABLE</code> must never delete the active student table during routine operations. This demonstration operates on a safe, isolated table created and dropped on demand.
              </p>
            </div>

            <div className="rounded-lg border border-slate-200 bg-white p-4 space-y-4">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="confirmDrop"
                  checked={confirmDropCheck}
                  onChange={(e) => setConfirmDropCheck(e.target.checked)}
                  className="rounded border-slate-300 text-blue-600 focus:ring-blue-600"
                />
                <label htmlFor="confirmDrop" className="text-xs font-medium text-slate-700 cursor-pointer">
                  I understand this is an educational demonstration of <code>DROP TABLE IF EXISTS</code>.
                </label>
              </div>

              <Button
                onClick={handleRunDropDemo}
                disabled={!confirmDropCheck || dropDemoLoading}
                className="bg-rose-600 hover:bg-rose-700 text-white text-xs shadow-2xs"
              >
                {dropDemoLoading ? "Executing SQL..." : "Execute: DROP TABLE IF EXISTS campushub_temp_demo"}
              </Button>

              {dropDemoLog && (
                <div className="rounded-md border border-slate-200 bg-slate-900 text-slate-100 p-3.5 font-mono text-xs overflow-x-auto space-y-1">
                  <div className="text-[10px] font-sans font-semibold uppercase text-emerald-400">
                    Execution Log:
                  </div>
                  <div>SQL: <code>{dropDemoLog.sql}</code></div>
                  <div className="text-slate-300">{dropDemoLog.message}</div>
                </div>
              )}
            </div>

          </CardContent>
        </Card>
      )}

      {/* ============================================================
       * MODAL: ADD STUDENT (INSERT)
       * ============================================================ */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent onClose={() => setIsAddModalOpen(false)}>
          <DialogHeader>
            <DialogTitle>Insert Student Record (MySQL INSERT)</DialogTitle>
            <DialogDescription>
              Enter academic credentials to insert a new record into <code>campushub.students</code>.
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
              <Button type="button" variant="outline" size="sm" onClick={() => setIsAddModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" size="sm" disabled={formSubmitting} className="bg-blue-600 hover:bg-blue-700 text-white">
                {formSubmitting ? "Inserting..." : "Insert into MySQL"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* ============================================================
       * MODAL: EDIT STUDENT (UPDATE)
       * ============================================================ */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent onClose={() => setIsEditModalOpen(false)}>
          <DialogHeader>
            <DialogTitle>Update Student Record (MySQL UPDATE)</DialogTitle>
            <DialogDescription>
              Modify academic details for ID #{studentToEdit?.id} ({studentToEdit?.roll_number}).
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
                  className={formErrors.roll_number ? "border-rose-400" : ""}
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-700 mb-1">Mobile Number *</label>
                <Input
                  name="mobile"
                  value={formData.mobile}
                  onChange={handleInputChange}
                  className={formErrors.mobile ? "border-rose-400" : ""}
                />
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
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-700 mb-1">Last Name *</label>
                <Input
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleInputChange}
                  className={formErrors.last_name ? "border-rose-400" : ""}
                />
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
              <Button type="button" variant="outline" size="sm" onClick={() => setIsEditModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" size="sm" disabled={formSubmitting} className="bg-blue-600 hover:bg-blue-700 text-white">
                {formSubmitting ? "Updating..." : "Save Changes"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* ============================================================
       * MODAL: DELETE CONFIRMATION (DELETE)
       * ============================================================ */}
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent onClose={() => setIsDeleteModalOpen(false)}>
          <DialogHeader>
            <DialogTitle className="text-rose-600 flex items-center gap-2">
              <Trash2 className="h-4 w-4" />
              Confirm Student Record Deletion
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to permanently delete the student record for{" "}
              <strong>{studentToDelete?.first_name} {studentToDelete?.last_name}</strong> (Roll No:{" "}
              <code>{studentToDelete?.roll_number}</code>)?
            </DialogDescription>
          </DialogHeader>

          <div className="py-2 text-xs text-slate-500">
            This action executes <code>DELETE FROM students WHERE id = ?</code> in MySQL and cannot be undone.
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" size="sm" onClick={() => setIsDeleteModalOpen(false)}>
              Cancel
            </Button>
            <Button
              type="button"
              size="sm"
              disabled={formSubmitting}
              onClick={handleConfirmDelete}
              className="bg-rose-600 hover:bg-rose-700 text-white"
            >
              {formSubmitting ? "Deleting..." : "Delete from Database"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  );
}
