import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Users, BriefcaseBusiness, ShieldCheck, ArrowRight, Mail, LockKeyhole,
  Handshake, Sparkles, ChevronLeft,
} from "lucide-react";
import { useToast } from "../useToast";
import { useAuth } from "../context/useAuth";

const roles = [
  { id: "customer", title: "Customer", description: "Book household services", icon: Users, to: "/dashboard" },
  { id: "provider", title: "Service Provider", description: "Offer your skills", icon: BriefcaseBusiness, to: "/provider" },
  { id: "admin", title: "Admin", description: "Manage the platform", icon: ShieldCheck, to: "/admin" },
];

const demoAccounts = [
  { role: "customer", label: "Customer", email: "ananya@example.com", to: "/dashboard" },
  { role: "provider", label: "Provider", email: "rekha@example.com", to: "/provider" },
  { role: "admin", label: "Admin", email: "admin@sahayog.in", to: "/admin" },
];

function Login() {
  const [role, setRole] = useState("customer");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const toast = useToast();
  const { login } = useAuth();

  const redirectTarget = () => {
    const from = location.state?.from;
    return from || roles.find((r) => r.id === role)?.to || "/dashboard";
  };

  function signIn(targetRole) {
    login(targetRole);
    const t = roles.find((r) => r.id === targetRole);
    toast(`Signed in as ${t.title}. Welcome to Sahayog!`, "success");
    const target = location.state?.from || t.to;
    setTimeout(() => navigate(target), 350);
  }

  function handleLogin(e) {
    e.preventDefault();

    if (!email || !password) {
      toast("Please enter email and password.", "error");
      return;
    }

    signIn(role);
  }

  function demoLogin(d) {
    setRole(d.role);
    setEmail(d.email);
    setPassword("demo1234");
    toast(`Signed in as ${d.label} · ${d.email}`, "success");
    setTimeout(() => navigate(redirectTarget()), 350);
  }

  return (
    <div className="login-page">
      <div className="login-topbar">
        <Link to="/" className="login-back">
          <ChevronLeft size={18} /> Back to home
        </Link>
        <Link to="/" className="login-brand">
          <span className="brand-icon"><Handshake size={20} /></span>
          <span className="brand-text">Sahayog</span>
        </Link>
      </div>

      <div className="login-frame">
        <div className="login-left">
          <span className="hero-badge">
            <Sparkles size={15} /> Together We Grow
          </span>

          <h1>
            Empowering people.
            <br />
            Strengthening <span className="grad-text">communities.</span>
          </h1>

          <p className="login-desc">
            Connect with trusted local service providers, discover opportunities,
            and build a stronger cooperative community.
          </p>

          <div className="login-features">
            <div><ShieldCheck size={22} /><span>Trusted local service providers</span></div>
            <div><Users size={22} /><span>Community-powered services</span></div>
            <div><BriefcaseBusiness size={22} /><span>Meaningful earning opportunities</span></div>
          </div>

          <div className="login-quote">
            "The cooperative model isn't charity. It's the most efficient way
            to build income, dignity and safety for local workers."
            <cite>— Sahayog Founding Charter</cite>
          </div>
        </div>

        <div className="login-card">
          <div className="login-heading">
            <h2>Welcome back!</h2>
            <p>Sign in to your Sahayog account</p>
          </div>

          <div className="role-selection">
            <label>Login as</label>
            <div className="role-grid">
              {roles.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    type="button"
                    key={item.id}
                    className={role === item.id ? "role-card selected" : "role-card"}
                    onClick={() => setRole(item.id)}
                  >
                    <Icon size={21} />
                    <strong>{item.title}</strong>
                    <small>{item.description}</small>
                  </button>
                );
              })}
            </div>
          </div>

          <form onSubmit={handleLogin}>
            <label className="field-label" htmlFor="email">Email Address</label>
            <div className="input-box">
              <Mail size={19} />
              <input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <label className="field-label" htmlFor="password">Password</label>
            <div className="input-box">
              <LockKeyhole size={19} />
              <input
                id="password"
                type={showPass ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="toggle-pass"
                onClick={() => setShowPass((s) => !s)}
                aria-label="Toggle password visibility"
              >
                {showPass ? "Hide" : "Show"}
              </button>
            </div>

            <div className="login-options">
              <label className="remember">
                <input type="checkbox" /> Remember me
              </label>
              <a href="#forgot" className="link-muted">Forgot password?</a>
            </div>

            <button type="submit" className="btn btn-primary btn-block">
              Sign In <ArrowRight size={18} />
            </button>
          </form>

          <div className="demo-box">
            <p>No sign-up needed — tap a demo role:</p>
            <div className="demo-row">
              {demoAccounts.map((d) => (
                <button
                  type="button"
                  key={d.role}
                  className="demo-chip"
                  onClick={() => demoLogin(d)}
                  title={`Sign in as ${d.email}`}
                >
                  {d.label}
                </button>
              ))}
            </div>
          </div>

          <p className="signup-text">
            Don't have an account?
            <Link to="/offer-service"> Create one as a Provider</Link>
          </p>

          <p className="demo-note">
            Demo prototype — any valid email &amp; password works.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;