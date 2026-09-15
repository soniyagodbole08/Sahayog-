import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Star, Clock, ShieldCheck, BadgeCheck, CheckCircle2, MapPin, Users,
  ChevronRight, CalendarDays, IndianRupee, Lock, ArrowRight,
} from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ServiceCard from "../components/ServiceCard";
import StatusBadge from "../components/StatusBadge";
import BackButton from "../components/BackButton";
import Modal from "../components/Modal";
import { getService, providers, services, reviews, formatINR } from "../data";
import { useToast } from "../useToast";
import { useAuth } from "../context/useAuth";
import { useData } from "../context/useData";

const slots = ["09:00 AM", "11:00 AM", "01:00 PM", "03:30 PM", "05:30 PM"];

function ServiceDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const { user } = useAuth();
  const { addBooking } = useData();

  const service = getService(id);
  const [date, setDate] = useState("2026-09-19");
  const [slot, setSlot] = useState(slots[1]);
  const [showBook, setShowBook] = useState(
    () => typeof window !== "undefined" && window.location.hash === "#book"
  );
  const [confirmed, setConfirmed] = useState(false);
  const [newBookingId, setNewBookingId] = useState("");

  if (!service) {
    return (
      <div className="page-wrap">
        <Navbar />
        <div className="page-inner">
          <div className="empty-state">
            <h2>Service not found</h2>
            <button className="btn btn-primary" onClick={() => navigate("/services")}>
              Back to Services
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const providersOf = providers
    .filter((p) => service.providerIds.includes(p.id))
    .map((p) => ({ ...p, price: service.price }));

  const serviceReviews = reviews.filter((r) => r.service === service.name).slice(0, 2);
  const available = providersOf.filter((p) => p.available);
  const related = services.filter((s) => s.id !== service.id).slice(0, 3);

  function openBooking() {
    if (!user) {
      toast("Please login to book.", "info");
      navigate("/login", { state: { from: `/services/${id}` } });
      return;
    }
    if (available.length === 0) {
      toast("No provider available for this slot right now.", "error");
      return;
    }
    setShowBook(true);
    setConfirmed(false);
  }

  function confirmBooking(e) {
    e.preventDefault();
    setNewBookingId("BK-" + (7842 + Math.floor(Math.random() * 90)));
    setConfirmed(true);
  }

  function finish() {
    const provider = available[0] || providersOf[0];
    addBooking({
      id: newBookingId,
      customer: user?.name || "You",
      customerId: "CU-1021",
      providerId: provider?.id,
      serviceId: service.id,
      date,
      time: slot,
      price: service.price,
      status: "confirmed",
      address: "405, 4th Cross, Koramangala, Bengaluru",
      notes: "",
      payment: "UPI",
      rating: null,
    });
    setShowBook(false);
    setConfirmed(false);
    navigate("/bookings");
    toast("Booking created successfully!", "success");
  }

  return (
    <div className="page-wrap">
      <Navbar />

      <div className="page-inner">
        <BackButton />
        <nav className="breadcrumbs">
          <span onClick={() => navigate("/")}>Home</span>
          <ChevronRight size={14} />
          <span onClick={() => navigate("/services")}>Services</span>
          <ChevronRight size={14} />
          <span className="current">{service.name}</span>
        </nav>

        <div className="detail-layout">
          <div className="detail-main">
            <div className="card detail-hero">
              <div className="detail-head">
                <div>
                  <span className="eyebrow">{service.categoryLabel}</span>
                  <h1>{service.name}</h1>
                  <div className="detail-rating">
                    <Star size={17} fill="currentColor" />
                    <strong>{service.rating.toFixed(1)}</strong>
                    <span>({service.reviews} reviews)</span>
                    <StatusBadge status={service.verified ? "verified" : "unverified"} />
                  </div>
                </div>
                <div className="detail-price-box">
                  <span>Starting from</span>
                  <strong>{formatINR(service.price)}</strong>
                  <small>{service.duration}</small>
                </div>
              </div>

              <div className="detail-meta-row">
                <div className="detail-meta">
                  <Clock size={17} />
                  <div>
                    <strong>Duration</strong>
                    <span>{service.duration}</span>
                  </div>
                </div>
                <div className="detail-meta">
                  <Users size={17} />
                  <div>
                    <strong>Booked</strong>
                    <span>{service.booked.toLocaleString("en-IN")} times</span>
                  </div>
                </div>
                <div className="detail-meta">
                  <ShieldCheck size={17} />
                  <div>
                    <strong>Protection</strong>
                    <span>Quality guarantee</span>
                  </div>
                </div>
                <div className="detail-meta">
                  <Lock size={17} />
                  <div>
                    <strong>Payment</strong>
                    <span>Pay after service</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="card">
              <h3 className="card-title">About this service</h3>
              <p className="detail-desc">{service.description}</p>

              <h4 className="card-subtitle">What's included</h4>
              <ul className="check-list">
                {service.inclusions.map((inc) => (
                  <li key={inc}>
                    <CheckCircle2 size={17} className="ok" /> {inc}
                  </li>
                ))}
              </ul>
            </div>

            {serviceReviews.length > 0 && (
              <div className="card">
                <h3 className="card-title">What customers say</h3>
                <div className="mini-reviews">
                  {serviceReviews.map((r) => (
                    <div className="mini-review" key={r.id}>
                      <div className="review-stars">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star key={i} size={14} fill={i < r.rating ? "currentColor" : "none"} />
                        ))}
                      </div>
                      <p>"{r.text}"</p>
                      <span className="mini-review-author">— {r.name}, {r.date}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="card">
              <h3 className="card-title">Available providers</h3>
              <div className="detail-providers">
                {providersOf.map((p) => (
                  <div className="detail-provider" key={p.id}>
                    <div className={`avatar avatar-lg color-${p.color}`}>{p.avatar}</div>
                    <div className="detail-provider-info">
                      <h4>
                        {p.name}
                        {p.verified && <BadgeCheck size={16} className="ok" />}
                      </h4>
                      <span>{p.role} · {p.cooperative}</span>
                      <span className="muted-text"><MapPin size={12} /> {p.location}</span>
                    </div>
                    <div className="detail-provider-meta">
                      <span className="stars-sm">
                        <Star size={13} fill="currentColor" /> {p.rating.toFixed(1)}
                      </span>
                      <StatusBadge status={p.available ? "available" : "unavailable"} />
                    </div>
                    <button
                      className="btn btn-outline btn-sm"
                      onClick={() => navigate(`/providers?id=${p.id}`)}
                    >
                      Profile
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <aside className="detail-side">
            <div className="card sticky-card">
              <h3 className="card-title">Book this service</h3>
              <div className="price-break">
                <span>Service charge</span>
                <strong>{formatINR(service.price)}</strong>
              </div>

              <div className="field-block">
                <label className="field-label">Pick a date</label>
                <div className="input-box">
                  <CalendarDays size={17} />
                  <input
                    type="date"
                    value={date}
                    min="2026-09-16"
                    onChange={(e) => setDate(e.target.value)}
                  />
                </div>
              </div>

              <div className="field-block">
                <label className="field-label">Pick a slot</label>
                <div className="slot-grid">
                  {slots.map((s) => (
                    <button
                      type="button"
                      key={s}
                      className={slot === s ? "slot-btn active" : "slot-btn"}
                      onClick={() => setSlot(s)}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              <div className="total-line">
                <div>
                  <span>Total</span>
                  <small>incl. all taxes &amp; fees</small>
                </div>
                <strong>{formatINR(service.price)}</strong>
              </div>

              <button className="btn btn-primary btn-block" onClick={openBooking}>
                Book Now <ArrowRight size={16} />
              </button>
              <p className="secure-note">
                <Lock size={13} /> 100% secure. Free cancellation up to 24h.
              </p>
            </div>
          </aside>
        </div>

        <div className="section-head">
          <div>
            <span className="eyebrow">YOU MAY ALSO LIKE</span>
            <h2>Related services</h2>
          </div>
        </div>
        <div className="service-grid">
          {related.map((s) => (
            <ServiceCard key={s.id} service={s} />
          ))}
        </div>
      </div>

      <Footer />

      <Modal
        open={showBook}
        onClose={() => { setShowBook(false); setConfirmed(false); }}
        title={confirmed ? "Booking Confirmed" : "Confirm your booking"}
        footer={
          confirmed ? (
            <button className="btn btn-primary btn-block" onClick={finish}>
              Go to My Bookings
            </button>
          ) : null
        }
      >
        {!confirmed ? (
          <form onSubmit={confirmBooking} className="booking-form">
            <div className="booking-summary">
              <div className="summary-row">
                <span>Service</span>
                <strong>{service.name}</strong>
              </div>
              <div className="summary-row">
                <span>Provider</span>
                <strong>{available[0]?.name || providersOf[0]?.name}</strong>
              </div>
              <div className="summary-row">
                <span>Date &amp; Time</span>
                <strong>{date} · {slot}</strong>
              </div>
              <div className="summary-row">
                <span>Address</span>
                <strong>405, 4th Cross, Koramangala</strong>
              </div>
              <div className="summary-row total">
                <span>Amount payable</span>
                <strong>{formatINR(service.price)}</strong>
              </div>
            </div>

            <div className="field-block">
              <label className="field-label">Special instructions (optional)</label>
              <textarea
                className="textarea"
                rows="3"
                placeholder="Anything the provider should know?"
              />
            </div>

            <label className="radio-row check">
              <input type="checkbox" required />
              <span>
                I agree to the <a href="#terms" className="link-muted">Terms &amp; Service Conditions</a>
              </span>
            </label>

            <button type="submit" className="btn btn-primary btn-block">
              Confirm &amp; Pay on Completion <IndianRupee size={16} />
            </button>
          </form>
        ) : (
          <div className="confirm-state">
            <div className="confirm-tick">
              <CheckCircle2 size={40} />
            </div>
            <h3>You're all set!</h3>
            <p>
              Your booking <span className="mono strong">{newBookingId}</span> for{" "}
              <strong>{service.name}</strong> on {date} at {slot} is confirmed.
            </p>
            <p className="muted-text">
              {available[0]?.name} has been notified and will confirm shortly.
              You can view or cancel anytime from My Bookings.
            </p>
          </div>
        )}
      </Modal>
    </div>
  );
}

export default ServiceDetails;