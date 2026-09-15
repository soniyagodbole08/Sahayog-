import { useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import {
  ChevronRight, CalendarDays, Clock, MapPin, Phone, Mail,
  Wrench, CheckCircle2, XCircle, MessageCircle, ReceiptText,
  Star, Download,
} from "lucide-react";
import AppLayout from "../components/AppLayout";
import StatusBadge from "../components/StatusBadge";
import Modal from "../components/Modal";
import BackButton from "../components/BackButton";
import { getService, getProvider, formatINR, services } from "../data";
import { useToast } from "../useToast";
import { useData } from "../context/useData";

function BookingDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();

  const [cancelOpen, setCancelOpen] = useState(false);
  const [rated, setRated] = useState(null);
  const { bookings, cancelBooking, completeBooking } = useData();

  const booking = bookings.find((b) => b.id === id);

  if (!booking) {
    return (
      <AppLayout role="customer" title="Booking Details">
        <div className="empty-state">
          <h2>Booking not found</h2>
          <button className="btn btn-primary" onClick={() => navigate("/bookings")}>
            Back to My Bookings
          </button>
        </div>
      </AppLayout>
    );
  }

  const service = getService(booking.serviceId);
  const provider = getProvider(booking.providerId);

  function handleCancel() {
    cancelBooking(booking.id);
    setCancelOpen(false);
    toast("Booking cancelled. Any advance paid is refunded within 3 days.", "info");
  }

  function confirmDone() {
    completeBooking(booking.id);
    toast("Payment of " + formatINR(booking.price) + " released to "
      + provider?.name + " · 92% provider share", "success");
  }

  return (
    <AppLayout
      role="customer"
      title="Booking Details"
      subtitle={`Reference ${booking.id}`}
    >
      <BackButton>Back to My Bookings</BackButton>

      <div className="booking-detail-layout">
        <div className="booking-detail-main">
          <div className="card booking-summary-card">
            <div className="bd-head">
              <div>
                <span className="mono strong">{booking.id}</span>
                <StatusBadge status={booking.status} />
              </div>
              <div className="bd-date">
                <CalendarDays size={16} />
                {booking.date} · {booking.time}
              </div>
            </div>

            <h2>{service?.name}</h2>
            <p className="muted-text">Booked for {booking.customer} · Payment via {booking.payment}</p>

            <div className="bd-summary-grid">
              <div className="bd-item">
                <div className="bd-item-icon blue"><CalendarDays size={18} /></div>
                <div>
                  <span>Scheduled for</span>
                  <strong>{booking.date}</strong>
                </div>
              </div>
              <div className="bd-item">
                <div className="bd-item-icon green"><Clock size={18} /></div>
                <div>
                  <span>Time slot</span>
                  <strong>{booking.time}</strong>
                </div>
              </div>
              <div className="bd-item">
                <div className="bd-item-icon violet"><MapPin size={18} /></div>
                <div>
                  <span>Service address</span>
                  <strong>{booking.address}</strong>
                </div>
              </div>
            </div>

            {booking.notes && (
              <div className="bd-note">
                <strong>Notes for the provider:</strong>
                <p>{booking.notes}</p>
              </div>
            )}

            <div className="bd-progress">
              <div className="bd-step done"><CheckCircle2 size={16} /><span>Booked</span></div>
              <div className="bd-line" />
              <div className={`bd-step ${booking.status === "confirmed" || booking.status === "completed" ? "done" : ""}`}>
                <CheckCircle2 size={16} /><span>Confirmed</span>
              </div>
              <div className="bd-line" />
              <div className={`bd-step ${booking.status === "completed" ? "done" : booking.status === "cancelled" ? "fail" : ""}`}>
                {booking.status === "cancelled" ? <XCircle size={16} /> : <CheckCircle2 size={16} />}
                <span>{booking.status === "cancelled" ? "Cancelled" : "Completed"}</span>
              </div>
            </div>
          </div>

          <div className="card">
            <h3 className="card-title">Service provider</h3>
            <div className="bd-provider">
              <div className={`avatar avatar-lg color-${provider?.color}`}>{provider?.avatar}</div>
              <div className="bd-provider-info">
                <h4>
                  {provider?.name}
                  <StatusBadge status={provider?.verified ? "verified" : "unverified"} />
                </h4>
                <p>{provider?.role} · {provider?.cooperative}</p>
                <p className="muted-text"><MapPin size={13} /> {provider?.location}</p>
              </div>
              <div className="btn-row">
                <button className="btn btn-outline btn-sm" onClick={() => toast("Chat opened with provider (demo)", "info")}>
                  <MessageCircle size={15} /> Message
                </button>
                <Link to={`/providers?id=${provider?.id}`} className="btn btn-outline btn-sm">
                  Profile
                </Link>
              </div>
            </div>
          </div>

          <div className="card">
            <h3 className="card-title"><ReceiptText size={17} /> Payment summary</h3>
            <div className="invoice">
              <div className="invoice-row"><span>{service?.name}</span><span>{formatINR(booking.price)}</span></div>
              <div className="invoice-row"><span>Convenience fee</span><span className="ok-text">Free</span></div>
              <div className="invoice-row"><span>Co-op contribution</span><span className="muted-text">{formatINR(Math.round(booking.price * 0.08))}</span></div>
              <div className="invoice-row total"><span>Total payable</span><strong>{formatINR(booking.price)}</strong></div>
            </div>
            <p className="secure-note">
              92% reaches the provider directly. The rest funds training and
              platform safety — fully transparent, always.
            </p>
            <button className="btn btn-outline btn-sm" onClick={() => toast("Invoice download started (demo)", "info")}>
              <Download size={15} /> Download Invoice
            </button>
          </div>
        </div>

        <aside className="booking-detail-side">
          <div className="card sticky-card">
            <h3 className="card-title">Actions</h3>

            {booking.status !== "cancelled" && booking.status !== "completed" && (
              <>
                <button className="btn btn-primary btn-block" onClick={confirmDone}>
                  Mark as Completed
                </button>
                <button className="btn btn-danger-ghost btn-block" onClick={() => setCancelOpen(true)}>
                  Cancel Booking
                </button>
              </>
            )}

            {booking.status === "cancelled" && (
              <p className="muted-text">
                This booking was cancelled. Any advance payment will be refunded
                to your original payment method within 3-5 working days.
              </p>
            )}

            {booking.status === "completed" && (
              <div className="rate-section">
                <label className="field-label">Rate this service</label>
                <div className="rate-stars">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <button
                      key={s}
                      className={rated >= s ? "rate-star on" : "rate-star"}
                      onClick={() => setRated(s)}
                      aria-label={`Rate ${s} stars`}
                    >
                      <Star size={20} fill={rated >= s ? "currentColor" : "none"} />
                    </button>
                  ))}
                </div>
                <textarea
                  className="textarea"
                  rows="3"
                  placeholder="How was the service?"
                />
                <button className="btn btn-primary btn-block" onClick={() => toast("Thanks for your feedback!", "success")}>
                  Submit Review
                </button>
              </div>
            )}

            <div className="help-box">
              <h4>Need help?</h4>
              <p><Phone size={14} /> 1800-SAH-AYOG (toll free)</p>
              <p><Mail size={14} /> support@sahayog.in</p>
              <p className="muted-text">Available 8 AM – 10 PM, all days.</p>
            </div>
          </div>

          <div className="card">
            <h3 className="card-title">Similar bookings</h3>
            <div className="dash-booking-list">
              {bookings
                .filter((b) => b.id !== booking.id)
                .slice(0, 3)
                .map((b) => {
                  const svc = services.find((s) => s.id === b.serviceId);
                  return (
                    <Link to={`/bookings/${b.id}`} className="dash-booking" key={b.id}>
                      <div className="dash-booking-icon blue"><Wrench size={15} /></div>
                      <div className="dash-booking-info">
                        <strong>{svc?.name}</strong>
                        <span>{b.date}</span>
                      </div>
                      <ChevronRight size={15} className="muted-text" />
                    </Link>
                  );
                })}
            </div>
          </div>
        </aside>
      </div>

      <Modal
        open={cancelOpen}
        onClose={() => setCancelOpen(false)}
        title="Cancel this booking?"
        footer={
          <>
            <button className="btn btn-outline" onClick={() => setCancelOpen(false)}>Keep Booking</button>
            <button className="btn btn-danger btn-sm" onClick={handleCancel}>
              Yes, Cancel
            </button>
          </>
        }
      >
        <p>
          Are you sure you want to cancel{" "}
          <strong>{service?.name}</strong> scheduled for {booking.date}?
        </p>
        <p className="muted-text">
          Free cancellation up to 24 hours before the slot. A refund, if any,
          is processed within 3-5 working days.
        </p>
      </Modal>
    </AppLayout>
  );
}

export default BookingDetails;