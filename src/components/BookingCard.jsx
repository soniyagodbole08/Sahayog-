import { Link } from "react-router-dom";
import { Calendar, MapPin, ArrowRight } from "lucide-react";
import { formatINR } from "../data";
import StatusBadge from "./StatusBadge";

function BookingCard({ booking, onCancel, service, provider }) {
  return (
    <div className="booking-card">
      <div className="booking-card-top">
        <StatusBadge status={booking.status} />
        <span className="booking-id">{booking.id}</span>
      </div>

      <h3>{service ? service.name : `Booking ${booking.id}`}</h3>
      <p className="booking-provider">
        with <strong>{provider ? provider.name : booking.customer}</strong>
      </p>

      <div className="booking-card-meta">
        <span>
          <Calendar size={14} /> {booking.date} · {booking.time}
        </span>
        {booking.address && (
          <span className="truncate">
            <MapPin size={14} /> {booking.address}
          </span>
        )}
      </div>

      <div className="booking-card-foot">
        <strong className="price">{formatINR(booking.price)}</strong>
        <div className="booking-card-actions">
          {onCancel && booking.status !== "cancelled" && booking.status !== "completed" && (
            <button className="btn btn-danger-ghost btn-sm" onClick={() => onCancel(booking.id)}>
              Cancel
            </button>
          )}
          <Link to={`/bookings/${booking.id}`} className="btn btn-outline btn-sm">
            View <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  );
}

export default BookingCard;