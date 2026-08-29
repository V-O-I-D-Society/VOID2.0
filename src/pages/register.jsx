import React, { useState } from "react";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import DarkVeil from "../components/ui/DarkVeil";
import Shuffle from "../components/ui/Shuffle";
import DecryptedText from "../components/ui/DecryptedText";

const ACCOMMODATIONS = ["Hosteller", "Outside"];

const JOIN_GROUP_OPTIONS = ["Yes", "No"];

const WHATSAPP_GROUP_URL = "https://chat.whatsapp.com/YOUR_GROUP_LINK"; // TODO: replace with actual group invite link

const BRANCHES = [
  { code: "CSE", label: "CSE — Computer Science & Engineering" },
  { code: "CS", label: "CS — Computer Science" },
  { code: "CSE (AI)", label: "CSE (AI) — Computer Science & Engineering (Artificial Intelligence)" },
  { code: "CSE (AI & ML)", label: "CSE (AI & ML) — Computer Science & Engineering (Artificial Intelligence & Machine Learning)" },
  { code: "IT", label: "IT — Information Technology" },
  { code: "CSIT", label: "CSIT — Computer Science & Information Technology" },
  { code: "CSE (DS)", label: "CSE (DS) — Computer Science & Engineering (Data Science)" },
  { code: "CSE (CS)", label: "CSE (CS) — Computer Science & Engineering (Cyber Security)" },
  { code: "ECE", label: "ECE — Electronics & Communication Engineering" },
  { code: "EEE", label: "EEE — Electrical & Electronics Engineering" },
  { code: "EC", label: "EC — Electrical & Computer Engineering" },
  { code: "ECE (VLSI)", label: "ECE (VLSI) — Electronics & Communication Engineering (VLSI Design & Technology)" },
  { code: "ME", label: "ME — Mechanical Engineering" },
  { code: "AMIA", label: "AMIA — Advanced Mechatronics & Industrial Automation" },
  { code: "MBA", label: "MBA — Master of Business Administration" },
  { code: "MCA", label: "MCA — Master of Computer Applications" },
];

const CheckmarkIcon = () => (
  <svg className="register-checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
    <circle className="register-checkmark-circle" cx="26" cy="26" r="25" fill="none" />
    <path className="register-checkmark-check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8" />
  </svg>
);

const initialState = {
  name: "",
  branch: "",
  email: "",
  whatsapp: "",
  accommodation: "",
  joinGroup: "",
  screenshot: null,
};

export default function Register() {
  const [form, setForm] = useState(initialState);
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [preview, setPreview] = useState(null);
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleFile = (e) => {
    const file = e.target.files && e.target.files[0];
    setForm((prev) => ({ ...prev, screenshot: file || null }));
    if (file) {
      setPreview((prevUrl) => {
        if (prevUrl) URL.revokeObjectURL(prevUrl);
        return URL.createObjectURL(file);
      });
    } else {
      setPreview((prevUrl) => {
        if (prevUrl) URL.revokeObjectURL(prevUrl);
        return null;
      });
    }
    setErrors((prev) => ({ ...prev, screenshot: undefined }));
  };

  const validateEmail = (value) => {
    const email = value.trim();
    if (!email) return "KIET email is required.";
    if (!/^[\w.+-]+@[\w-]+(\.[\w-]+)+$/.test(email)) return "Enter a valid email address.";
    if (!/@kiet\.edu$/i.test(email)) return "Only @kiet.edu email addresses are allowed.";
    return undefined;
  };

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = "Name is required.";
    const emailErr = validateEmail(form.email);
    if (emailErr) errs.email = emailErr;
    if (!form.whatsapp.trim()) {
      errs.whatsapp = "WhatsApp number is required.";
    } else if (!/^\+?[\d\s-]{10,15}$/.test(form.whatsapp.trim())) {
      errs.whatsapp = "Enter a valid WhatsApp number.";
    }
    if (!form.accommodation) errs.accommodation = "Select your mode of accommodation.";
    if (!form.screenshot) errs.screenshot = "Upload your payment screenshot.";
    return errs;
  };

  // Validate only the fields belonging to the step being left.
  const validateStep = (target) => {
    const errs = {};
    if (target === 1) {
      if (!form.name.trim()) errs.name = "Name is required.";
      const emailErr = validateEmail(form.email);
      if (emailErr) errs.email = emailErr;
      if (!form.whatsapp.trim()) {
        errs.whatsapp = "WhatsApp number is required.";
      } else if (!/^\+?[\d\s-]{10,15}$/.test(form.whatsapp.trim())) {
        errs.whatsapp = "Enter a valid WhatsApp number.";
      }
      if (!form.accommodation) errs.accommodation = "Select your mode of accommodation.";
    }
    return errs;
  };

  const nextStep = () => {
    const errs = validateStep(step);
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setErrors({});
    setStep((s) => Math.min(s + 1, 3));
  };

  const prevStep = () => {
    setErrors({});
    setStep((s) => Math.max(s - 1, 1));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    setSubmitting(true);
    setServerError("");

    const data = new FormData();
    data.append("name", form.name.trim());
    data.append("branch", form.branch);
    data.append("email", form.email.trim());
    data.append("whatsapp", form.whatsapp.trim());
    data.append("accommodation", form.accommodation);
    if (form.screenshot) data.append("screenshot", form.screenshot);

    try {
      const res = await fetch("/api/register", { method: "POST", body: data });

      if (res.status === 409) {
        const body = await res.json().catch(() => ({}));
        setErrors((prev) => ({ ...prev, email: body.errors?.email || "This email is already registered." }));
        return;
      }
      if (res.status === 422) {
        const body = await res.json().catch(() => ({}));
        setErrors(body.errors || {});
        return;
      }
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        setServerError(body.error || "Something went wrong. Please try again.");
        return;
      }
      setSubmitted(true);
    } catch {
      setServerError("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleReset = () => {
    setForm(initialState);
    setErrors({});
    setSubmitted(false);
    setStep(1);
    setPreview((prevUrl) => {
      if (prevUrl) URL.revokeObjectURL(prevUrl);
      return null;
    });
    setServerError("");
    setSubmitting(false);
  };

  return (
    <>
      <Navbar />
      <div className="register-page">
        <div className="register-bg">
          <DarkVeil hueShift={40} noiseIntensity={0.25} scanlineIntensity={0.15} speed={0.45} />
        </div>

        <div className="register-content">
          <section className="register-hero">
            <p className="register-hero-kicker">
              <DecryptedText text="// VOID SOCIETY · REGISTRATION" speed={35} />
            </p>
            <h1 className="register-hero-title">
              <Shuffle
                tag="h1"
                text="JOIN THE VOID"
                className="font-shuffle"
                textAlign="center"
                shuffleDirection="up"
                duration={0.4}
                stagger={0.04}
                shuffleTimes={1}
              />
            </h1>
            <p className="register-hero-subtitle">
              <DecryptedText
                text="Enter the arena. Secure your slot in the only cybersecurity club of KIET."
                speed={28}
                sequential={false}
              />
            </p>
          </section>

          <div className="register-grid">
            {submitted ? (
              <div className="register-form-card reg-step">
                <div className="register-success">
                  <CheckmarkIcon />
                  <h2>Registration Submitted</h2>
                  <p>
                    Welcome to the void. Our team will verify your payment and add you to the
                    group shortly.
                  </p>
                  <button type="button" className="register-submit" onClick={handleReset}>
                    Register Another
                  </button>
                </div>
              </div>
            ) : (
              <>
                {/* Step 1 — Personal info */}
                {step === 1 && (
                  <div className="register-form-card reg-step">
                    <form onSubmit={(e) => e.preventDefault()} noValidate>
                      <div className="reg-section">
                        <div className="reg-section-header">
                          <span className="reg-section-index">01</span>
                          <h3 className="reg-section-title">Personal Information</h3>
                        </div>

                        <div className="reg-field">
                          <label className="reg-label" htmlFor="name">Name</label>
                          <input
                            className="reg-input"
                            id="name"
                            name="name"
                            type="text"
                            placeholder="Your full name"
                            value={form.name}
                            onChange={handleChange}
                          />
                          {errors.name && <span className="reg-error">{errors.name}</span>}
                        </div>

                        <div className="reg-field">
                          <label className="reg-label" htmlFor="branch">Branch</label>
                          <select
                            className="reg-select"
                            id="branch"
                            name="branch"
                            value={form.branch}
                            onChange={handleChange}
                          >
                            <option value="">Select Branch</option>
                            {BRANCHES.map((b) => (
                              <option key={b.code} value={b.code}>{b.label}</option>
                            ))}
                          </select>
                        </div>

                        <div className="reg-field">
                          <label className="reg-label" htmlFor="email">KIET Email ID</label>
                          <input
                            className="reg-input"
                            id="email"
                            name="email"
                            type="email"
                            placeholder="you@kiet.edu"
                            value={form.email}
                            onChange={handleChange}
                          />
                          {errors.email && <span className="reg-error">{errors.email}</span>}
                        </div>

                        <div className="reg-field">
                          <label className="reg-label" htmlFor="whatsapp">WhatsApp Number</label>
                          <input
                            className="reg-input"
                            id="whatsapp"
                            name="whatsapp"
                            type="tel"
                            placeholder="+91 XXXXX XXXXX"
                            value={form.whatsapp}
                            onChange={handleChange}
                          />
                          {errors.whatsapp && <span className="reg-error">{errors.whatsapp}</span>}
                        </div>

                        <div className="reg-field">
                          <label className="reg-label" htmlFor="accommodation">Mode of Accommodation</label>
                          <select
                            className="reg-select"
                            id="accommodation"
                            name="accommodation"
                            value={form.accommodation}
                            onChange={handleChange}
                          >
                            <option value="">Select accommodation</option>
                            {ACCOMMODATIONS.map((opt) => (
                              <option key={opt} value={opt}>{opt}</option>
                            ))}
                          </select>
                          {errors.accommodation && <span className="reg-error">{errors.accommodation}</span>}
                        </div>

                        <div className="reg-field">
                          <label className="reg-label" htmlFor="joinGroup">Did you join our WhatsApp group?</label>
                          <select
                            className="reg-select"
                            id="joinGroup"
                            name="joinGroup"
                            value={form.joinGroup}
                            onChange={handleChange}
                          >
                            <option value="">Select</option>
                            {JOIN_GROUP_OPTIONS.map((opt) => (
                              <option key={opt} value={opt}>{opt}</option>
                            ))}
                          </select>
                          {errors.joinGroup && <span className="reg-error">{errors.joinGroup}</span>}
                        </div>

                        <a
                          className="reg-whatsapp-btn"
                          href={WHATSAPP_GROUP_URL}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Join WhatsApp Group
                        </a>
                      </div>

                      <button type="button" className="register-submit" onClick={nextStep}>
                        Continue →
                      </button>
                    </form>
                  </div>
                )}

                {/* Step 2 — Scan to pay */}
                {step === 2 && (
                  <div className="register-side reg-step">
                    <div className="qr-panel">
                      <div className="qr-panel-header">
                        <span className="qr-status-dot" />
                        <span className="qr-panel-title">SCAN TO PAY</span>
                      </div>

                      <div className="qr-frame">
                        <img className="qr-canvas" src="/assets/qr.png" alt="UPI payment QR code" />
                        <span className="qr-scanline" />
                        <span className="qr-corner qr-corner-tl" />
                        <span className="qr-corner qr-corner-tr" />
                        <span className="qr-corner qr-corner-bl" />
                        <span className="qr-corner qr-corner-br" />
                      </div>

                      <p className="qr-panel-sub">
                        <DecryptedText text="SCAN THE CODE" speed={30} />
                      </p>
                      <p className="qr-panel-desc">
                        Complete your payment via any UPI app, then upload the screenshot in the form.
                      </p>

                      <div className="reg-nav">
                        <button type="button" className="reg-back" onClick={prevStep}>← Back</button>
                        <button type="button" className="register-submit reg-nav-next" onClick={nextStep}>
                          Continue →
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 3 — Payment */}
                {step === 3 && (
                  <div className="register-form-card reg-step">
                    <form onSubmit={handleSubmit} noValidate>
                      <div className="reg-section">
                        <div className="reg-section-header">
                          <span className="reg-section-index">02</span>
                          <h3 className="reg-section-title">Payment Details</h3>
                        </div>

                        <div className="reg-field">
                          <label className="reg-label" htmlFor="screenshot">Payment Screenshot</label>
                          <div className="reg-file-wrap">
                            <label className="reg-file" htmlFor="screenshot">
                              {preview ? "Change screenshot" : "Upload payment screenshot"}
                            </label>
                            <input
                              className="reg-file-input"
                              id="screenshot"
                              name="screenshot"
                              type="file"
                              accept="image/*"
                              onChange={handleFile}
                            />
                          </div>
                          {preview && (
                            <div className="reg-preview">
                              <img src={preview} alt="Payment screenshot preview" />
                            </div>
                          )}
                          {errors.screenshot && <span className="reg-error">{errors.screenshot}</span>}
                        </div>

                      </div>

                      {serverError && <span className="reg-error">{serverError}</span>}
                      <div className="reg-nav">
                        <button type="button" className="reg-back" onClick={prevStep}>← Back</button>
                        <button type="submit" className="register-submit reg-nav-next" disabled={submitting}>
                          {submitting ? "Submitting…" : "Register Now"}
                        </button>
                      </div>
                    </form>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
