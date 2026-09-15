import { useMemo, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import {
  Search, Star, MapPin, BadgeCheck, ShieldCheck, Users, Languages,
  BriefcaseBusiness, CalendarCheck, Award, CheckCircle2,
} from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Modal from "../components/Modal";
import StatusBadge from "../components/StatusBadge";
import BackButton from "../components/BackButton";
import { providers, services, formatINR } from "../data";
import { useToast } from "../useToast";
import { useAuth } from "../context/useAuth";

function Providers() {
  const [params, setParams] = useSearchParams();
  const [query, setQuery] = useState("");
  const [cat, setCat] = useState("all");
  const [onlyVerified, setOnlyVerified] = useState(false);
  const [selected, setSelected] = useState(null);
  const toast = useToast();
  const { user } = useAuth();

  const focusId = params.get("id");

  const categories = useMemo(() => [...new Map(providers.map((p) => [p.category, p])).values()], []);

  const results = useMemo(() => {
    let list = [...providers];
    if (cat !== "all") list = list.filter((p) => p.category === cat);
    if (onlyVerified) list = list.filter((p) => p.verified);
    if (query) {
      const q = query.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.role.toLowerCase().includes(q) ||
          p.about.toLowerCase().includes(q) ||
          p.skills.some((s) => s.toLowerCase().includes(q))
      );
    }
    list.sort((a, b) => b.rating - a.rating);
    return list;
  }, [cat, onlyVerified, query]);

  const focus = providers.find((p) => p.id === Number(focusId));
  const effectiveSelected = selected || focus || null;

  function bookProvider(p) {
    if (!user) {
      toast("Please login to book this provider.", "info");
      return;
    }
    const svc = services.find((s) => s.category === p.category);
    toast(`Opening booking for ${p.name}…`, "info");
    if (svc) setSelected(p);
  }

  return (
    <div className="page-wrap">
      <Navbar />

      <div className="page-hero slim">
        <div className="page-inner">
          <BackButton className="hero" />
          <span className="eyebrow">PROVIDERS</span>
          <h1>Trusted hands from your neighbourhood</h1>
          <p>
            Every provider is a member of a verified cooperative, background-checked,
            and rated by real customers like you.
          </p>

          <form
            className="page-search"
            onSubmit={(e) => { e.preventDefault(); setQuery(query.trim()); }}
          >
            <Search size={20} />
            <input
              placeholder="Search providers by name or skill..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              aria-label="Search providers"
            />
            <button className="btn btn-primary" type="submit">
              Search
            </button>
          </form>
        </div>
      </div>

      <div className="page-inner">
        <div className="category-tabs">
          <button className={cat === "all" ? "cat-tab active" : "cat-tab"} onClick={() => setCat("all")}>
            All Providers
          </button>
          {categories.map((c) => (
            <button
              className={cat === c.category ? "cat-tab active" : "cat-tab"}
              key={c.category}
              onClick={() => setCat(c.category)}
            >
              {c.role.split(" ")[0]}
            </button>
          ))}
        </div>

        <div className="providers-toolbar">
          <p>
            <strong>{results.length}</strong> provider{results.length !== 1 && "s"} found
          </p>
          <label className="radio-row check">
            <input
              type="checkbox"
              checked={onlyVerified}
              onChange={(e) => setOnlyVerified(e.target.checked)}
            />
            <span>Verified only</span>
          </label>
        </div>

        {results.length === 0 ? (
          <div className="empty-state">
            <Search size={30} />
            <h3>No providers found</h3>
            <p>Try a different name, skill or category.</p>
          </div>
        ) : (
          <div className="provider-grid">
            {results.map((p) => (
              <div className="provider-card" key={p.id}>
                <div className="provider-card-head">
                  <div className={`avatar avatar-lg color-${p.color}`}>{p.avatar}</div>
                  <div className="provider-card-id">
                    <h3>
                      {p.name}
                      {p.verified && <BadgeCheck size={18} className="ok" />}
                    </h3>
                    <p>{p.role}</p>
                  </div>
                  <div className="provider-card-rating">
                    <Star size={15} fill="currentColor" />
                    <strong>{p.rating.toFixed(1)}</strong>
                  </div>
                </div>

                <p className="provider-card-about">{p.about}</p>

                <div className="provider-card-skills">
                  {p.skills.map((s) => (
                    <span className="chip" key={s}>{s}</span>
                  ))}
                </div>

                <div className="provider-card-meta">
                  <span><MapPin size={14} /> {p.location}</span>
                  <span><Users size={14} /> {p.cooperative}</span>
                </div>

                <div className="provider-card-foot">
                  <div className="service-price">
                    <strong>from {formatINR(p.price)}</strong>
                    <span>{p.jobs.toLocaleString("en-IN")} jobs · {p.experience}</span>
                  </div>
                  <div className="btn-row">
                    <button className="btn btn-primary btn-sm" onClick={() => bookProvider(p)}>
                      Book
                    </button>
                    <button className="btn btn-outline btn-sm" onClick={() => setSelected(p)}>
                      View Profile
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Footer />

      <Modal
        open={!!effectiveSelected}
        onClose={() => { setSelected(null); setParams({}); }}
        title="Provider Profile"
        size="lg"
        footer={
          effectiveSelected ? (
            <div className="modal-actions">
              <button className="btn btn-outline" onClick={() => setSelected(null)}>
                Close
              </button>
              <Link
                to={`/services?cat=${effectiveSelected.category}`}
                className="btn btn-primary"
                onClick={() => toast(`Browse ${effectiveSelected.role} services`, "info")}
              >
                <BriefcaseBusiness size={16} /> View Services
              </Link>
            </div>
          ) : null
        }
      >
        {effectiveSelected && (
          <div className="profile-modal">
            <div className="profile-hero">
              <div className={`avatar avatar-xl color-${effectiveSelected.color}`}>
                {effectiveSelected.avatar}
              </div>
              <div className="profile-hero-info">
                <h2>
                  {effectiveSelected.name}
                  {effectiveSelected.verified && <BadgeCheck size={20} className="ok" />}
                </h2>
                <p>{effectiveSelected.role}</p>
                <p className="muted-text">
                  <MapPin size={13} /> {effectiveSelected.location} · Member since {effectiveSelected.memberSince}
                </p>
                <div className="profile-badges">
                  <StatusBadge status={effectiveSelected.verified ? "verified" : "unverified"} />
                  <StatusBadge status={effectiveSelected.available ? "available" : "unavailable"} />
                </div>
              </div>
              <div className="profile-score">
                <div className="score-ring">
                  <strong>{effectiveSelected.rating.toFixed(1)}</strong>
                  <small>rating</small>
                </div>
                <span>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} size={13} fill={i < Math.round(effectiveSelected.rating) ? "currentColor" : "none"} />
                  ))}
                </span>
                <small>{effectiveSelected.reviews} reviews</small>
              </div>
            </div>

            <div className="profile-stats">
              <div>
                <BriefcaseBusiness size={18} />
                <strong>{effectiveSelected.jobs.toLocaleString("en-IN")}</strong>
                <span>Jobs completed</span>
              </div>
              <div>
                <CalendarCheck size={18} />
                <strong>{effectiveSelected.experience}</strong>
                <span>Experience</span>
              </div>
              <div>
                <Award size={18} />
                <strong>Co-op</strong>
                <span>{effectiveSelected.cooperative}</span>
              </div>
            </div>

            <p className="profile-about">{effectiveSelected.about}</p>

            <div className="profile-sections">
              <div>
                <h4><BriefcaseBusiness size={16} /> Skills</h4>
                <div className="chip-wrap">
                  {effectiveSelected.skills.map((s) => (
                    <span className="chip" key={s}>{s}</span>
                  ))}
                </div>
              </div>
              <div>
                <h4><Languages size={16} /> Languages</h4>
                <div className="chip-wrap">
                  {effectiveSelected.languages.map((l) => (
                    <span className="chip" key={l}>{l}</span>
                  ))}
                </div>
              </div>
            </div>

            <div className="verification-box">
              <ShieldCheck size={18} />
              <div>
                <strong>Identity &amp; skill verification</strong>
                <p>
                  Aadhaar-verified, skill-certified and endorsed by{" "}
                  {effectiveSelected.cooperative}. Average response time: 2 hours.
                </p>
                <ul className="check-list compact">
                  <li><CheckCircle2 size={14} className="ok" /> Police verification cleared</li>
                  <li><CheckCircle2 size={14} className="ok" /> Cooperative onboarding complete</li>
                  <li><CheckCircle2 size={14} className="ok" /> Training refresher 2026</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

export default Providers;