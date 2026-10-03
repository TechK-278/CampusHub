import React from "react";

/**
 * ConfirmSubmitModal — Bootstrap modal for reviewing admission data before submission
 */
export function ConfirmSubmitModal({ formData, show, onConfirm, onCancel, isSubmitting }) {
  if (!show) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="modal-backdrop fade show" />

      {/* Modal */}
      <div
        className="modal fade show d-block"
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirmModalLabel"
      >
        <div className="modal-dialog modal-dialog-centered modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="confirmModalLabel">
                Confirm Admission Details
              </h5>
              <button
                type="button"
                className="btn-close"
                aria-label="Close"
                onClick={onCancel}
                disabled={isSubmitting}
              />
            </div>

            <div className="modal-body">
              <p className="text-muted small mb-3">
                Please review the following details before submitting the admission form.
              </p>

              <table className="table table-bordered table-sm">
                <tbody>
                  <tr>
                    <th className="text-muted" style={{ width: "35%" }}>Roll Number</th>
                    <td className="fw-semibold">{formData.rollNo?.toUpperCase()}</td>
                  </tr>
                  <tr>
                    <th className="text-muted">Full Name</th>
                    <td>{formData.firstName} {formData.lastName}</td>
                  </tr>
                  <tr>
                    <th className="text-muted">Email</th>
                    <td>{formData.email}</td>
                  </tr>
                  <tr>
                    <th className="text-muted">Mobile</th>
                    <td>{formData.mobile}</td>
                  </tr>
                  <tr>
                    <th className="text-muted">Department</th>
                    <td>{formData.department}</td>
                  </tr>
                  <tr>
                    <th className="text-muted">Semester / Division</th>
                    <td>Semester {formData.semester}, Division {formData.division}</td>
                  </tr>
                  <tr>
                    <th className="text-muted">Guardian Name</th>
                    <td>{formData.guardianName}</td>
                  </tr>
                  <tr>
                    <th className="text-muted">Guardian Contact</th>
                    <td>{formData.guardianContact}</td>
                  </tr>
                  <tr>
                    <th className="text-muted">Address</th>
                    <td>{formData.address}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={onCancel}
                disabled={isSubmitting}
              >
                Go Back
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={onConfirm}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true" />
                    Submitting...
                  </>
                ) : (
                  "Confirm & Submit"
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
