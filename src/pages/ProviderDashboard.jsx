import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Wallet, Star, BriefcaseBusiness, TrendingUp, CheckCircle2, XCircle,
  MapPin, Clock, IndianRupee, ArrowRight, Bell, CalendarDays, Award,
} from "lucide-react";
import AppLayout from "../components/AppLayout";
import StatCard from "../components/StatCard";
import StatusBadge from "../components/StatusBadge";
import BackButton from "../components/BackButton";
import Modal from "../components/Modal";
import { providerEarnings, providers, formatINR } from "../data";
import { useToast } from "../useToast";
import { useData } from "../context/useData";

function ProviderDashboard() {
  const [note, setNote] = useState(null);
  const toast = useToast();
  const me = providers[0];
  const { requests, respondRequest } = useData();

  const pendingCount = requests.filter((r) => r.status === "pending").length;
  const accepted = requests.filter((r) => r.status === "accepted");

  function respond(id, status) {
    respondRequest(id, status);
    toast(status === "accepted" ? "Request accepted. Customer notified." : "Request declined politely.", status === "accepted" ? "success" : "info");
  }

  return (
    <AppLayout
      role="provider"
      title="Provider Dashboard"
      subtitle={`Welcome back, ${me.name.split(" ")[0]}!`}
    >
      <BackButton />
      <div className="provider-hero">
        <div className="provider-hero-info">
          <div className={`avatar avatar-xl color-${me.color}`}>{me.avatar}</div>
          <div>
            <span className="eyebrow light">VERIFIED PROVIDER</span>
            <h2>{me.name}</h2>
            <p>{me.role} · {me.cooperative} · {me.location}</p>
            <div className="provider-hero-badges">
              <StatusBadge status="verified" />
              <StatusBadge status="available" />
            </div>
          </div>
        </div>
        <div className="provider-hero-meta">
          <div>
            <Star size={15} fill="currentColor" />
            <strong>{me.rating.toFixed(1)}</strong>
            <span>{me.reviews} reviews</span>
          </div>
          <div>
            <BriefcaseBusiness size={15} />
            <strong>{me.jobs.toLocaleString("en-IN")}</strong>
            <span>jobs done</span>
          </div>
          <Link to="/offer-service" className="btn btn-white btn-sm">
            Manage Listings
          </Link>
        </div>
      </div>

      <div className="stat-grid">
        <StatCard
          title="This Month's Earnings"
          value={providerEarnings.thisMonth}
          change={providerEarnings.trend}
          type="green"
          icon={<Wallet size={20} />}
        />
        <StatCard
          title="Total Earnings"
          value={providerEarnings.total}
          change="+₹7,200 this quarter"
          type="blue"
          icon={<IndianRupee size={20} />}
        />
        <StatCard
          title="Pending Requests"
          value={pendingCount}
          change="Respond within 2h"
          type="orange"
          icon={<Bell size={20} />}
        />
        <StatCard
          title="Active Jobs"
          value={providerEarnings.activeJobs}
          change="4 this week"
          type="violet"
          icon={<CalendarDays size={20} />}
        />
      </div>

      <div className="dash-grid">
        <div className="dash-main">
          <div className="section-head">
            <div>
              <span className="eyebrow">SERVICE REQUESTS</span>
              <h3>People near you need help</h3>
            </div>
            <span className="muted-text">{pendingCount} awaiting response</span>
          </div>

          <div className="request-list">
            {requests.map((r) => {
              const svc = r.service;
              return (
                <div className="request-card" key={r.id}>
                  <div className="request-icon blue">
                    {r.service === "Plumbing Repair" ? "🔧" : r.service === "AC Servicing & Repair" ? "❄️" : "✨"}
                  </div>
                  <div className="request-info">
                    <div className="request-top">
                      <strong>{svc}</strong>
                      <StatusBadge status={r.status} />
                    </div>
                    <span>{r.customer} · {r.location}</span>
                    <span className="muted-text">
                      <Clock size={13} /> {r.date} · {r.time} · Earn {formatINR(r.price)} (~92% share)
                    </span>
                  </div>
                  {r.status === "pending" ? (
                    <div className="btn-row">
                      <button className="btn btn-primary btn-sm" onClick={() => respond(r.id, "accepted")}>
                        <CheckCircle2 size={15} /> Accept
                      </button>
                      <button className="btn btn-danger-ghost btn-sm" onClick={() => respond(r.id, "declined")}>
                        <XCircle size={15} /> Decline
                      </button>
                    </div>
                  ) : (
                    <StatusBadge status={r.status === "accepted" ? "confirmed" : "cancelled"} />
                  )}
                </div>
              );
            })}

            {requests.every((r) => r.status !== "pending") && (
              <div className="empty-state small">
                <CheckCircle2 size={28} />
                <h3>All caught up!</h3>
                <p>New requests will appear here instantly.</p>
              </div>
            )}
          </div>

          <div className="section-head">
            <div>
              <span className="eyebrow">EARNINGS TREND</span>
              <h3>Last 4 weeks</h3>
            </div>
          </div>

          <div className="chart-card">
            <div className="chart-bars">
              {providerEarnings.recent.map((w, i) => (
                <div className="chart-col" key={w.label}>
                  <span className="chart-value">{w.amount}</span>
                  <div
                    className={`chart-bar color-${w.color}`}
                    style={{ height: `${[88, 96, 72, 64][i]}%` }}
                  />
                  <span className="chart-label">{w.label.replace("Week of ", "")}</span>
                </div>
              ))}
            </div>
            <div className="chart-total">
              <Award size={18} />
              <strong>₹21,300</strong>
              <span>this month · <span className="ok-text">+12% growth</span></span>
            </div>
          </div>

          <div className="section-head">
            <div>
              <span className="eyebrow">RECENT REVIEWS</span>
              <h3>What customers say about you</h3>
            </div>
          </div>

          <div className="reviews-grid">
            {providerEarnings.reviews.map((r, i) => (
              <div className="review-card" key={i}>
                <div className="review-stars">
                  {Array.from({ length: 5 }).map((_, j) => (
                    <Star key={j} size={15} fill={j < r.rating ? "currentColor" : "none"} />
                  ))}
                </div>
                <p>"{r.text}"</p>
                <div className="review-foot">
                  <div className="avatar avatar-sm color-blue">{r.from.slice(0, 1)}</div>
                  <strong>{r.from}</strong>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="dash-side">
          <div className="panel">
            <div className="section-head">
              <h3>Active / accepted jobs</h3>
            </div>
            {accepted.length === 0 ? (
              <div className="side-empty">
                <BriefcaseBusiness size={26} />
                <p>Accept a request to see it here.</p>
              </div>
            ) : (
              <div className="dash-booking-list">
                {accepted.map((r) => (
                  <button
                    className="dash-booking"
                    key={r.id}
                    onClick={() => setNote(r)}
                  >
                    <div className="dash-booking-icon green"><CheckCircle2 size={16} /></div>
                    <div className="dash-booking-info">
                      <strong>{r.service}</strong>
                      <span>{r.date} · {r.time}</span>
                    </div>
                    <ArrowRight size={14} className="muted-text" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="panel">
            <div className="section-head">
              <h3>How you're doing</h3>
              <TrendingUp size={18} className="ok" />
            </div>
            <ul className="score-list">
              <li><span>On-time arrival</span><strong>96%</strong></li>
              <li><span>Completion rate</span><strong>99%</strong></li>
              <li><span>First response</span><strong>1.8h</strong></li>
              <li><span>Repeat customers</span><strong>41%</strong></li>
            </ul>
          </div>

          <div className="panel coop-banner">
            <span className="eyebrow">CO-OP NUDGE</span>
            <h3>New upskilling camp</h3>
            <p>
              Free 3-day advanced cleaning &amp; appliance-safety training at Kathari
              Co-op Hall this weekend. Certificates boost your ranking.
            </p>
            <button className="btn btn-primary btn-sm" onClick={() => toast("Registered for the training camp (demo)", "success")}>
              Register Free
            </button>
            <MapPin size={13} className="muted-text inline" /> Kathari Co-op Hall, Koramangala
          </div>
        </div>
      </div>

      <Modal
        open={!!note}
        onClose={() => setNote(null)}
        title="Accepted job details"
        footer={
          <button className="btn btn-primary" onClick={() => { setNote(null); toast("Job status updated (demo)", "success"); }}>
            Update Status
          </button>
        }
      >
        {note && (
          <div className="job-note">
            <h3>{note.service}</h3>
            <p>{note.customer} · {note.location}</p>
            <p className="muted-text"><Clock size={14} /> {note.date} at {note.time}</p>
            <div className="payout-box">
              <span>Your payout (92%)</span>
              <strong>{formatINR(Math.round(note.price * 0.92))}</strong>
            </div>
            <p className="muted-text">Remember: complete the Safety Checklist before you arrive.</p>
          </div>
        )}
      </Modal>
    </AppLayout>
  );
}

export default ProviderDashboard;