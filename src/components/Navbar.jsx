import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { Handshake, Menu, X, Phone, LogIn } from "lucide-react";

const links = [
  { label: "Home", path: "/" },
  { label: "Services", path: "/services" },
  { label: "Providers", path: "/providers" },
  { label: "Community", path: "/community" },
  { label: "Offer a Service", path: "/offer-service" },
];

function Navbar() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="navbar-brand">
          <span className="brand-icon">
            <Handshake size={22} />
          </span>
          <span className="brand-text">
            Sahayog
            <small>Together We Work</small>
          </span>
        </Link>

        <nav className={`navbar-links ${open ? "open" : ""}`}>
          {links.map((l) => (
            <NavLink
              key={l.path}
              to={l.path}
              className={({ isActive }) => (isActive ? "navbar-link active" : "navbar-link")}
              onClick={() => setOpen(false)}
            >
              {l.label}
            </NavLink>
          ))}

          <div className="navbar-mobile-cta">
            <button className="btn btn-outline btn-sm" onClick={() => { setOpen(false); navigate("/login"); }}>
              <LogIn size={16} /> Login
            </button>
          </div>
        </nav>

        <div className="navbar-actions">
          <button className="btn btn-outline btn-sm btn-login" onClick={() => navigate("/login")}>
            <LogIn size={16} /> Login
          </button>
          <button className="navbar-burger" onClick={() => setOpen((o) => !o)} aria-label="Menu">
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      <div className="navbar-bottom-bar">
        <div className="navbar-inner">
          <span>
            <Phone size={14} /> Support: 1800-SAH-AYOG
          </span>
          <span>Empowering local cooperatives across 25+ cities</span>
        </div>
      </div>
    </header>
  );
}

export default Navbar;