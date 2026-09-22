/**
 * CampusHub — Student & MySQL REST API Client
 * Practical 8: Node.js + MySQL Integration
 */

const BASE_URL = "/api/students";
const DB_HEALTH_URL = "/api/database/health";

export const studentService = {
  /**
   * Check MySQL database connection status
   */
  async getDatabaseHealth() {
    try {
      const res = await fetch(DB_HEALTH_URL);
      const data = await res.json();
      return { ok: res.ok, data };
    } catch (err) {
      return { ok: false, data: { status: "disconnected", error: err.message } };
    }
  },

  /**
   * Fetch all students with optional department & search query
   */
  async getStudents(params = {}) {
    const query = new URLSearchParams();
    if (params.department && params.department !== "all") {
      query.append("department", params.department);
    }
    if (params.search && params.search.trim()) {
      query.append("search", params.search.trim());
    }

    const url = query.toString() ? `${BASE_URL}?${query.toString()}` : BASE_URL;
    const res = await fetch(url);
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Failed to fetch student records from MySQL");
    return data;
  },

  /**
   * Fetch distinct academic departments (SELECT DISTINCT)
   */
  async getDistinctDepartments() {
    const res = await fetch(`${BASE_URL}/departments`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Failed to fetch distinct departments");
    return data.departments || [];
  },

  /**
   * Insert new student record
   */
  async createStudent(studentData) {
    const res = await fetch(BASE_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(studentData)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Failed to insert student record in MySQL");
    return data;
  },

  /**
   * Update student record
   */
  async updateStudent(id, studentData) {
    const res = await fetch(`${BASE_URL}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(studentData)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Failed to update student record in MySQL");
    return data;
  },

  /**
   * Delete student record
   */
  async deleteStudent(id) {
    const res = await fetch(`${BASE_URL}/${id}`, {
      method: "DELETE"
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Failed to delete student record from MySQL");
    return data;
  },

  /**
   * Execute MySQL User-Defined Function calculate_grade(score)
   */
  async calculateGradeWithUDF(score) {
    const res = await fetch(`${BASE_URL}/calculate-grade?score=${score}`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Failed to execute MySQL User-Defined Function");
    return data;
  },

  /**
   * Execute safe DROP TABLE demonstration
   */
  async executeDropTableDemo() {
    const res = await fetch(`${BASE_URL}/demo-drop-table`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ confirmDrop: true })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Failed to execute DROP TABLE demo");
    return data;
  }
};
