import React, { useEffect, useRef, useState } from "react";
import QRCode from "qrcode";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import DarkVeil from "../components/ui/DarkVeil";
import Shuffle from "../components/ui/Shuffle";
import DecryptedText from "../components/ui/DecryptedText";

// TODO(backend): replace with the real payment link / UPI ID once the
// payment flow is designed. This is a placeholder for the scannable QR.
const PAYMENT_LINK = "upi://pay?pa=voidsociety@ybl&pn=VOID%20Society&cu=INR";

const ACCOMMODATIONS = ["Hostel", "Outside", "Not Required"];
const PAYMENT_STATUSES = ["Paid", "Pending", "Not Paid"];
const VERIFICATION_STATUSES = ["Pending Verification", "Verified", "Rejected"];
const GROUP_STATUSES = ["Not Added", "Invited", "Added"];

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
  paymentStatus: "",
  screenshot: null,
  verificationStatus: "",
  groupStatus: "",
};

export default function Register() {
  const [form, setForm] = useState(initialState);
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [preview, setPreview] = useState(null);
  const [copied, setCopied] = useState(false);
  const [step, setStep] = useState(1);

  const qrCanvasRef = useRef(null);

  // Render the scannable QR (payment link placeholder).
  useEffect(() => {
    if (!qrCanvasRef.current) return;
    QRCode.toCanvas(qrCanvasRef.current, PAYMENT_LINK, {
      width: 260,
      margin: 2,
      color: { dark: "#050505", light: "#ffffff" },
    });
  }, []);

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

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = "Name is required.";
    if (!form.email.trim()) {
      errs.email = "KIET email is required.";
    } else if (!/^[\w.+-]+@[\w-]+(\.[\w-]+)+$/.test(form.email.trim())) {
      errs.email = "Enter a valid email address.";
    }
    if (!form.whatsapp.trim()) {
      errs.whatsapp = "WhatsApp number is required.";
    } else if (!/^\+?[\d\s-]{10,15}$/.test(form.whatsapp.trim())) {
      errs.whatsapp = "Enter a valid WhatsApp number.";
    }
    if (!form.accommodation) errs.accommodation = "Select your mode of accommodation.";
    if (!form.paymentStatus) errs.paymentStatus = "Select your payment status.";
    return errs;
  };

  // Validate only the fields belonging to the step being left.
  const validateStep = (target) => {
    const errs = {};
    if (target === 1) {
      if (!form.name.trim()) errs.name = "Name is required.";
      if (!form.email.trim()) {
        errs.email = "KIET email is required.";
      } else if (!/^[\w.+-]+@[\w-]+(\.[\w-]+)+$/.test(form.email.trim())) {
        errs.email = "Enter a valid email address.";
      }
      if (!form.whatsapp.trim()) {
        errs.whatsapp = "WhatsApp number is required.";
      } else if (!/^\+?[\d\s-]{10,15}$/.test(form.whatsapp.trim())) {
        errs.whatsapp = "Enter a valid WhatsApp number.";
      }
      if (!form.accommodation) errs.accommodation = "Select your mode of accommodation.";
    } else if (target === 3) {
      if (!form.paymentStatus) errs.paymentStatus = "Select your payment status.";
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

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    // Frontend only for now — the backend phase will wire this to an API.
    console.log("REGISTRATION_PAYLOAD", {
      ...form,
      screenshot: form.screenshot ? form.screenshot.name : null,
    });
    setSubmitted(true);
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
    setCopied(false);
  };

  const copyLink = () => {
    navigator.clipboard
      .writeText(PAYMENT_LINK)
      .then(() => setCopied(true))
      .catch(() => setCopied(false));
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
                          <input
                            className="reg-input"
                            id="branch"
                            name="branch"
                            type="text"
                            placeholder="e.g. CSE (AI & ML)"
                            value={form.branch}
                            onChange={handleChange}
                          />
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
                        <canvas ref={qrCanvasRef} className="qr-canvas" />
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

                      <div className="qr-link-row">
                        <span className="qr-link-text">{PAYMENT_LINK}</span>
                        <button type="button" className="qr-copy" onClick={copyLink}>
                          {copied ? "COPIED" : "COPY"}
                        </button>
                      </div>

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
                          <label className="reg-label" htmlFor="paymentStatus">Payment Status</label>
                          <select
                            className="reg-select"
                            id="paymentStatus"
                            name="paymentStatus"
                            value={form.paymentStatus}
                            onChange={handleChange}
                          >
                            <option value="">Select payment status</option>
                            {PAYMENT_STATUSES.map((opt) => (
                              <option key={opt} value={opt}>{opt}</option>
                            ))}
                          </select>
                          {errors.paymentStatus && <span className="reg-error">{errors.paymentStatus}</span>}
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
                        </div>

                        <div className="reg-field">
                          <label className="reg-label" htmlFor="verificationStatus">Payment Verification Status</label>
                          <select
                            className="reg-select"
                            id="verificationStatus"
                            name="verificationStatus"
                            value={form.verificationStatus}
                            onChange={handleChange}
                          >
                            <option value="">Select verification status</option>
                            {VERIFICATION_STATUSES.map((opt) => (
                              <option key={opt} value={opt}>{opt}</option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div className="reg-section">
                        <div className="reg-section-header">
                          <span className="reg-section-index">03</span>
                          <h3 className="reg-section-title">Group / Participation</h3>
                        </div>

                        <div className="reg-field">
                          <label className="reg-label" htmlFor="groupStatus">WhatsApp Group Status</label>
                          <select
                            className="reg-select"
                            id="groupStatus"
                            name="groupStatus"
                            value={form.groupStatus}
                            onChange={handleChange}
                          >
                            <option value="">Select group status</option>
                            {GROUP_STATUSES.map((opt) => (
                              <option key={opt} value={opt}>{opt}</option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div className="reg-nav">
                        <button type="button" className="reg-back" onClick={prevStep}>← Back</button>
                        <button type="submit" className="register-submit reg-nav-next">Register Now</button>
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
