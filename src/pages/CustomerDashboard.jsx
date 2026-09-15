import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  CalendarCheck, Clock, Star, Wallet, IndianRupee, ArrowRight, Search,
  Sparkles, BadgeCheck, MapPin, CheckCircle2,
} from "lucide-react";
import AppLayout from "../components/AppLayout";
import StatCard from "../components/StatCard";
import StatusBadge from "../components/StatusBadge";
import ServiceCard from "../components/ServiceCard";
import ProviderCard from "../components/ProviderCard";
import BackButton from "../components/BackButton";
import { services, providers, formatINR } from "../data";
import { useAuth } from "../context/useAuth";
import { useData } from "../context/useData";

function CustomerDashboard() {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  const { user } = useAuth();
  const { bookings } = useData();

  const myBookings = bookings.filter((b) => b.customer === (user?.name || "Ananya Sharma"));
  const latestBooking = myBookings[0];
  const completed = myBookings.filter((b) => b.status === "completed").length;
  const recommended = services.slice(0, 3);
  const topProviders = providers.slice(0, 2);

  function submitSearch(e) {
    e.preventDefault();
    navigate(`/services?q=${encodeURIComponent(query.trim())}`);
  }

  const firstName = user?.name?.split(" ")[0] || "ananya";
  const latestSvc = latestBooking ? services.find((s) => s.id === latestBooking.serviceId) : null;
  const latestProvider = latestBooking ? providers.find((p) => p.id === latestBooking.providerId) : null;

  return (
    <AppLayout
      role="customer"
      title="Customer Dashboard"
      subtitle={`Good to see you, ${user?.name?.split(" ")[0]}! How can we help today?`}
    >
      <BackButton />
      <div className="welcome-banner">
        <div className="welcome-text">
          <span className="eyebrow light">HELLO, {firstName.toUpperCase()}</span>
          <h2>Book a trusted service in minutes</h2>
          <p>
            You have <strong>2 active bookings</strong> and {completed} completed
            in the last 90 days.
          </p>

          <form className="dash-search" onSubmit={submitSearch}>
            <Search size={19} />
            <input
              placeholder="Search for cleaning, plumbing, cooking..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              aria-label="Search services"
            />
            <button type="submit" className="btn btn-primary">
              Search
            </button>
          </form>

          <div className="welcome-quick">
            <Link to="/services" className="btn btn-white btn-sm">
              Browse Services
            </Link>
            <Link to="/bookings" className="btn btn-ghost-white btn-sm">
              My Bookings
            </Link>
          </div>
        </div>

        <div className="welcome-card">
          <span className="eyebrow light">UPCOMING</span>
          <h3>{latestBooking && latestSvc ? latestSvc.name : "No upcoming jobs"}</h3>
          <p>
            <CalendarCheck size={15} /> {latestBooking?.date} · {latestBooking?.time}
          </p>
          <p>
            <MapPin size={15} /> {latestBooking?.address}
          </p>
          <div className="welcome-progress">
            <span style={{ width: "34%" }} />
          </div>
          <div className="welcome-card-foot">
            <StatusBadge status={latestBooking?.status || "pending"} />
            <Link to={`/bookings/${latestBooking?.id || ""}`} className="btn btn-white btn-sm">
              View <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </div>

      <div className="stat-grid">
        <StatCard
          title="Active Bookings"
          value={myBookings.filter((b) => b.status === "confirmed" || b.status === "pending").length}
          change="+1 this week"
          type="blue"
          icon={<CalendarCheck size={20} />}
        />
        <StatCard
          title="Total Spend"
          value={formatINR(myBookings.reduce((s, b) => s + b.price, 0))}
          change="+8%"
          type="green"
          icon={<Wallet size={20} />}
        />
        <StatCard
          title="Completed Services"
          value={completed}
          change="98% satisfaction"
          type="violet"
          icon={<CheckCircle2 size={20} />}
        />
        <StatCard
          title="Co-op Dividends Earned"
          value={formatINR(1240)}
          change="+₹180 this month"
          type="orange"
          icon={<IndianRupee size={20} />}
        />
      </div>

      <div className="dash-grid">
        <div className="dash-main">
          <div className="section-head">
            <div>
              <span className="eyebrow">RECOMMENDED FOR YOU</span>
              <h3>Services people nearby book often</h3>
            </div>
            <Link to="/services" className="link-muted">
              See all <ArrowRight size={15} />
            </Link>
          </div>

          <div className="service-grid">
            {recommended.map((s) => (
              <ServiceCard key={s.id} service={s} onBook={(svc) => navigate(`/services/${svc.id}`)} />
            ))}
          </div>

          <div className="section-head">
            <div>
              <span className="eyebrow">TRENDING PROVIDERS</span>
              <h3>High-rated cooperative workers</h3>
            </div>
            <Link to="/providers" className="link-muted">
              See all <ArrowRight size={15} />
            </Link>
          </div>

          <div className="provider-grid">
            {topProviders.map((p) => (
              <ProviderCard key={p.id} provider={p} />
            ))}
          </div>
        </div>

        <div className="dash-side">
          <div className="panel">
            <div className="section-head">
              <h3>Recent Bookings</h3>
              <Link to="/bookings" className="link-muted">All</Link>
            </div>

            <div className="dash-booking-list">
              {myBookings.slice(0, 4).map((b) => {
                const svc = services.find((s) => s.id === b.serviceId);
                return (
                  <Link to={`/bookings/${b.id}`} className="dash-booking" key={b.id}>
                    <div className={`dash-booking-icon color-${["blue", "green", "violet"][b.id.length % 3]}`}>
                      <Sparkles size={16} />
                    </div>
                    <div className="dash-booking-info">
                      <strong>{svc?.name}</strong>
                      <span>{b.date} · {b.time}</span>
                    </div>
                    <StatusBadge status={b.status} />
                  </Link>
                );
              })}
            </div>

            <Link to="/bookings" className="btn btn-outline btn-block btn-sm">
              View My Bookings
            </Link>
          </div>

          <div className="panel coop-banner">
            <span className="eyebrow">COMMUNITY</span>
            <h3>Your co-op earned ₹12,400 this quarter</h3>
            <p>
              As a Sahayog member you automatically share in collective bonuses
              from every service in your area.
            </p>
            <Link to="/community" className="btn btn-primary btn-sm">
              Explore Community <ArrowRight size={15} />
            </Link>
          </div>

          <div className="panel">
            <div className="section-head">
              <h3>Rating Snapshot</h3>
            </div>
            <div className="rating-snapshot">
              <div className="big-rating">
                <strong>4.8</strong>
                <span className="stars">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} size={16} fill="currentColor" />
                  ))}
                </span>
                <small>from 86 reviews</small>
              </div>
              <div className="rating-bars-col">
                {[
                  { star: "5", pct: 72 },
                  { star: "4", pct: 18 },
                  { star: "3", pct: 7 },
                  { star: "2", pct: 2 },
                  { star: "1", pct: 1 },
                ].map((r) => (
                  <div className="rate-row" key={r.star}>
                    <span>{r.star}★</span>
                    <div className="rate-track">
                      <span style={{ width: `${r.pct}%` }} />
                    </div>
                    <small>{r.pct}%</small>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="panel">
            <div className="section-head">
              <h3>Upcoming Slot</h3>
              <BadgeCheck size={16} className="ok" />
            </div>
            {latestBooking ? (
              <div className="slot-box">
                <div className="slot-date">
                  <strong>{latestBooking.date.slice(8, 10)}</strong>
                  <span>{new Date(latestBooking.date).toLocaleString("en-IN", { month: "short" })}</span>
                </div>
                <div>
                  <strong>{latestSvc?.name || "No upcoming"}</strong>
                  <span><Clock size={13} /> {latestBooking.time} · {latestSvc?.duration || ""}</span>
                  <span>with {latestProvider?.name || "your provider"}</span>
                </div>
              </div>
            ) : (
              <p className="muted-text">No upcoming slots.</p>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

export default CustomerDashboard;