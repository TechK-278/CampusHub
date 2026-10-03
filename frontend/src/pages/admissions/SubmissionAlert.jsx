import React from "react";

/**
 * SubmissionAlert — Bootstrap alert for admission success/error feedback
 */
export function SubmissionAlert({ type, message, onDismiss }) {
  return (
    <div
      className={`alert alert-${type} alert-dismissible fade show`}
      role="alert"
    >
      {type === "success" && (
        <strong>Enrollment Confirmed — </strong>
      )}
      {type === "danger" && (
        <strong>Submission Failed — </strong>
      )}
      {message}
      <button
        type="button"
        className="btn-close"
        aria-label="Close"
        onClick={onDismiss}
      />
    </div>
  );
}
