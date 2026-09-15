import { Link } from "react-router-dom";
import { Star, ArrowRight, ShieldCheck, Clock } from "lucide-react";
import { formatINR } from "../data";
import Icon from "./Icon";

function ServiceCard({ service, onBook }) {
  const rating = Number(service.rating);

  return (
    <div className="service-card">
      <div className="service-card-top">
        <div className="service-card-icon">
          <Icon name={service.category} size={26} />
        </div>

        <div className="service-card-rating">
          <Star size={14} fill="currentColor" />
          <strong>{rating.toFixed(1)}</strong>
          <span>({service.reviews})</span>
          <span className="rating-bars" aria-hidden="true">
            {Array.from({ length: 5 }).map((_, i) => (
              <span
                key={i}
                className={`rating-bar ${i < rating ? "filled" : ""}`}
              />
            ))}
          </span>
        </div>
      </div>

      <h3 className="service-card-title">
        <Link to={`/services/${service.id}`}>{service.name}</Link>
      </h3>
      <p className="service-card-desc">{service.description}</p>

      <div className="service-card-meta">
        <span className="chip">
          <Clock size={13} /> {service.duration}
        </span>
        <span className="chip">
          {service.verified ? <ShieldCheck size={13} className="ok" /> : <ShieldCheck size={13} />}
          {service.verified ? "Verified" : "New listing"}
        </span>
      </div>

      <div className="service-card-foot">
        <div className="service-price">
          <strong>{formatINR(service.price)}</strong>
          <span>starting</span>
        </div>

        <div className="service-card-actions">
          {onBook ? (
            <button className="btn btn-primary btn-sm" onClick={() => onBook(service)}>
              Book
            </button>
          ) : null}
          <Link to={`/services/${service.id}`} className="btn btn-outline btn-sm">
            Details <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ServiceCard;