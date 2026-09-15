import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, Search, Menu, ChevronDown, CheckCircle2, CalendarCheck, Palette, LogOut, LayoutDashboard } from "lucide-react";
import { useAuth } from "../context/useAuth";

const notifications = [
  { id: 1, title: "Booking confirmed", text: "Full Home Cleaning · 18 Sep, 10:00 AM", time: "5m ago", icon: CheckCircle2, color: "green" },
  { id: 2, title: "Provider accepted", text: "Plumbing Repair · BK-7840 · Irfan", time: "2h ago", icon: CalendarCheck, color: "blue" },
  { id: 3, title: "Payment released", text: "₹899 credited for Garden Maintenance", time: "1d ago", icon: CheckCircle2, color: "green" },
  { id: 4, title: "New training camp", text: "3-day co-op upskilling this weekend", time: "2d ago", icon: Palette, color: "violet" },
];

const homeByRole = {
  customer: "/dashboard",
  provider: "/provider",
  admin: "/admin",
};

const navLabelByRole = {
  customer: "My Dashboard",
  provider: "My Workspace",
  admin: "Admin Panel",
};

function Topbar({ title, subtitle = "Welcome back", onMenuClick }) {
  const [query, setQuery] = useState("");
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const initials = user?.initials || "SA";
  const firstName = user?.name?.split(" ")[0] || "Member";

  function handleSearch(e) {
    e.preventDefault();
    navigate(`/services?q=${encodeURIComponent(query.trim())}`);
    setQuery("");
  }

  function handleLogout() {
    setProfileOpen(false);
    logout();
    navigate("/");
  }

  return (
    <header className="topbar">
      <button className="mobile-menu-btn" onClick={onMenuClick} aria-label="Open menu">
        <Menu size={22} />
      </button>

      <div className="topbar-title">
        <h2>{title}</h2>
        <p>{subtitle}</p>
      </div>

      <div className="topbar-actions">
        <form className="top-search" onSubmit={handleSearch}>
          <Search size={17} />
          <input
            placeholder="Search services, providers..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Search"
          />
        </form>

        <div className="dropdown-wrap">
          <button
            className="icon-btn sm-hide"
            aria-label="Notifications"
            onClick={() => { setNotifOpen((o) => !o); setProfileOpen(false); }}
          >
            <Bell size={19} />
            <span className="notif-dot" />
          </button>

          {notifOpen && (
            <>
              <div className="dropdown-backdrop" onClick={() => setNotifOpen(false)} />
              <div className="dropdown-panel notif-panel">
                <div className="dropdown-head">
                  <h4>Notifications</h4>
                  <button className="link-muted" onClick={() => { setNotifOpen(false); }}>Mark all read</button>
                </div>
                {notifications.map((n) => {
                  const Icon = n.icon;
                  return (
                    <button
                      className={`notif-item color-${n.color}`}
                      key={n.id}
                      onClick={() => setNotifOpen(false)}
                    >
                      <span className="notif-icon"><Icon size={16} /></span>
                      <span className="notif-body">
                        <strong>{n.title}</strong>
                        <span>{n.text}</span>
                        <small>{n.time}</small>
                      </span>
                    </button>
                  );
                })}
                <button
                  className="dropdown-foot"
                  onClick={() => { setNotifOpen(false); navigate("/bookings"); }}
                >
                  View all activity
                </button>
              </div>
            </>
          )}
        </div>

        <div className="dropdown-wrap">
          <button
            className="profile-chip"
            aria-label="Profile menu"
            onClick={() => { setProfileOpen((o) => !o); setNotifOpen(false); }}
          >
            <span className="avatar avatar-sm sm-hide">{initials}</span>
            <span className="sm-hide">{firstName}</span>
            <ChevronDown size={16} />
          </button>

          {profileOpen && (
            <>
              <div className="dropdown-backdrop" onClick={() => setProfileOpen(false)} />
              <div className="dropdown-panel profile-panel">
                <div className="profile-drop-head">
                  <div className="avatar">{initials}</div>
                  <div>
                    <strong>{user?.name}</strong>
                    <span>{user?.email}</span>
                  </div>
                </div>
                <button className="dropdown-item" onClick={() => { setProfileOpen(false); navigate(homeByRole[user?.role] || "/"); }}>
                  <LayoutDashboard size={16} /> {navLabelByRole[user?.role] || "My Dashboard"}
                </button>
                <button className="dropdown-item" onClick={() => { setProfileOpen(false); navigate("/bookings"); }}>
                  <CalendarCheck size={16} /> My Bookings
                </button>
                <button className="dropdown-item" onClick={() => { setProfileOpen(false); navigate("/community"); }}>
                  <Palette size={16} /> Community
                </button>
                <button className="dropdown-item danger" onClick={handleLogout}>
                  <LogOut size={16} /> Logout
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

export default Topbar;