import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ShieldCheck, Users, CheckCircle2, IndianRupee,
  Wallet, BadgeCheck, Award, Handshake,
} from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import BackButton from "../components/BackButton";
import { categories } from "../data";

const benefits = [
  { icon: Wallet, title: "Keep 92% of your earnings", text: "Flat pricing, no hidden commission." },
  { icon: Users, title: "Join a local cooperative", text: "Collective safety, training & support." },
  { icon: ShieldCheck, title: "Free skill verification", text: "Aadhaar + skill certification included." },
  { icon: Award, title: "Earn on your terms", text: "Flexible hours, choose your jobs." },
];

function OfferService() {
  const [submitted, setSubmitted] = useState(false);
  const [coopChoice, setCoopChoice] = useState("existing");
  const navigate = useNavigate();

  function handleSubmit(e) {
    e.preventDefault();
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="page-wrap">
        <Navbar />
        <div className="page-inner center-col">
          <div className="success-panel">
            <div className="confirm-tick">
              <CheckCircle2 size={44} />
            </div>
            <span className="eyebrow">APPLICATION RECEIVED</span>
            <h1>Welcome to the fold, provider!</h1>
            <p>
              Your application has been submitted to the{" "}
              <strong>Nari Shakti Cooperative</strong>. Our verification desk will
              call you within <strong>48 hours</strong> for your Aadhaar &amp; skill
              verification.
            </p>
            <div className="success-steps">
              <div><span>1</span><p>Application sent <BadgeCheck size={15} /></p></div>
              <div><span>2</span><p>Verification call <em>within 48h</em></p></div>
              <div><span>3</span><p>Profile live on Sahayog</p></div>
            </div>
            <div className="btn-row center">
              <button className="btn btn-primary" onClick={() => navigate("/login")}>
                Continue to Login
              </button>
              <Link to="/" className="btn btn-outline">Back to Home</Link>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="page-wrap">
      <Navbar />

      <div className="page-hero slim">
        <div className="page-inner">
          <BackButton className="hero">Back to home</BackButton>
          <span className="eyebrow">BECOME A PROVIDER</span>
          <h1>Turn your skills into fair income</h1>
          <p>
            Join 500+ cooperative-backed professionals earning on their own terms.
            Verification, training and insurance — all covered.
          </p>
        </div>
      </div>

      <div className="page-inner">
        <div className="offer-grid">
          <div className="offer-benefits">
            <h3>What you get when you join</h3>
            <div className="benefit-list">
              {benefits.map((b) => {
                const IconC = b.icon;
                return (
                  <div className="benefit-item" key={b.title}>
                    <div className="benefit-icon"><IconC size={20} /></div>
                    <div>
                      <strong>{b.title}</strong>
                      <p>{b.text}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="coop-highlight">
              <div className="avatar avatar-lg color-violet">PR</div>
              <div>
                <strong>Pushpa Rani's story</strong>
                <p>
                  "From cooking for one family to a 200-meal tiffin service — the
                  cooperative made me confident and my income tripled."
                </p>
                <span>Pushpa Rani · Annapurna Cooks Co-op</span>
              </div>
            </div>

            <div className="trust-strip">
              <span><Handshake size={15} /> 25+ partner cooperatives</span>
              <span><ShieldCheck size={15} /> 100% identity verified</span>
              <span><IndianRupee size={15} /> No joining fees</span>
            </div>
          </div>

          <form className="offer-form" onSubmit={handleSubmit}>
            <h3>Provider registration</h3>
            <p className="muted-text">
              Takes about 2 minutes. Your data is encrypted and never sold.
            </p>

            <div className="form-grid">
              <div className="field-block">
                <label className="field-label">Full name</label>
                <input className="input" placeholder="e.g. Rekha Kumari" required />
              </div>
              <div className="field-block">
                <label className="field-label">Phone number</label>
                <div className="input-box with-prefix">
                  <span className="prefix">+91</span>
                  <input className="input-plain" placeholder="98XXXXXXXX" pattern="[0-9]{10}" required />
                </div>
              </div>
              <div className="field-block">
                <label className="field-label">Email</label>
                <input className="input" type="email" placeholder="you@example.com" required />
              </div>
              <div className="field-block">
                <label className="field-label">City / Area</label>
                <input className="input" placeholder="e.g. Koramangala, Bengaluru" required />
              </div>
            </div>

            <div className="field-block">
              <label className="field-label">Primary service you offer</label>
              <select className="input select">
                {categories.map((c) => (
                  <option key={c.id}>{c.label}</option>
                ))}
                <option>Other</option>
              </select>
            </div>

            <div className="field-block">
              <label className="field-label">Other skills (add up to 3)</label>
              <div className="chip-input">
                {["Deep Cleaning", "Car Washing"].map((s) => (
                  <span className="chip removable" key={s}>{s} ×</span>
                ))}
                <input className="input-plain" placeholder="Add skill and press Enter" />
              </div>
            </div>

            <div className="field-block">
              <label className="field-label">Experience</label>
              <select className="input select">
                <option>Less than 1 year</option>
                <option>1 – 3 years</option>
                <option>3 – 5 years</option>
                <option>5+ years</option>
              </select>
            </div>

            <div className="field-block">
              <label className="field-label">Cooperative preference</label>
              <div className="coop-radios">
                <label className={`coop-radio ${coopChoice === "existing" ? "selected" : ""}`}>
                  <input
                    type="radio"
                    name="coop"
                    checked={coopChoice === "existing"}
                    onChange={() => setCoopChoice("existing")}
                  />
                  <strong>Join an existing cooperative</strong>
                  <span>We'll place you with the best-fit co-op in your area.</span>
                </label>
                <label className={`coop-radio ${coopChoice === "new" ? "selected" : ""}`}>
                  <input
                    type="radio"
                    name="coop"
                    checked={coopChoice === "new"}
                    onChange={() => setCoopChoice("new")}
                  />
                  <strong>Start a new cooperative</strong>
                  <span>We support 10+ member groups to register &amp; grow.</span>
                </label>
              </div>
            </div>

            <div className="field-block">
              <label className="field-label">Tell us about yourself</label>
              <textarea
                className="textarea"
                rows="3"
                placeholder="Share your experience and why you want to join."
              />
            </div>

            <div className="payout-note">
              <IndianRupee size={18} />
              <p>
                <strong>92% payout on every job.</strong> The remaining 8% funds
                insurance, training and platform safety for the cooperative.
              </p>
            </div>

            <label className="radio-row check">
              <input type="checkbox" required />
              <span>
                I agree to the <a href="#terms" className="link-muted">Provider Terms</a> and
                confirm my details are accurate.
              </span>
            </label>

            <button type="submit" className="btn btn-primary btn-block btn-lg">
              Submit Application
            </button>
            <p className="muted-text center small">
              By applying you agree to a one-time background verification.
            </p>
          </form>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default OfferService;