import React, { useState, useEffect, useRef, useCallback } from "react";
import { ConfirmSubmitModal } from "./ConfirmSubmitModal";
import { admissionService } from "@/services/admissionService";
import { getStorageItem, setStorageItem, removeStorageItem, STORAGE_KEYS } from "@/lib/storage";

/**
 * AdmissionForm — Multi-section Bootstrap admission form
 * Practical 5: Bootstrap grid, form controls, validation states,
 * input groups, selects, radios, checkboxes, and modal confirm.
 *
 * Draft auto-saves to localStorage (Practical 4 integration).
 */

const DEPARTMENTS = [
  "Computer Science & Engineering",
  "Information Technology",
  "Electronics & Communication",
  "Mechanical Engineering",
  "Civil Engineering",
  "Electrical Engineering",
  "Chemical Engineering",
];

const INITIAL_FORM = {
  rollNo: "",
  firstName: "",
  lastName: "",
  email: "",
  mobile: "",
  gender: "male",
  dob: "",
  department: "Computer Science & Engineering",
  semester: "1",
  division: "A",
  address: "",
  guardianName: "",
  guardianContact: "",
  bloodGroup: "",
  agreeTerms: false,
};

export function AdmissionForm({ onSuccess, onError }) {
  const [formData, setFormData] = useState(() => {
    const draft = getStorageItem(STORAGE_KEYS.ADMISSION_DRAFT, null);
    return draft ? { ...INITIAL_FORM, ...draft } : { ...INITIAL_FORM };
  });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});

  const draftTimerRef = useRef(null);

  // Auto-save draft to localStorage (debounced 500ms)
  useEffect(() => {
    if (draftTimerRef.current) clearTimeout(draftTimerRef.current);
    draftTimerRef.current = setTimeout(() => {
      const { agreeTerms, ...draftData } = formData;
      setStorageItem(STORAGE_KEYS.ADMISSION_DRAFT, draftData);
    }, 500);
    return () => {
      if (draftTimerRef.current) clearTimeout(draftTimerRef.current);
    };
  }, [formData]);

  // ── Validation ──

  const validateField = useCallback((name, value) => {
    switch (name) {
      case "rollNo":
        if (!value.trim()) return "Roll number is required.";
        if (!/^[A-Z]{2}\d{7}$/i.test(value.trim()))
          return "Format: 2 letters + 7 digits (e.g. CS2026001).";
        return "";
      case "firstName":
        if (!value.trim()) return "First name is required.";
        if (value.trim().length < 2) return "Minimum 2 characters.";
        return "";
      case "lastName":
        if (!value.trim()) return "Last name is required.";
        if (value.trim().length < 2) return "Minimum 2 characters.";
        return "";
      case "email":
        if (!value.trim()) return "Email is required.";
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim()))
          return "Enter a valid email address.";
        return "";
      case "mobile":
        if (!value.trim()) return "Mobile number is required.";
        if (!/^[6-9]\d{9}$/.test(value.trim()))
          return "Enter a valid 10-digit mobile number.";
        return "";
      case "dob":
        if (!value) return "Date of birth is required.";
        return "";
      case "address":
        if (!value.trim()) return "Address is required.";
        if (value.trim().length < 8) return "Minimum 8 characters.";
        return "";
      case "guardianName":
        if (!value.trim()) return "Guardian name is required.";
        return "";
      case "guardianContact":
        if (!value.trim()) return "Guardian contact is required.";
        if (!/^[6-9]\d{9}$/.test(value.trim()))
          return "Enter a valid 10-digit number.";
        return "";
      case "agreeTerms":
        if (!value) return "You must accept the declaration.";
        return "";
      default:
        return "";
    }
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const fieldValue = type === "checkbox" ? checked : value;

    setFormData((prev) => ({ ...prev, [name]: fieldValue }));

    // Clear server-side field errors on edit
    if (fieldErrors[name]) {
      setFieldErrors((prev) => {
        const copy = { ...prev };
        delete copy[name];
        return copy;
      });
    }

    if (touched[name]) {
      const error = validateField(name, fieldValue);
      setErrors((prev) => ({ ...prev, [name]: error }));
    }
  };

  const handleBlur = (e) => {
    const { name, value, type, checked } = e.target;
    const fieldValue = type === "checkbox" ? checked : value;
    setTouched((prev) => ({ ...prev, [name]: true }));
    const error = validateField(name, fieldValue);
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const validateAll = () => {
    const newErrors = {};
    const allTouched = {};
    for (const key of Object.keys(INITIAL_FORM)) {
      const error = validateField(key, formData[key]);
      if (error) newErrors[key] = error;
      allTouched[key] = true;
    }
    setErrors(newErrors);
    setTouched(allTouched);
    return Object.keys(newErrors).length === 0;
  };

  // ── Submit flow ──

  const handlePreSubmit = (e) => {
    e.preventDefault();
    if (!validateAll()) return;
    setShowModal(true);
  };

  const handleConfirmSubmit = async () => {
    setIsSubmitting(true);
    setFieldErrors({});

    try {
      const result = await admissionService.submitAdmission(formData);
      removeStorageItem(STORAGE_KEYS.ADMISSION_DRAFT);
      setFormData({ ...INITIAL_FORM });
      setErrors({});
      setTouched({});
      setShowModal(false);
      onSuccess(result);
    } catch (error) {
      setShowModal(false);

      // Parse duplicate errors from backend
      const msg = (error.serverError || error.message || "").toLowerCase();
      if (msg.includes("roll_number") || msg.includes("roll number")) {
        setFieldErrors({ rollNo: "This roll number is already registered." });
        setErrors((prev) => ({ ...prev, rollNo: "This roll number is already registered." }));
      } else if (msg.includes("email")) {
        setFieldErrors({ email: "This email is already registered." });
        setErrors((prev) => ({ ...prev, email: "This email is already registered." }));
      } else {
        onError(error);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setFormData({ ...INITIAL_FORM });
    setErrors({});
    setTouched({});
    setFieldErrors({});
    removeStorageItem(STORAGE_KEYS.ADMISSION_DRAFT);
  };

  // ── Helpers ──

  const fieldClass = (name) => {
    if (!touched[name]) return "form-control";
    if (errors[name] || fieldErrors[name]) return "form-control is-invalid";
    return "form-control is-valid";
  };

  const selectClass = (name) => {
    if (!touched[name]) return "form-select";
    if (errors[name]) return "form-select is-invalid";
    return "form-select is-valid";
  };

  const checkClass = (name) => {
    if (!touched[name]) return "form-check-input";
    if (errors[name]) return "form-check-input is-invalid";
    return "form-check-input is-valid";
  };

  return (
    <>
      <form onSubmit={handlePreSubmit} noValidate>
        <div className="card border">
          <div className="card-body">
            {/* ── Section 1: Personal Details ── */}
            <h6 className="fw-semibold text-dark mb-3 border-bottom pb-2">
              Personal Details
            </h6>
            <div className="row g-3 mb-4">
              <div className="col-md-4">
                <label htmlFor="adm-rollNo" className="form-label small fw-medium">
                  Roll Number <span className="text-danger">*</span>
                </label>
                <div className="input-group">
                  <span className="input-group-text small">ID</span>
                  <input
                    type="text"
                    className={fieldClass("rollNo")}
                    id="adm-rollNo"
                    name="rollNo"
                    placeholder="CS2026001"
                    value={formData.rollNo}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    maxLength={9}
                  />
                  {(errors.rollNo || fieldErrors.rollNo) && (
                    <div className="invalid-feedback">
                      {errors.rollNo || fieldErrors.rollNo}
                    </div>
                  )}
                </div>
              </div>

              <div className="col-md-4">
                <label htmlFor="adm-firstName" className="form-label small fw-medium">
                  First Name <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  className={fieldClass("firstName")}
                  id="adm-firstName"
                  name="firstName"
                  placeholder="Aarav"
                  value={formData.firstName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                {errors.firstName && (
                  <div className="invalid-feedback">{errors.firstName}</div>
                )}
              </div>

              <div className="col-md-4">
                <label htmlFor="adm-lastName" className="form-label small fw-medium">
                  Last Name <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  className={fieldClass("lastName")}
                  id="adm-lastName"
                  name="lastName"
                  placeholder="Mehta"
                  value={formData.lastName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                {errors.lastName && (
                  <div className="invalid-feedback">{errors.lastName}</div>
                )}
              </div>

              <div className="col-md-4">
                <label htmlFor="adm-dob" className="form-label small fw-medium">
                  Date of Birth <span className="text-danger">*</span>
                </label>
                <input
                  type="date"
                  className={fieldClass("dob")}
                  id="adm-dob"
                  name="dob"
                  value={formData.dob}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                {errors.dob && (
                  <div className="invalid-feedback">{errors.dob}</div>
                )}
              </div>

              <div className="col-md-4">
                <label className="form-label small fw-medium">
                  Gender <span className="text-danger">*</span>
                </label>
                <div className="d-flex gap-3 pt-1">
                  {["male", "female", "other"].map((g) => (
                    <div className="form-check" key={g}>
                      <input
                        className="form-check-input"
                        type="radio"
                        name="gender"
                        id={`adm-gender-${g}`}
                        value={g}
                        checked={formData.gender === g}
                        onChange={handleChange}
                      />
                      <label className="form-check-label small" htmlFor={`adm-gender-${g}`}>
                        {g.charAt(0).toUpperCase() + g.slice(1)}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="col-md-4">
                <label htmlFor="adm-bloodGroup" className="form-label small fw-medium">
                  Blood Group
                </label>
                <select
                  className="form-select form-select-sm"
                  id="adm-bloodGroup"
                  name="bloodGroup"
                  value={formData.bloodGroup}
                  onChange={handleChange}
                >
                  <option value="">Select (optional)</option>
                  {["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"].map((bg) => (
                    <option key={bg} value={bg}>{bg}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* ── Section 2: Contact Details ── */}
            <h6 className="fw-semibold text-dark mb-3 border-bottom pb-2">
              Contact Details
            </h6>
            <div className="row g-3 mb-4">
              <div className="col-md-6">
                <label htmlFor="adm-email" className="form-label small fw-medium">
                  Email Address <span className="text-danger">*</span>
                </label>
                <div className="input-group">
                  <span className="input-group-text small">@</span>
                  <input
                    type="email"
                    className={fieldClass("email")}
                    id="adm-email"
                    name="email"
                    placeholder="aarav.mehta@university.edu"
                    value={formData.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                  {(errors.email || fieldErrors.email) && (
                    <div className="invalid-feedback">
                      {errors.email || fieldErrors.email}
                    </div>
                  )}
                </div>
              </div>

              <div className="col-md-6">
                <label htmlFor="adm-mobile" className="form-label small fw-medium">
                  Mobile Number <span className="text-danger">*</span>
                </label>
                <div className="input-group">
                  <span className="input-group-text small">+91</span>
                  <input
                    type="tel"
                    className={fieldClass("mobile")}
                    id="adm-mobile"
                    name="mobile"
                    placeholder="9876543210"
                    value={formData.mobile}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    maxLength={10}
                  />
                  {errors.mobile && (
                    <div className="invalid-feedback">{errors.mobile}</div>
                  )}
                </div>
              </div>

              <div className="col-12">
                <label htmlFor="adm-address" className="form-label small fw-medium">
                  Residential Address <span className="text-danger">*</span>
                </label>
                <textarea
                  className={fieldClass("address")}
                  id="adm-address"
                  name="address"
                  rows={2}
                  placeholder="Full residential address"
                  value={formData.address}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                {errors.address && (
                  <div className="invalid-feedback">{errors.address}</div>
                )}
              </div>
            </div>

            {/* ── Section 3: Academic Details ── */}
            <h6 className="fw-semibold text-dark mb-3 border-bottom pb-2">
              Academic Details
            </h6>
            <div className="row g-3 mb-4">
              <div className="col-md-4">
                <label htmlFor="adm-department" className="form-label small fw-medium">
                  Department <span className="text-danger">*</span>
                </label>
                <select
                  className={selectClass("department")}
                  id="adm-department"
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  onBlur={handleBlur}
                >
                  {DEPARTMENTS.map((dept) => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
              </div>

              <div className="col-md-4">
                <label htmlFor="adm-semester" className="form-label small fw-medium">
                  Semester <span className="text-danger">*</span>
                </label>
                <select
                  className={selectClass("semester")}
                  id="adm-semester"
                  name="semester"
                  value={formData.semester}
                  onChange={handleChange}
                  onBlur={handleBlur}
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
                    <option key={s} value={String(s)}>Semester {s}</option>
                  ))}
                </select>
              </div>

              <div className="col-md-4">
                <label htmlFor="adm-division" className="form-label small fw-medium">
                  Division <span className="text-danger">*</span>
                </label>
                <select
                  className={selectClass("division")}
                  id="adm-division"
                  name="division"
                  value={formData.division}
                  onChange={handleChange}
                  onBlur={handleBlur}
                >
                  {["A", "B", "C"].map((d) => (
                    <option key={d} value={d}>Division {d}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* ── Section 4: Guardian Details ── */}
            <h6 className="fw-semibold text-dark mb-3 border-bottom pb-2">
              Guardian Details
            </h6>
            <div className="row g-3 mb-4">
              <div className="col-md-6">
                <label htmlFor="adm-guardianName" className="form-label small fw-medium">
                  Guardian / Parent Name <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  className={fieldClass("guardianName")}
                  id="adm-guardianName"
                  name="guardianName"
                  placeholder="Full name of guardian"
                  value={formData.guardianName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                {errors.guardianName && (
                  <div className="invalid-feedback">{errors.guardianName}</div>
                )}
              </div>

              <div className="col-md-6">
                <label htmlFor="adm-guardianContact" className="form-label small fw-medium">
                  Guardian Contact Number <span className="text-danger">*</span>
                </label>
                <div className="input-group">
                  <span className="input-group-text small">+91</span>
                  <input
                    type="tel"
                    className={fieldClass("guardianContact")}
                    id="adm-guardianContact"
                    name="guardianContact"
                    placeholder="9876543210"
                    value={formData.guardianContact}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    maxLength={10}
                  />
                  {errors.guardianContact && (
                    <div className="invalid-feedback">{errors.guardianContact}</div>
                  )}
                </div>
              </div>
            </div>

            {/* ── Section 5: Declaration ── */}
            <h6 className="fw-semibold text-dark mb-3 border-bottom pb-2">
              Declaration
            </h6>
            <div className="mb-4">
              <div className="form-check">
                <input
                  type="checkbox"
                  className={checkClass("agreeTerms")}
                  id="adm-agreeTerms"
                  name="agreeTerms"
                  checked={formData.agreeTerms}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                <label className="form-check-label small" htmlFor="adm-agreeTerms">
                  I hereby declare that all the information provided above is true and correct
                  to the best of my knowledge. I understand that any misrepresentation may result
                  in cancellation of my admission.
                </label>
                {errors.agreeTerms && (
                  <div className="invalid-feedback d-block">{errors.agreeTerms}</div>
                )}
              </div>
            </div>

            {/* ── Action Buttons ── */}
            <div className="d-flex gap-2 justify-content-end border-top pt-3">
              <button
                type="button"
                className="btn btn-outline-secondary btn-sm"
                onClick={handleReset}
                disabled={isSubmitting}
              >
                Reset Form
              </button>
              <button
                type="submit"
                className="btn btn-primary btn-sm"
                disabled={isSubmitting}
              >
                Review & Submit
              </button>
            </div>
          </div>
        </div>
      </form>

      {/* Confirm Modal */}
      <ConfirmSubmitModal
        formData={formData}
        show={showModal}
        onConfirm={handleConfirmSubmit}
        onCancel={() => setShowModal(false)}
        isSubmitting={isSubmitting}
      />
    </>
  );
}
