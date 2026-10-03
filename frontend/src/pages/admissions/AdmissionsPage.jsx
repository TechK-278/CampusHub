import React, { useState, useEffect } from "react";
import localBootstrapCss from "bootstrap/dist/css/bootstrap.min.css?inline";
import { AdmissionForm } from "./AdmissionForm";
import { RecentEnrollments } from "./RecentEnrollments";
import { SubmissionAlert } from "./SubmissionAlert";
import { admissionService } from "@/services/admissionService";

/**
 * AdmissionsPage — Student Admission & Enrollment Module
 * Practical 5: Bootstrap 5 (Online CDN + Offline Local npm)
 *
 * Bootstrap CSS is loaded on mount and removed on unmount
 * to prevent style bleeding into the Tailwind-based portal.
 */

const CDN_BOOTSTRAP_URL =
  "https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css";

export function AdmissionsPage() {
  const [bootstrapMode, setBootstrapMode] = useState("local");
  const [alert, setAlert] = useState(null);
  const [enrollments, setEnrollments] = useState([]);
  const [enrollmentsLoading, setEnrollmentsLoading] = useState(true);

  // Load Bootstrap CSS on mount, clean up on unmount
  useEffect(() => {
    const styleId = "campushub-bootstrap-local";
    const linkId = "campushub-bootstrap-cdn";

    // Remove previous
    const prev1 = document.getElementById(styleId);
    if (prev1) prev1.remove();
    const prev2 = document.getElementById(linkId);
    if (prev2) prev2.remove();

    if (bootstrapMode === "local") {
      const style = document.createElement("style");
      style.id = styleId;
      style.textContent = localBootstrapCss;
      document.head.appendChild(style);
    } else {
      const link = document.createElement("link");
      link.id = linkId;
      link.rel = "stylesheet";
      link.href = CDN_BOOTSTRAP_URL;
      link.crossOrigin = "anonymous";
      document.head.appendChild(link);
    }

    return () => {
      const s = document.getElementById(styleId);
      if (s) s.remove();
      const l = document.getElementById(linkId);
      if (l) l.remove();
    };
  }, [bootstrapMode]);

  // Fetch recent enrollments on mount
  useEffect(() => {
    fetchEnrollments();
  }, []);

  const fetchEnrollments = async () => {
    setEnrollmentsLoading(true);
    try {
      const data = await admissionService.getRecentEnrollments();
      setEnrollments(data);
    } catch {
      setEnrollments([]);
    } finally {
      setEnrollmentsLoading(false);
    }
  };

  const handleSubmissionSuccess = (result) => {
    setAlert({
      type: "success",
      message: `Student enrolled successfully with Roll Number: ${result.student?.roll_number || result.rollNumber || "N/A"}`,
    });
    fetchEnrollments();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmissionError = (error) => {
    setAlert({
      type: "danger",
      message: error.message || "Submission failed. Please try again.",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const dismissAlert = () => setAlert(null);

  return (
    <div className="campushub-bootstrap-scope">
      {/* Page Header */}
      <div className="d-flex justify-content-between align-items-start flex-wrap mb-4">
        <div>
          <h4 className="fw-bold text-dark mb-1">Student Admissions</h4>
          <p className="text-muted small mb-0">
            New student enrollment and registration
          </p>
        </div>

        {/* Bootstrap Source Toggle */}
        <div className="d-flex align-items-center gap-2 mt-2 mt-md-0">
          <span className="text-muted small">Bootstrap Source:</span>
          <div className="btn-group btn-group-sm" role="group">
            <button
              type="button"
              className={`btn ${bootstrapMode === "local" ? "btn-primary" : "btn-outline-secondary"}`}
              onClick={() => setBootstrapMode("local")}
            >
              Local (npm)
            </button>
            <button
              type="button"
              className={`btn ${bootstrapMode === "cdn" ? "btn-primary" : "btn-outline-secondary"}`}
              onClick={() => setBootstrapMode("cdn")}
            >
              CDN
            </button>
          </div>
        </div>
      </div>

      {/* Alerts */}
      {alert && (
        <SubmissionAlert
          type={alert.type}
          message={alert.message}
          onDismiss={dismissAlert}
        />
      )}

      {/* Admission Form */}
      <AdmissionForm
        onSuccess={handleSubmissionSuccess}
        onError={handleSubmissionError}
      />

      {/* Divider */}
      <hr className="my-5" />

      {/* Recent Enrollments Table */}
      <RecentEnrollments
        enrollments={enrollments}
        loading={enrollmentsLoading}
      />
    </div>
  );
}
