import React from "react";

/**
 * RecentEnrollments — Bootstrap table showing recently enrolled students
 * Data sourced from GET /api/students (newest first)
 */
export function RecentEnrollments({ enrollments, loading }) {
  return (
    <div>
      <h5 className="fw-bold text-dark mb-3">Recent Enrollments</h5>

      {loading ? (
        <div className="text-center py-4">
          <div className="spinner-border text-primary spinner-border-sm" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="text-muted small mt-2 mb-0">Loading enrollment records...</p>
        </div>
      ) : enrollments.length === 0 ? (
        <div className="text-center py-4">
          <p className="text-muted mb-0">No enrollment records found. Submit a new admission above.</p>
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table table-hover table-bordered align-middle">
            <thead className="table-light">
              <tr>
                <th className="small">#</th>
                <th className="small">Roll Number</th>
                <th className="small">Name</th>
                <th className="small">Email</th>
                <th className="small">Department</th>
                <th className="small">Sem</th>
                <th className="small">Div</th>
                <th className="small">Enrolled On</th>
              </tr>
            </thead>
            <tbody>
              {enrollments.slice(0, 10).map((student, idx) => (
                <tr key={student.id || idx}>
                  <td className="text-muted small">{idx + 1}</td>
                  <td>
                    <span className="badge bg-primary bg-opacity-10 text-primary">
                      {student.roll_number}
                    </span>
                  </td>
                  <td className="small">{student.first_name} {student.last_name}</td>
                  <td className="small text-muted">{student.email}</td>
                  <td className="small">{student.department}</td>
                  <td className="text-center small">{student.semester}</td>
                  <td className="text-center small">{student.division}</td>
                  <td className="small text-muted">
                    {student.created_at
                      ? new Date(student.created_at).toLocaleDateString("en-IN", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })
                      : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {enrollments.length > 10 && (
            <p className="text-muted small text-end">
              Showing 10 of {enrollments.length} records
            </p>
          )}
        </div>
      )}
    </div>
  );
}
