import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Users, BriefcaseBusiness, CalendarCheck, Wrench, IndianRupee, Star,
  TrendingUp, ShieldCheck, Building2, Search, MoreHorizontal, BadgeCheck,
  XCircle, CheckCircle2, ChevronRight, Phone,
} from "lucide-react";
import AppLayout from "../components/AppLayout";
import StatCard from "../components/StatCard";
import StatusBadge from "../components/StatusBadge";
import Modal from "../components/Modal";
import BackButton from "../components/BackButton";
import BookingTable from "../components/BookingTable";
import { adminStats, users, providers, services } from "../data";
import { useToast } from "../useToast";
import { useData } from "../context/useData";

const userTabs = [
  { id: "all", label: "All" },
  { id: "customer", label: "Customers" },
  { id: "provider", label: "Providers" },
  { id: "admin", label: "Admins" },
];

function AdminDashboard() {
  const [userTab, setUserTab] = useState("all");
  const [userQuery, setUserQuery] = useState("");
  const [providerList, setProviderList] = useState(providers);
  const [inspect, setInspect] = useState(null);
  const token = useToast();
  const { bookings } = useData();

  const serviceMap = useMemo(() => Object.fromEntries(services.map((s) => [s.id, s])), []);
  const providerMap = useMemo(() => Object.fromEntries(providers.map((p) => [p.id, p])), []);

  const filteredUsers = useMemo(() => {
    let list = [...users];
    if (userTab !== "all") list = list.filter((u) => u.type === userTab);
    if (userQuery.trim()) {
      const q = userQuery.toLowerCase();
      list = list.filter((u) =>
        u.name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        u.id.toLowerCase().includes(q)
      );
    }
    return list;
  }, [userTab, userQuery]);

  function verifyProvider(id) {
    setProviderList((list) => list.map((p) => (p.id === id ? { ...p, verified: true } : p)));
    token("Provider verified & live on the platform.", "success");
  }

  const monthData = [
    { label: "Aug 1", amount: 410 },
    { label: "Aug 8", amount: 370 },
    { label: "Aug 15", amount: 520 },
    { label: "Aug 22", amount: 480 },
    { label: "Aug 29", amount: 610 },
    { label: "Sep 5", amount: 540 },
  ];

  return (
    <AppLayout
      role="admin"
      title="Admin Dashboard"
      subtitle="Platform overview — Bengaluru cluster"
    >
      <BackButton />
      <div className="admin-alert">
        <ShieldCheck size={18} />
        <div>
          <strong>3 providers pending verification</strong>
          <span>Review their documents in the Providers section below.</span>
        </div>
        <button className="btn btn-white btn-sm" onClick={() => setUserTab("provider")}>
          Review Now
        </button>
      </div>

      <div className="stat-grid four">
        <StatCard title="Total Users" value={adminStats.totalUsers.toLocaleString("en-IN")} change="+18%" type="blue" icon={<Users size={20} />} />
        <StatCard title="Active Providers" value={adminStats.totalProviders} change="+12 this month" type="green" icon={<BriefcaseBusiness size={20} />} />
        <StatCard title="Bookings" value={adminStats.totalBookings.toLocaleString("en-IN")} change="+24%" type="violet" icon={<CalendarCheck size={20} />} />
        <StatCard title="Total Revenue" value={adminStats.revenue} change="+16%" type="orange" icon={<IndianRupee size={20} />} />
      </div>

      <div className="admin-grid">
        <div className="panel admin-chart-panel">
          <div className="section-head">
            <div>
              <span className="eyebrow">REVENUE</span>
              <h3>Bookings last 6 weeks</h3>
            </div>
            <span className="admin-chip"><TrendingUp size={14} /> {adminStats.growth}</span>
          </div>

          <div className="area-chart">
            <div className="area-bars">
              {monthData.map((d) => (
                <div className="area-col" key={d.label}>
                  <span className="area-value">{d.amount}</span>
                  <div className="area-bar" style={{ height: `${d.amount / 6.5}%` }} />
                  <span className="area-label">{d.label}</span>
                </div>
              ))}
            </div>
            <div className="area-total">
              <IndianRupee size={16} />
              <strong>₹32.4L</strong>
              <span>6-week gross booking value</span>
            </div>
          </div>
        </div>

        <div className="panel">
          <div className="section-head">
            <h3>Platform health</h3>
          </div>
          <div className="health-metrics">
            <div className="health-row">
              <span>Avg. rating</span>
              <strong><Star size={14} fill="currentColor" /> {adminStats.avgRating}</strong>
            </div>
            <div className="health-row">
              <span>Verification rate</span>
              <strong>{Math.round((providers.filter((p) => p.verified).length / providers.length) * 100)}%</strong>
            </div>
            <div className="health-row">
              <span>Complaints (7 days)</span>
              <strong>2</strong>
            </div>
            <div className="health-row">
              <span>Avg. response time</span>
              <strong>1.9h</strong>
            </div>
            <div className="health-row">
              <span>Repeat booking rate</span>
              <strong>47%</strong>
            </div>
          </div>
        </div>
      </div>

      <div className="panel admin-table-panel">
        <div className="section-head">
          <div>
            <span className="eyebrow">USER MANAGEMENT</span>
            <h3>All users</h3>
          </div>
          <div className="admin-tools">
            <div className="small-search">
              <Search size={16} />
              <input
                placeholder="Search users..."
                value={userQuery}
                onChange={(e) => setUserQuery(e.target.value)}
                aria-label="Search users"
              />
            </div>
            <div className="tabs">
              {userTabs.map((t) => (
                <button key={t.id} className={userTab === t.id ? "tab active" : "tab"} onClick={() => setUserTab(t.id)}>
                  {t.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="table-wrap">
          <table className="booking-table">
            <thead>
              <tr>
                <th>User</th>
                <th>ID</th>
                <th>Type</th>
                <th>Email</th>
                <th>Joined</th>
                <th>Bookings</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((u) => (
                <tr key={u.id}>
                  <td>
                    <div className="table-user">
                      <div className={`avatar avatar-sm color-${["blue", "green", "violet", "orange"][u.id.length % 4]}`}>
                        {u.name.slice(0, 1)}
                      </div>
                      <div>
                        <strong>{u.name}</strong>
                        <span className="muted-text">{u.location}</span>
                      </div>
                    </div>
                  </td>
                  <td className="mono">{u.id}</td>
                  <td><span className="role-tag">{u.type}</span></td>
                  <td>{u.email}</td>
                  <td>{u.joined}</td>
                  <td>{u.bookings}</td>
                  <td><StatusBadge status={u.type === "admin" ? "verified" : "active"} /></td>
                  <td>
                    <button className="table-link" onClick={() => setInspect(u)}>
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="admin-grid">
        <div className="panel admin-table-panel">
          <div className="section-head">
            <div>
              <span className="eyebrow">PROVIDER MANAGEMENT</span>
              <h3>Verification queue</h3>
            </div>
          </div>

          <div className="verify-list">
            {providerList.map((p) => (
              <div className="verify-row" key={p.id}>
                <div className={`avatar color-${p.color}`}>{p.avatar}</div>
                <div className="verify-info">
                  <strong>
                    {p.name}
                    {p.verified && <BadgeCheck size={15} className="ok" />}
                  </strong>
                  <span>{p.role} · {p.cooperative} · {p.jobs.toLocaleString("en-IN")} jobs</span>
                  <span className="muted-text">Rating {p.rating.toFixed(1)} ★ · Joined {p.memberSince}</span>
                </div>
                <div className="btn-row">
                  {p.verified ? (
                    <StatusBadge status="verified" />
                  ) : (
                    <>
                      <button className="btn btn-success-outline btn-sm" onClick={() => verifyProvider(p.id)}>
                        <CheckCircle2 size={15} /> Approve
                      </button>
                      <button className="btn btn-danger-ghost btn-sm">
                        <XCircle size={15} /> Reject
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="panel admin-table-panel">
          <div className="section-head">
            <div>
              <span className="eyebrow">SERVICES</span>
              <h3>Live catalogue</h3>
            </div>
            <Link to="/offer-service" className="link-muted"><Wrench size={14} /> Add service</Link>
          </div>

          <div className="service-admin-list">
            {services.map((s) => (
              <div className="service-admin-row" key={s.id}>
                <div className="service-admin-icon"><Wrench size={15} /></div>
                <div className="service-admin-info">
                  <strong>{s.name}</strong>
                  <span>{s.categoryLabel} · {s.duration} · {s.booked.toLocaleString("en-IN")} booked</span>
                </div>
                <div className="btn-row">
                  <StatusBadge status={s.verified ? "verified" : "unverified"} />
                  <button className="icon-btn" aria-label="More actions">
                    <MoreHorizontal size={17} />
                  </button>
                </div>
              </div>
            ))}
          </div>
          <Link to="/services" className="btn btn-outline btn-block btn-sm">
            View public catalogue <ChevronRight size={14} />
          </Link>
        </div>
      </div>

      <div className="panel admin-table-panel">
        <div className="section-head">
          <div>
            <span className="eyebrow">ALL BOOKINGS</span>
            <h3>Recent booking activity</h3>
          </div>
          <Link to="/bookings" className="link-muted">Open bookings</Link>
        </div>
        <BookingTable bookings={bookings.slice(0, 5)} serviceMap={serviceMap} providerMap={providerMap} showCustomer />
      </div>

      <Modal
        open={!!inspect}
        onClose={() => setInspect(null)}
        title="User details"
        footer={
          inspect ? (
            <div className="modal-actions">
              <button className="btn btn-outline" onClick={() => setInspect(null)}>Close</button>
              <button
                className="btn btn-primary"
                onClick={() => { setInspect(null); token(inspect.type === "provider" ? "User flagged for review." : "Message sent to user (demo).", "success"); }}
              >
                {inspect.type === "provider" ? "Flag for Review" : "Send Message"}
              </button>
            </div>
          ) : null
        }
      >
        {inspect && (
          <div className="user-inspect">
            <div className="ui-head">
              <div className={`avatar avatar-xl color-${["blue", "green", "violet", "orange"][inspect.id.length % 4]}`}>
                {inspect.name.slice(0, 1)}
              </div>
              <div>
                <h3>{inspect.name}</h3>
                <span className="role-tag">{inspect.type}</span>
              </div>
            </div>
            <div className="ui-rows">
              <div><span>User ID</span><strong className="mono">{inspect.id}</strong></div>
              <div><span>Email</span><strong>{inspect.email}</strong></div>
              <div><span>Phone</span><strong><Phone size={13} /> {inspect.phone}</strong></div>
              <div><span>Joined</span><strong>{inspect.joined}</strong></div>
              <div><span>Bookings</span><strong>{inspect.bookings}</strong></div>
              <div><span>Location</span><strong><Building2 size={13} /> {inspect.location}</strong></div>
            </div>
          </div>
        )}
      </Modal>
    </AppLayout>
  );
}

export default AdminDashboard;