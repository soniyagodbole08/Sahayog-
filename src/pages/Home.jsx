import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowRight, ShieldCheck, Users, CalendarCheck, Star, Sparkles,
  Search, CalendarDays, BadgeCheck, Handshake, HeartHandshake,
  IndianRupee, Wallet, TrendingUp, Building2, Store,
} from "lucide-react";
import { services, providers, reviews, formatINR } from "../data";
import { categoryIcon } from "../iconMap";
import ServiceCard from "../components/ServiceCard";

const impactStats = [
  { icon: Users, value: "500+", label: "Local Service Providers" },
  { icon: CalendarCheck, value: "1,200+", label: "Services Completed" },
  { icon: ShieldCheck, value: "98%", label: "Customer Satisfaction" },
  { icon: Handshake, value: "25+", label: "Active Cooperatives" },
];

const steps = [
  {
    icon: Search,
    title: "Search & Discover",
    text: "Browse verified local providers and services near you with transparent pricing.",
  },
  {
    icon: CalendarDays,
    title: "Book in Minutes",
    text: "Pick a slot that suits you and confirm your booking with a single tap.",
  },
  {
    icon: BadgeCheck,
    title: "Get It Done",
    text: "A trained, cooperative-backed professional arrives and completes the job.",
  },
  {
    icon: HeartHandshake,
    title: "Grow Together",
    text: "Your booking supports fair wages and strengthens your neighbourhood cooperative.",
  },
];

const coopBenefits = [
  {
    icon: Wallet,
    title: "Fair Earnings",
    color: "blue",
    text: "Providers keep up to 92% of every booking. No commission-hungry middlemen.",
  },
  {
    icon: TrendingUp,
    title: "Skill Development",
    color: "green",
    text: "Free upskilling camps, certifications and business loans via partner cooperatives.",
  },
  {
    icon: Building2,
    title: "Community Ownership",
    color: "violet",
    text: "Each cooperative co-owns the platform and shares collective bonuses.",
  },
  {
    icon: Store,
    title: "Local First",
    color: "orange",
    text: "Money stays in your neighbourhood, building resilient local economies.",
  },
];

function Home() {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  function handleSearch(e) {
    e.preventDefault();
    navigate(`/services?q=${encodeURIComponent(query.trim())}`);
  }

  const topServices = services.filter((s) => s.popular);
  const topProviders = providers.slice(0, 3);

  return (
    <div className="home-page">
      <section className="hero-section">
        <div className="hero-grid">
          <div className="hero-content">
            <span className="hero-badge">
              <Sparkles size={15} /> Empowering Local Communities
            </span>

            <h1>
              Skilled Hands.
              <br />
              <span className="grad-text">Stronger Communities.</span>
            </h1>

            <p className="hero-lead">
              Book trusted household services from cooperative-backed local
              providers — and help your neighbourhood grow with every job.
            </p>

            <form className="hero-search" onSubmit={handleSearch}>
              <Search size={20} />
              <input
                placeholder="What service do you need? Try 'cleaning' or 'plumbing'"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                aria-label="Search services"
              />
              <button className="btn btn-primary" type="submit">
                Search
              </button>
            </form>

            <div className="hero-buttons">
              <Link to="/services" className="btn btn-primary">
                Explore Services <ArrowRight size={18} />
              </Link>
              <Link to="/offer-service" className="btn btn-outline">
                Offer Your Skills
              </Link>
            </div>

            <div className="hero-trust">
              <span><ShieldCheck size={14} /> Verified providers</span>
              <span><Star size={14} /> 4.7+ average rating</span>
              <span><Users size={14} /> 15,000+ happy homes</span>
            </div>
          </div>

          <div className="hero-visual">
            <div className="hero-card-main">
              <div className="hero-card-head">
                <div className="avatar avatar-lg color-violet">RK</div>
                <div>
                  <h3>Rekha Kumari</h3>
                  <p><BadgeCheck size={14} className="ok" /> Verified Cleaner · Nari Shakti Co-op</p>
                </div>
                <span className="hero-live"><span className="pulse" /> Online now</span>
              </div>

              <div className="hero-card-body">
                <div className="hero-job-row">
                  <div className="hero-job-icon"><Sparkles size={18} /></div>
                  <div className="hero-job-info">
                    <span>Full Home Cleaning</span>
                    <small>Koramangala, Bengaluru · Today</small>
                  </div>
                  <strong>₹2,499</strong>
                </div>
                <div className="hero-job-row">
                  <div className="hero-job-icon green"><CalendarCheck size={18} /></div>
                  <div className="hero-job-info">
                    <span>Completed 1,450 jobs</span>
                    <small>98% satisfaction score</small>
                  </div>
                  <Star size={18} fill="currentColor" className="star" />
                </div>
              </div>

              <div className="hero-card-foot">
                <div className="hero-stats">
                  <div>
                    <strong>500+</strong>
                    <span>Providers</span>
                  </div>
                  <div>
                    <strong>1.2K+</strong>
                    <span>Services</span>
                  </div>
                  <div>
                    <strong>25+</strong>
                    <span>Co-ops</span>
                  </div>
                </div>
                <Link to="/login" className="btn btn-primary btn-sm">
                  Book Now <ArrowRight size={15} />
                </Link>
              </div>
            </div>

            <div className="hero-float-card">
              <IndianRupee size={16} />
              <div>
                <span>Providers earn</span>
                <strong>92% of every job</strong>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="impact-section">
        <div className="section-heading">
          <span className="eyebrow">OUR IMPACT</span>
          <h2>Making everyday services better</h2>
          <p>One booking, one cooperative, one neighbourhood at a time.</p>
        </div>

        <div className="impact-grid">
          {impactStats.map((s) => {
            const Icon = s.icon;
            return (
              <div className="impact-card" key={s.label}>
                <div className="impact-icon"><Icon size={26} /></div>
                <h3>{s.value}</h3>
                <p>{s.label}</p>
              </div>
            );
          })}
        </div>
      </section>

      <section className="services-section">
        <div className="section-heading split">
          <div>
            <span className="eyebrow">POPULAR SERVICES</span>
            <h2>What do you need help with?</h2>
          </div>
          <Link to="/services" className="btn btn-outline">
            View all services <ArrowRight size={16} />
          </Link>
        </div>

        <div className="service-grid">
          {topServices.map((s) => (
            <ServiceCard key={s.id} service={s} />
          ))}
        </div>

        <div className="category-strip">
          {services.slice(0, 8).map((s) => {
            const CatIcon = categoryIcon(s.category);
            return (
              <Link to={`/services?cat=${s.category}`} className="category-chip" key={s.id}>
                <CatIcon size={17} />
                {s.categoryLabel}
              </Link>
            );
          })}
        </div>
      </section>

      <section className="how-section">
        <div className="section-heading">
          <span className="eyebrow">HOW IT WORKS</span>
          <h2>Book in four simple steps</h2>
        </div>

        <div className="steps-grid">
          {steps.map((s, i) => {
            const Icon = s.icon;
            return (
              <div className="step-card" key={s.title}>
                <div className="step-num">{i + 1}</div>
                <div className="step-icon"><Icon size={24} /></div>
                <h3>{s.title}</h3>
                <p>{s.text}</p>
              </div>
            );
          })}
        </div>
      </section>

      <section className="coop-section">
        <div className="section-heading">
          <span className="eyebrow">COOPERATIVE BENEFITS</span>
          <h2>Why Sahayog is different</h2>
          <p>We're not just a marketplace — we're a platform owned by the people doing the work.</p>
        </div>

        <div className="coop-grid">
          {coopBenefits.map((b) => {
            const Icon = b.icon;
            return (
              <div className="coop-card" key={b.title}>
                <div className={`coop-icon ${b.color}`}><Icon size={24} /></div>
                <h3>{b.title}</h3>
                <p>{b.text}</p>
              </div>
            );
          })}
        </div>
      </section>

      <section className="providers-section">
        <div className="section-heading split">
          <div>
            <span className="eyebrow">TOP PROVIDERS</span>
            <h2>Meet your neighbourhood stars</h2>
          </div>
          <Link to="/providers" className="btn btn-outline">
            All providers <ArrowRight size={16} />
          </Link>
        </div>

        <div className="provider-grid">
          {topProviders.map((p) => (
            <div className="provider-card" key={p.id}>
              <div className="provider-card-head">
                <div className={`avatar avatar-lg color-${p.color}`}>{p.avatar}</div>
                <div className="provider-card-id">
                  <h3>{p.name} {p.verified && <BadgeCheck size={17} className="ok" />}</h3>
                  <p>{p.role}</p>
                </div>
                <div className="provider-card-rating">
                  <Star size={15} fill="currentColor" />
                  <strong>{p.rating.toFixed(1)}</strong>
                </div>
              </div>
              <p className="provider-card-about">{p.about}</p>
              <div className="provider-card-foot">
                <div className="service-price">
                  <strong>from {formatINR(p.price)}</strong>
                  <span>{p.jobs.toLocaleString("en-IN")} jobs</span>
                </div>
                <Link to={`/providers?id=${p.id}`} className="btn btn-outline btn-sm">
                  View Profile
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="reviews-section">
        <div className="section-heading">
          <span className="eyebrow">LIVE REVIEWS</span>
          <h2>What your neighbours say</h2>
        </div>

        <div className="reviews-grid">
          {reviews.slice(0, 3).map((r) => (
            <div className="review-card" key={r.id}>
              <div className="review-stars">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={15} fill={i < r.rating ? "currentColor" : "none"} />
                ))}
              </div>
              <p>"{r.text}"</p>
              <div className="review-foot">
                <div className={`avatar avatar-sm color-${["blue", "green", "violet"][r.id % 3]}`}>
                  {r.name.slice(0, 1)}
                </div>
                <div>
                  <strong>{r.name}</strong>
                  <span>{r.service}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="cta-section">
        <div className="cta-box">
          <div>
            <h2>Have a skill to share?</h2>
            <p>
              Join our cooperative network and turn your skills into meaningful,
              fair earning opportunities.
            </p>
          </div>
          <Link to="/offer-service" className="btn btn-white">
            Become a Provider <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </div>
  );
}

export default Home;