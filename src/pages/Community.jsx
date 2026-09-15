import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Users, MapPin, BadgeCheck, Handshake, Megaphone, Plus, TrendingUp,
  Building2, Sparkles, CheckCircle2, IndianRupee, ArrowRight,
} from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Modal from "../components/Modal";
import StatusBadge from "../components/StatusBadge";
import BackButton from "../components/BackButton";
import { communityGroups, communityRequests } from "../data";
import { useToast } from "../useToast";

const impactCards = [
  { icon: Users, value: "500+", label: "Cooperative members" },
  { icon: Building2, value: "25+", label: "Registered cooperatives" },
  { icon: TrendingUp, value: "₹42L", label: "Payouts to members" },
  { icon: IndianRupee, value: "98%", label: "Income stays local" },
];

function Community() {
  const [requests, setRequests] = useState(communityRequests);
  const [joined, setJoined] = useState([1]);
  const [showCreate, setShowCreate] = useState(false);
  const [showJoin, setShowJoin] = useState(null);
  const [created, setCreated] = useState(false);
  const toast = useToast();

  function joinGroup(id) {
    setJoined((j) => (j.includes(id) ? j : [...j, id]));
    const g = communityGroups.find((x) => x.id === id);
    setShowJoin(null);
    toast(`You joined ${g.name}! Co-op coordinator will reach out.`, "success");
  }

  function registerInterest(reqId) {
    setRequests((list) => list.map((r) => (r.id === reqId ? { ...r, status: "filled" } : r)));
    toast("Interest registered. The requester will contact you.", "success");
  }

  function createCoop(e) {
    e.preventDefault();
    setCreated(true);
  }

  return (
    <div className="page-wrap">
      <Navbar />

      <div className="page-hero slim">
        <div className="page-inner">
          <BackButton className="hero" />
          <span className="eyebrow">COOPERATIVE COMMUNITY</span>
          <h1>Strength lives in the collective</h1>
          <p>
            Sahayog is owned and energised by cooperatives of local workers.
            Join a group, share community jobs, and grow together.
          </p>
          <div className="hero-buttons">
            <button className="btn btn-primary" onClick={() => setShowCreate(true)}>
              <Plus size={17} /> Start a Cooperative
            </button>
            <Link to="/offer-service" className="btn btn-outline">
              Become a Provider
            </Link>
          </div>
        </div>
      </div>

      <div className="page-inner">
        <div className="impact-grid">
          {impactCards.map((c) => {
            const Icon = c.icon;
            return (
              <div className="impact-card" key={c.label}>
                <div className="impact-icon"><Icon size={24} /></div>
                <h3>{c.value}</h3>
                <p>{c.label}</p>
              </div>
            );
          })}
        </div>

        <div className="section-head">
          <div>
            <span className="eyebrow">COOPERATIVES</span>
            <h2>Your neighbourhood groups</h2>
          </div>
          <span className="muted-text">{communityGroups.length} active co-ops near Bengaluru</span>
        </div>

        <div className="coop-community-grid">
          {communityGroups.map((g) => (
            <div className="coop-community-card" key={g.id}>
              <div className="coop-community-head">
                <div className="coop-comm-icon">
                  <Handshake size={22} />
                </div>
                <div>
                  <h3>
                    {g.name}
                    {g.verified && <BadgeCheck size={16} className="ok" />}
                  </h3>
                  <p>{g.type} · <MapPin size={12} /> {g.city}</p>
                </div>
              </div>

              <p className="coop-community-about">{g.about}</p>

              <div className="coop-members">
                <div className="avatar-stack">
                  {g.membersList.map((m) => (
                    <span className={`avatar avatar-sm color-${["blue", "green", "violet", "orange"][g.id % 4]}`} key={m}>
                      {m.slice(0, 1)}
                    </span>
                  ))}
                </div>
                <strong>{g.members}+ members</strong>
              </div>

              <div className="coop-community-foot">
                <span className="chip">{g.type}</span>
                {joined.includes(g.id) ? (
                  <span className="joined-label">
                    <CheckCircle2 size={15} className="ok" /> Joined
                  </span>
                ) : (
                  <button className="btn btn-outline btn-sm" onClick={() => setShowJoin(g)}>
                    Join Group
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="community-req">
          <div className="section-head">
            <div>
              <span className="eyebrow">SHARED JOBS & REQUESTS</span>
              <h2>Community gig board</h2>
            </div>
            <span className="muted-text"><Megaphone size={14} /> Updated today</span>
          </div>

          <div className="request-list">
            {requests.map((r) => (
              <div className="request-card wide" key={r.id}>
                <div className="request-icon violet"><Sparkles size={17} /></div>
                <div className="request-info">
                  <div className="request-top">
                    <strong>{r.title}</strong>
                    <StatusBadge status={r.status} />
                  </div>
                  <span className="muted-text">
                    from {r.requester} · posted {r.posted} · for {r.group}
                  </span>
                  <span className="budget-chip">{r.budget}</span>
                </div>
                {r.status === "open" ? (
                  <button className="btn btn-primary btn-sm" onClick={() => registerInterest(r.id)}>
                    Register Interest
                  </button>
                ) : (
                  <span className="filled-label">Already filled by a member</span>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="cta-box alt">
          <div>
            <h2>Don't see a cooperative for your trade?</h2>
            <p>Start one with your community. We provide the toolkit, training and visibility.</p>
          </div>
          <button className="btn btn-white" onClick={() => setShowCreate(true)}>
            Start a Cooperative <ArrowRight size={18} />
          </button>
        </div>
      </div>

      <Footer />

      <Modal
        open={!!showJoin}
        onClose={() => setShowJoin(null)}
        title="Join this cooperative"
        footer={
          showJoin ? (
            <>
              <button className="btn btn-outline" onClick={() => setShowJoin(null)}>Cancel</button>
              <button className="btn btn-primary" onClick={() => joinGroup(showJoin.id)}>
                Confirm Join
              </button>
            </>
          ) : null
        }
      >
        {showJoin && (
          <div className="join-modal">
            <div className="coop-comm-icon lg"><Handshake size={26} /></div>
            <h3>{showJoin.name}</h3>
            <p>{showJoin.type} · {showJoin.city}</p>
            <p className="muted-text">{showJoin.about}</p>
            <ul className="check-list compact">
              <li><CheckCircle2 size={14} className="ok" /> No membership fee</li>
              <li><CheckCircle2 size={14} className="ok" /> Free training &amp; insurance</li>
              <li><CheckCircle2 size={14} className="ok" /> Shared community gigs</li>
            </ul>
          </div>
        )}
      </Modal>

      <Modal
        open={showCreate || created}
        onClose={() => { setShowCreate(false); setCreated(false); }}
        title={created ? "Application received" : "Start a new cooperative"}
      >
        {!created ? (
          <form onSubmit={createCoop} className="coop-form">
            <div className="field-block">
              <label className="field-label">Cooperative name</label>
              <input className="input" placeholder="e.g. Bhumika Tech Workers Co-op" required />
            </div>
            <div className="field-block">
              <label className="field-label">Trade / vertical</label>
              <select className="input select">
                <option>Domestic Services</option>
                <option>Skilled Trades</option>
                <option>Food &amp; Hospitality</option>
                <option>Education &amp; Tutoring</option>
                <option>Farming &amp; Gardening</option>
                <option>Other</option>
              </select>
            </div>
            <div className="field-block">
              <label className="field-label">Estimated founding members</label>
              <input className="input" type="number" min="5" placeholder="Minimum 10 to register" required />
            </div>
            <div className="field-block">
              <label className="field-label">City / Area of operation</label>
              <input className="input" placeholder="e.g. Electronic City, Bengaluru" required />
            </div>
            <button type="submit" className="btn btn-primary btn-block">
              Submit Application
            </button>
          </form>
        ) : (
          <div className="confirm-state">
            <div className="confirm-tick"><CheckCircle2 size={40} /></div>
            <h3>Cooperative application received!</h3>
            <p>
              Our co-op team will contact you within 5 working days with the
              registration toolkit, by-law templates and a dedicated mentor.
            </p>
          </div>
        )}
      </Modal>
    </div>
  );
}

export default Community;