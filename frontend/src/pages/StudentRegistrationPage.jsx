import React, { useState, useEffect } from "react";
import localBootstrapCss from "bootstrap/dist/css/bootstrap.min.css?inline";

const CDN_BOOTSTRAP_URL = "https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css";

const INITIAL_FORM_DATA = {
  rollNo: "",
  firstName: "",
  lastName: "",
  mobile: "",
  email: "",
  department: "Computer Science & Engineering",
  semester: "5",
  division: "A",
  address: "",
  gender: "male",
  agreeTerms: false
};

const INITIAL_ERRORS = {};

export function StudentRegistrationPage() {
  // Mode: "local" (Offline via npm package) or "cdn" (Online via jsDelivr CDN)
  const [bootstrapMode, setBootstrapMode] = useState("local");
  const [formData, setFormData] = useState(INITIAL_FORM_DATA);
  const [errors, setErrors] = useState(INITIAL_ERRORS);
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedStudent, setSubmittedStudent] = useState(null);
  const [submissionTime, setSubmissionTime] = useState(null);
  const [activeTab, setActiveTab] = useState("form"); // "form", "cdn-demo", "offline-demo"

  // Dynamically load Bootstrap CSS on mount and switch between CDN and Local npm assets
  useEffect(() => {
    const styleId = "campushub-bootstrap-local";
    const linkId = "campushub-bootstrap-cdn";

    // Clean previous tags
    const existingStyle = document.getElementById(styleId);
    if (existingStyle) existingStyle.remove();
    const existingLink = document.getElementById(linkId);
    if (existingLink) existingLink.remove();

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

    // Cleanup when component unmounts to prevent style bleeding into Tailwind/shadcn portal
    return () => {
      const s = document.getElementById(styleId);
      if (s) s.remove();
      const l = document.getElementById(linkId);
      if (l) l.remove();
    };
  }, [bootstrapMode]);

  // Form Validation
  const validateField = (name, value) => {
    let error = "";
    switch (name) {
      case "rollNo":
        if (!value.trim()) {
          error = "Roll Number is required.";
        } else if (!/^[a-zA-Z0-9_-]{4,15}$/.test(value.trim())) {
          error = "Roll Number must be 4-15 alphanumeric characters (e.g. CS2026001).";
        }
        break;
      case "firstName":
        if (!value.trim()) {
          error = "First Name is required.";
        } else if (value.trim().length < 2) {
          error = "First Name must be at least 2 characters.";
        }
        break;
      case "mobile":
        if (!value.trim()) {
          error = "Mobile Number is required.";
        } else if (!/^[6-9]\d{9}$/.test(value.trim())) {
          error = "Please enter a valid 10-digit mobile number (e.g., 9876543210).";
        }
        break;
      case "email":
        if (!value.trim()) {
          error = "Email ID is required.";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())) {
          error = "Please enter a valid email address (e.g., student@university.edu).";
        }
        break;
      case "address":
        if (!value.trim()) {
          error = "Residential address is required.";
        } else if (value.trim().length < 8) {
          error = "Address must be at least 8 characters.";
        }
        break;
      case "agreeTerms":
        if (!value) {
          error = "You must confirm the academic declaration.";
        }
        break;
      default:
        break;
    }
    return error;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const fieldValue = type === "checkbox" ? checked : value;

    setFormData((prev) => ({
      ...prev,
      [name]: fieldValue
    }));

    if (touched[name]) {
      const error = validateField(name, fieldValue);
      setErrors((prev) => ({
        ...prev,
        [name]: error
      }));
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
    Object.keys(INITIAL_FORM_DATA).forEach((key) => {
      const error = validateField(key, formData[key]);
      if (error) {
        newErrors[key] = error;
      }
    });
    setErrors(newErrors);
    setTouched({
      rollNo: true,
      firstName: true,
      lastName: true,
      mobile: true,
      email: true,
      department: true,
      semester: true,
      division: true,
      address: true,
      agreeTerms: true
    });
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateAll()) {
      return;
    }

    setIsSubmitting(true);

    // Simulate submission state (Phase 5 frontend practical verification)
    setTimeout(() => {
      setSubmittedStudent({ ...formData });
      setSubmissionTime(new Date().toLocaleTimeString());
      setIsSubmitting(false);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 600);
  };

  const handleReset = () => {
    setFormData(INITIAL_FORM_DATA);
    setErrors(INITIAL_ERRORS);
    setTouched({});
    setSubmittedStudent(null);
  };

  const handleFillDemoData = () => {
    setFormData({
      rollNo: "CS2026001",
      firstName: "Aarav",
      lastName: "Mehta",
      mobile: "9876543210",
      email: "aarav.mehta@university.edu",
      department: "Computer Science & Engineering",
      semester: "5",
      division: "A",
      address: "Hostel Block B, Room 304, University Campus, SG Highway",
      gender: "male",
      agreeTerms: true
    });
    setErrors({});
  };

  return (
    <div className="bootstrap-scope py-4 px-2 px-md-4">
      <div className="container-fluid max-w-6xl mx-auto">
        
        {/* Module Header & Mode Selector */}
        <div className="card shadow-sm border-0 mb-4 bg-white">
          <div className="card-body p-4">
            <div className="row align-items-center g-3">
              <div className="col-12 col-lg-7">
                <div className="d-flex align-items-center gap-2 mb-1">
                  <span className="badge bg-primary text-uppercase px-2.5 py-1.5" style={{ fontSize: "11px" }}>
                    Practical 5
                  </span>
                  <span className="badge bg-secondary text-uppercase px-2.5 py-1.5" style={{ fontSize: "11px" }}>
                    Bootstrap 5.3
                  </span>
                </div>
                <h2 className="h4 font-weight-bold text-dark mb-1">Student Registration & Bootstrap 5 Demonstration</h2>
                <p className="text-muted small mb-0">
                  Comprehensive academic registration form demonstrating Bootstrap 5 grid layout, form controls, responsive columns, validation states, and both Online CDN and Offline/Local npm asset modes.
                </p>
              </div>

              {/* Source Switcher (CDN vs Local) */}
              <div className="col-12 col-lg-5">
                <div className="card bg-light border border-secondary-subtle">
                  <div className="card-body p-3">
                    <label className="form-label small fw-bold text-secondary mb-2 d-flex justify-content-between align-items-center">
                      <span>Bootstrap 5 Source:</span>
                      <span className={`badge ${bootstrapMode === 'local' ? 'bg-success' : 'bg-info text-dark'}`}>
                        {bootstrapMode === 'local' ? 'Offline (Local NPM)' : 'Online (jsDelivr CDN)'}
                      </span>
                    </label>

                    <div className="btn-group w-100" role="group" aria-label="Bootstrap CSS Source">
                      <button
                        type="button"
                        onClick={() => setBootstrapMode("local")}
                        className={`btn btn-sm ${bootstrapMode === 'local' ? 'btn-primary' : 'btn-outline-secondary'}`}
                      >
                        Local / Offline (npm)
                      </button>
                      <button
                        type="button"
                        onClick={() => setBootstrapMode("cdn")}
                        className={`btn btn-sm ${bootstrapMode === 'cdn' ? 'btn-primary' : 'btn-outline-secondary'}`}
                      >
                        Online CDN (jsDelivr)
                      </button>
                    </div>

                    <div className="mt-2 text-muted" style={{ fontSize: "11px" }}>
                      {bootstrapMode === "local" ? (
                        <span><strong className="text-dark">Source:</strong> <code>node_modules/bootstrap/dist/css/bootstrap.min.css</code> (v5.3.8)</span>
                      ) : (
                        <span><strong className="text-dark">Source:</strong> <code>https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/...</code></span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation Pills for Practical 5 Demonstrations */}
            <div className="row mt-3 pt-3 border-top g-2">
              <div className="col-12">
                <ul className="nav nav-pills gap-2">
                  <li className="nav-item">
                    <button
                      type="button"
                      onClick={() => setActiveTab("form")}
                      className={`nav-link btn-sm ${activeTab === 'form' ? 'active' : ''}`}
                    >
                      Student Registration Form
                    </button>
                  </li>
                  <li className="nav-item">
                    <button
                      type="button"
                      onClick={() => setActiveTab("cdn-demo")}
                      className={`nav-link btn-sm ${activeTab === 'cdn-demo' ? 'active' : ''}`}
                    >
                      CDN Demonstration
                    </button>
                  </li>
                  <li className="nav-item">
                    <button
                      type="button"
                      onClick={() => setActiveTab("offline-demo")}
                      className={`nav-link btn-sm ${activeTab === 'offline-demo' ? 'active' : ''}`}
                    >
                      Offline / Local Demonstration
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Tab 1: Student Registration Form */}
        {activeTab === "form" && (
          <div className="row g-4">
            
            {/* Left/Main Column: Registration Form */}
            <div className="col-12 col-lg-8">
              
              {/* Submission Success Alert & Summary */}
              {submittedStudent && (
                <div className="alert alert-success border-success-subtle shadow-sm mb-4" role="alert">
                  <div className="d-flex justify-content-between align-items-start">
                    <div>
                      <h5 className="alert-heading fw-bold mb-1">
                        Registration Details Submitted Successfully
                      </h5>
                      <p className="mb-2 small">
                        The student registration details have been verified and processed by the frontend validation engine at {submissionTime}.
                      </p>
                    </div>
                    <button
                      type="button"
                      className="btn-close"
                      aria-label="Close"
                      onClick={() => setSubmittedStudent(null)}
                    ></button>
                  </div>

                  <hr className="my-2" />

                  {/* Summary Card */}
                  <div className="card bg-white border border-success-subtle mt-3">
                    <div className="card-header bg-success text-white py-2 px-3 d-flex justify-content-between align-items-center">
                      <span className="fw-semibold small">Registration Summary (Fictional Demo Data)</span>
                      <span className="badge bg-light text-success">{submittedStudent.rollNo}</span>
                    </div>
                    <div className="card-body p-3">
                      <div className="row g-2 small">
                        <div className="col-sm-6">
                          <strong className="text-secondary">Student Name:</strong> {submittedStudent.firstName} {submittedStudent.lastName}
                        </div>
                        <div className="col-sm-6">
                          <strong className="text-secondary">Roll Number:</strong> {submittedStudent.rollNo}
                        </div>
                        <div className="col-sm-6">
                          <strong className="text-secondary">Mobile Number:</strong> {submittedStudent.mobile}
                        </div>
                        <div className="col-sm-6">
                          <strong className="text-secondary">Email ID:</strong> {submittedStudent.email}
                        </div>
                        <div className="col-sm-6">
                          <strong className="text-secondary">Department:</strong> {submittedStudent.department}
                        </div>
                        <div className="col-sm-6">
                          <strong className="text-secondary">Semester & Div:</strong> Semester {submittedStudent.semester} (Div {submittedStudent.division})
                        </div>
                        <div className="col-12">
                          <strong className="text-secondary">Residential Address:</strong> {submittedStudent.address}
                        </div>
                      </div>
                    </div>
                    <div className="card-footer bg-light py-2 px-3 text-muted" style={{ fontSize: "11px" }}>
                      * Note: Database persistence will be established in Phase 8 (MySQL integration).
                    </div>
                  </div>
                </div>
              )}

              {/* Main Bootstrap Form Card */}
              <div className="card shadow-sm border-0">
                <div className="card-header bg-white border-bottom py-3 px-4 d-flex justify-content-between align-items-center flex-wrap gap-2">
                  <div>
                    <h5 className="card-title fw-bold mb-0 text-dark">Student Academic Registration</h5>
                    <span className="text-muted small">Please enter accurate academic and contact information</span>
                  </div>
                  <button
                    type="button"
                    onClick={handleFillDemoData}
                    className="btn btn-sm btn-outline-primary"
                    title="Fill realistic fictional academic data"
                  >
                    Auto-fill Demo Data
                  </button>
                </div>

                <div className="card-body p-4">
                  <form onSubmit={handleSubmit} noValidate>
                    
                    {/* Section 1: Identification */}
                    <div className="mb-4">
                      <h6 className="text-secondary fw-semibold border-bottom pb-2 mb-3">
                        1. Identification & Personal Details
                      </h6>

                      <div className="row g-3">
                        {/* Roll Number */}
                        <div className="col-12 col-md-6">
                          <label htmlFor="rollNo" className="form-label fw-semibold small text-dark">
                            Roll Number <span className="text-danger">*</span>
                          </label>
                          <input
                            type="text"
                            id="rollNo"
                            name="rollNo"
                            value={formData.rollNo}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            placeholder="e.g., CS2026001"
                            className={`form-control form-control-sm ${
                              touched.rollNo ? (errors.rollNo ? 'is-invalid' : 'is-valid') : ''
                            }`}
                            required
                          />
                          {touched.rollNo && errors.rollNo ? (
                            <div className="invalid-feedback small">{errors.rollNo}</div>
                          ) : (
                            <div className="form-text small" style={{ fontSize: "11px" }}>Unique institutional roll / enrollment ID</div>
                          )}
                        </div>

                        {/* Gender */}
                        <div className="col-12 col-md-6">
                          <label className="form-label fw-semibold small text-dark">Gender</label>
                          <div className="d-flex gap-4 pt-1">
                            <div className="form-check">
                              <input
                                className="form-check-input"
                                type="radio"
                                name="gender"
                                id="genderMale"
                                value="male"
                                checked={formData.gender === "male"}
                                onChange={handleChange}
                              />
                              <label className="form-check-label small" htmlFor="genderMale">Male</label>
                            </div>
                            <div className="form-check">
                              <input
                                className="form-check-input"
                                type="radio"
                                name="gender"
                                id="genderFemale"
                                value="female"
                                checked={formData.gender === "female"}
                                onChange={handleChange}
                              />
                              <label className="form-check-label small" htmlFor="genderFemale">Female</label>
                            </div>
                            <div className="form-check">
                              <input
                                className="form-check-input"
                                type="radio"
                                name="gender"
                                id="genderOther"
                                value="other"
                                checked={formData.gender === "other"}
                                onChange={handleChange}
                              />
                              <label className="form-check-label small" htmlFor="genderOther">Other</label>
                            </div>
                          </div>
                        </div>

                        {/* First Name */}
                        <div className="col-12 col-md-6">
                          <label htmlFor="firstName" className="form-label fw-semibold small text-dark">
                            First Name <span className="text-danger">*</span>
                          </label>
                          <input
                            type="text"
                            id="firstName"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            placeholder="e.g., Aarav"
                            className={`form-control form-control-sm ${
                              touched.firstName ? (errors.firstName ? 'is-invalid' : 'is-valid') : ''
                            }`}
                            required
                          />
                          {touched.firstName && errors.firstName && (
                            <div className="invalid-feedback small">{errors.firstName}</div>
                          )}
                        </div>

                        {/* Last Name */}
                        <div className="col-12 col-md-6">
                          <label htmlFor="lastName" className="form-label fw-semibold small text-dark">
                            Last Name
                          </label>
                          <input
                            type="text"
                            id="lastName"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            placeholder="e.g., Mehta"
                            className="form-control form-control-sm"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Section 2: Contact Information */}
                    <div className="mb-4">
                      <h6 className="text-secondary fw-semibold border-bottom pb-2 mb-3">
                        2. Contact Information
                      </h6>

                      <div className="row g-3">
                        {/* Mobile Number */}
                        <div className="col-12 col-md-6">
                          <label htmlFor="mobile" className="form-label fw-semibold small text-dark">
                            Mobile Number <span className="text-danger">*</span>
                          </label>
                          <div className="input-group input-group-sm">
                            <span className="input-group-text bg-light text-muted">+91</span>
                            <input
                              type="tel"
                              id="mobile"
                              name="mobile"
                              value={formData.mobile}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              placeholder="10-digit mobile number"
                              maxLength={10}
                              className={`form-control ${
                                touched.mobile ? (errors.mobile ? 'is-invalid' : 'is-valid') : ''
                              }`}
                              required
                            />
                            {touched.mobile && errors.mobile && (
                              <div className="invalid-feedback small">{errors.mobile}</div>
                            )}
                          </div>
                        </div>

                        {/* Email ID */}
                        <div className="col-12 col-md-6">
                          <label htmlFor="email" className="form-label fw-semibold small text-dark">
                            Email ID <span className="text-danger">*</span>
                          </label>
                          <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            placeholder="student@university.edu"
                            className={`form-control form-control-sm ${
                              touched.email ? (errors.email ? 'is-invalid' : 'is-valid') : ''
                            }`}
                            required
                          />
                          {touched.email && errors.email && (
                            <div className="invalid-feedback small">{errors.email}</div>
                          )}
                        </div>

                        {/* Address */}
                        <div className="col-12">
                          <label htmlFor="address" className="form-label fw-semibold small text-dark">
                            Residential Address <span className="text-danger">*</span>
                          </label>
                          <textarea
                            id="address"
                            name="address"
                            rows={3}
                            value={formData.address}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            placeholder="Permanent / Correspondence street address, City, Pincode"
                            className={`form-control form-control-sm ${
                              touched.address ? (errors.address ? 'is-invalid' : 'is-valid') : ''
                            }`}
                            required
                          />
                          {touched.address && errors.address && (
                            <div className="invalid-feedback small">{errors.address}</div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Section 3: Academic Information */}
                    <div className="mb-4">
                      <h6 className="text-secondary fw-semibold border-bottom pb-2 mb-3">
                        3. Department & Academic Enrollment
                      </h6>

                      <div className="row g-3">
                        {/* Department */}
                        <div className="col-12 col-md-6">
                          <label htmlFor="department" className="form-label fw-semibold small text-dark">
                            Department
                          </label>
                          <select
                            id="department"
                            name="department"
                            value={formData.department}
                            onChange={handleChange}
                            className="form-select form-select-sm"
                          >
                            <option value="Computer Science & Engineering">Computer Science & Engineering</option>
                            <option value="Information Technology">Information Technology</option>
                            <option value="Electronics & Communication">Electronics & Communication</option>
                            <option value="Mechanical Engineering">Mechanical Engineering</option>
                            <option value="Civil Engineering">Civil Engineering</option>
                          </select>
                        </div>

                        {/* Semester */}
                        <div className="col-6 col-md-3">
                          <label htmlFor="semester" className="form-label fw-semibold small text-dark">
                            Semester
                          </label>
                          <select
                            id="semester"
                            name="semester"
                            value={formData.semester}
                            onChange={handleChange}
                            className="form-select form-select-sm"
                          >
                            {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                              <option key={sem} value={sem.toString()}>
                                Semester {sem}
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* Division */}
                        <div className="col-6 col-md-3">
                          <label htmlFor="division" className="form-label fw-semibold small text-dark">
                            Division
                          </label>
                          <select
                            id="division"
                            name="division"
                            value={formData.division}
                            onChange={handleChange}
                            className="form-select form-select-sm"
                          >
                            <option value="A">Div A</option>
                            <option value="B">Div B</option>
                            <option value="C">Div C</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* Declaration */}
                    <div className="mb-4">
                      <div className="form-check">
                        <input
                          className={`form-check-input ${
                            touched.agreeTerms && errors.agreeTerms ? 'is-invalid' : ''
                          }`}
                          type="checkbox"
                          id="agreeTerms"
                          name="agreeTerms"
                          checked={formData.agreeTerms}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          required
                        />
                        <label className="form-check-label small text-muted" htmlFor="agreeTerms">
                          I hereby declare that the particulars provided above are authentic to the best of my knowledge.
                        </label>
                        {touched.agreeTerms && errors.agreeTerms && (
                          <div className="invalid-feedback small">{errors.agreeTerms}</div>
                        )}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="d-flex justify-content-end gap-2 pt-2 border-top">
                      <button
                        type="button"
                        onClick={handleReset}
                        className="btn btn-sm btn-outline-secondary px-3"
                        disabled={isSubmitting}
                      >
                        Reset Form
                      </button>
                      <button
                        type="submit"
                        className="btn btn-sm btn-primary px-4 d-flex align-items-center gap-2"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          <>
                            <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                            <span>Validating & Registering...</span>
                          </>
                        ) : (
                          <span>Submit Registration</span>
                        )}
                      </button>
                    </div>

                  </form>
                </div>
              </div>
            </div>

            {/* Right Column: Practical 5 Requirements & Information Card */}
            <div className="col-12 col-lg-4">
              <div className="card shadow-sm border-0 mb-4">
                <div className="card-header bg-primary text-white py-2.5 px-3">
                  <h6 className="card-title fw-bold mb-0 small">Practical 5 Checklist</h6>
                </div>
                <div className="card-body p-3 small">
                  <ul className="list-group list-group-flush">
                    <li className="list-group-item px-0 py-2 d-flex justify-content-between align-items-center">
                      <span>Requirement I: Online CDN Link</span>
                      <span className="badge bg-success-subtle text-success border border-success-subtle">Ready</span>
                    </li>
                    <li className="list-group-item px-0 py-2 d-flex justify-content-between align-items-center">
                      <span>Requirement II: Offline/Local Setup</span>
                      <span className="badge bg-success-subtle text-success border border-success-subtle">Installed</span>
                    </li>
                    <li className="list-group-item px-0 py-2 d-flex justify-content-between align-items-center">
                      <span>Requirement III: Registration Form</span>
                      <span className="badge bg-success-subtle text-success border border-success-subtle">Active</span>
                    </li>
                  </ul>

                  <div className="mt-3 pt-2 border-top">
                    <h6 className="fw-semibold text-secondary mb-1">Required Form Fields:</h6>
                    <ul className="mb-0 text-muted ps-3" style={{ fontSize: "12px" }}>
                      <li><strong>Roll Number:</strong> Alphanumeric</li>
                      <li><strong>First Name:</strong> Required text</li>
                      <li><strong>Mobile Number:</strong> 10-digit format</li>
                      <li><strong>Email ID:</strong> Standard email validation</li>
                      <li><strong>Address:</strong> Multiline textarea</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Bootstrap Components Demonstrated Card */}
              <div className="card shadow-sm border-0">
                <div className="card-header bg-light border-bottom py-2.5 px-3">
                  <h6 className="card-title fw-semibold text-dark mb-0 small">Bootstrap 5 Components Used</h6>
                </div>
                <div className="card-body p-3">
                  <div className="d-flex flex-wrap gap-1">
                    <span className="badge bg-secondary-subtle text-secondary border">container</span>
                    <span className="badge bg-secondary-subtle text-secondary border">row & col-*</span>
                    <span className="badge bg-secondary-subtle text-secondary border">form-control</span>
                    <span className="badge bg-secondary-subtle text-secondary border">form-select</span>
                    <span className="badge bg-secondary-subtle text-secondary border">form-check</span>
                    <span className="badge bg-secondary-subtle text-secondary border">input-group</span>
                    <span className="badge bg-secondary-subtle text-secondary border">is-invalid / valid</span>
                    <span className="badge bg-secondary-subtle text-secondary border">card & card-header</span>
                    <span className="badge bg-secondary-subtle text-secondary border">btn & btn-group</span>
                    <span className="badge bg-secondary-subtle text-secondary border">alert & alert-success</span>
                    <span className="badge bg-secondary-subtle text-secondary border">spinner-border</span>
                  </div>
                </div>
              </div>

            </div>

          </div>
        )}

        {/* Tab 2: Bootstrap CDN Demonstration */}
        {activeTab === "cdn-demo" && (
          <div className="row g-4">
            <div className="col-12 col-lg-8">
              <div className="card shadow-sm border-0">
                <div className="card-header bg-info text-dark py-3 px-4">
                  <h5 className="card-title fw-bold mb-0">Practical 5 — Requirement I: Bootstrap Online CDN</h5>
                </div>
                <div className="card-body p-4">
                  <p className="text-muted small">
                    This section demonstrates loading Bootstrap 5 via an online Content Delivery Network (CDN). The CDN link delivers compiled, minified CSS with global edge distribution.
                  </p>

                  <h6 className="fw-bold text-dark mt-3 mb-2">CDN Link Configuration:</h6>
                  <div className="bg-dark text-light p-3 rounded font-monospace small mb-3 overflow-x-auto">
                    <code>
                      &lt;link rel="stylesheet"<br />
                      &nbsp;&nbsp;href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css"<br />
                      &nbsp;&nbsp;integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH"<br />
                      &nbsp;&nbsp;crossorigin="anonymous"&gt;
                    </code>
                  </div>

                  <h6 className="fw-bold text-dark mt-4 mb-2">Sample Bootstrap CDN Grid & Alert Demo:</h6>
                  <div className="row g-2 mb-3">
                    <div className="col-sm-6">
                      <div className="p-3 bg-primary-subtle text-primary border border-primary-subtle rounded text-center small fw-semibold">
                        .col-sm-6 (Primary Subtle)
                      </div>
                    </div>
                    <div className="col-sm-6">
                      <div className="p-3 bg-success-subtle text-success border border-success-subtle rounded text-center small fw-semibold">
                        .col-sm-6 (Success Subtle)
                      </div>
                    </div>
                  </div>

                  <div className="alert alert-info border-info-subtle small mb-0">
                    <strong>CDN Edge Distribution:</strong> Assets are served from nearby jsDelivr edge caches, reducing server load and ensuring rapid delivery.
                  </div>
                </div>
              </div>
            </div>

            <div className="col-12 col-lg-4">
              <div className="card shadow-sm border-0">
                <div className="card-header bg-light py-2.5 px-3">
                  <h6 className="fw-bold mb-0 small text-secondary">CDN Mode Status</h6>
                </div>
                <div className="card-body p-3 small">
                  <p className="mb-2"><strong>Current Mode:</strong> {bootstrapMode}</p>
                  <p className="mb-2"><strong>CDN Provider:</strong> jsDelivr (Official CDN for Bootstrap)</p>
                  <p className="mb-0"><strong>Version:</strong> Bootstrap 5.3.3</p>
                  <button
                    type="button"
                    onClick={() => setBootstrapMode("cdn")}
                    className={`btn btn-sm mt-3 w-100 ${bootstrapMode === 'cdn' ? 'btn-success disabled' : 'btn-primary'}`}
                  >
                    {bootstrapMode === 'cdn' ? 'CDN Mode Active' : 'Switch to CDN Mode'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Bootstrap Offline / Local Demonstration */}
        {activeTab === "offline-demo" && (
          <div className="row g-4">
            <div className="col-12 col-lg-8">
              <div className="card shadow-sm border-0">
                <div className="card-header bg-dark text-white py-3 px-4">
                  <h5 className="card-title fw-bold mb-0">Practical 5 — Requirement II: Bootstrap Offline / Local Usage</h5>
                </div>
                <div className="card-body p-4">
                  <p className="text-muted small">
                    This section demonstrates running Bootstrap 5 completely offline without requiring internet access or CDN reliance. Assets are installed locally via npm and bundled directly.
                  </p>

                  <h6 className="fw-bold text-dark mt-3 mb-2">Local Installation Command:</h6>
                  <div className="bg-dark text-light p-3 rounded font-monospace small mb-3">
                    <code>npm --prefix frontend install bootstrap</code>
                  </div>

                  <h6 className="fw-bold text-dark mt-3 mb-2">Local Asset Path:</h6>
                  <div className="bg-light p-2 rounded border font-monospace text-secondary small mb-3">
                    frontend/node_modules/bootstrap/dist/css/bootstrap.min.css
                  </div>

                  <h6 className="fw-bold text-dark mt-4 mb-2">Sample Bootstrap Buttons & Badge Component:</h6>
                  <div className="d-flex flex-wrap gap-2 mb-3">
                    <button className="btn btn-sm btn-primary">Primary</button>
                    <button className="btn btn-sm btn-secondary">Secondary</button>
                    <button className="btn btn-sm btn-success">Success</button>
                    <button className="btn btn-sm btn-danger">Danger</button>
                    <button className="btn btn-sm btn-warning">Warning</button>
                    <button className="btn btn-sm btn-outline-primary">Outline Primary</button>
                  </div>

                  <div className="alert alert-secondary small mb-0">
                    <strong>Offline Reliability:</strong> Local bundling guarantees the portal functions identically in air-gapped or offline campus environments.
                  </div>
                </div>
              </div>
            </div>

            <div className="col-12 col-lg-4">
              <div className="card shadow-sm border-0">
                <div className="card-header bg-light py-2.5 px-3">
                  <h6 className="fw-bold mb-0 small text-secondary">Local Package Status</h6>
                </div>
                <div className="card-body p-3 small">
                  <p className="mb-2"><strong>Current Mode:</strong> {bootstrapMode}</p>
                  <p className="mb-2"><strong>Package:</strong> <code>bootstrap@^5.3.8</code></p>
                  <p className="mb-0"><strong>Bundler:</strong> Vite inline stylesheet</p>
                  <button
                    type="button"
                    onClick={() => setBootstrapMode("local")}
                    className={`btn btn-sm mt-3 w-100 ${bootstrapMode === 'local' ? 'btn-success disabled' : 'btn-dark'}`}
                  >
                    {bootstrapMode === 'local' ? 'Local Mode Active' : 'Switch to Local Mode'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
