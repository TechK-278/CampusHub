/**
 * CampusHub — Admission Service
 * Practical 5: Bootstrap Admission Module
 *
 * Wraps existing /api/students endpoints for the admission workflow.
 */

const BASE_URL = "/api/students";

export const admissionService = {
  /**
   * Submit a new student admission form to the backend
   * Maps admission form fields to the students API schema
   */
  async submitAdmission(formData) {
    const payload = {
      roll_number: formData.rollNo.trim().toUpperCase(),
      first_name: formData.firstName.trim(),
      last_name: formData.lastName.trim(),
      email: formData.email.trim().toLowerCase(),
      mobile: formData.mobile.trim(),
      department: formData.department,
      semester: parseInt(formData.semester, 10),
      division: formData.division,
    };

    const res = await fetch(BASE_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (!res.ok) {
      const error = new Error(data.error || "Failed to submit admission");
      error.status = res.status;
      error.serverError = data.error || "";
      throw error;
    }

    return data;
  },

  /**
   * Fetch recent enrollments, newest first
   */
  async getRecentEnrollments() {
    const res = await fetch(BASE_URL);
    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || "Failed to fetch enrollment records");
    }

    // Sort by id descending (newest first)
    const students = data.students || data || [];
    return Array.isArray(students)
      ? students.sort((a, b) => b.id - a.id)
      : [];
  },
};
