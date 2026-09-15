import { Link } from "react-router-dom";
import { Star, MapPin, BadgeCheck, ShieldCheck, Users } from "lucide-react";
import { formatINR } from "../data";

function ProviderCard({ provider, compact }) {
  return (
    <div className="provider-card">
      <div className="provider-card-head">
        <div className={`avatar avatar-lg color-${provider.color}`}>{provider.avatar}</div>

        <div className="provider-card-id">
          <h3>
            {provider.name}
            {provider.verified && <BadgeCheck size={18} className="ok" />}
          </h3>
          <p>{provider.role}</p>
        </div>

        <div className="provider-card-rating">
          <Star size={15} fill="currentColor" />
          <strong>{provider.rating.toFixed(1)}</strong>
        </div>
      </div>

      {!compact && (
        <>
          <p className="provider-card-about">{provider.about}</p>

          <div className="provider-card-skills">
            {provider.skills.slice(0, 3).map((s) => (
              <span className="chip" key={s}>
                {s}
              </span>
            ))}
          </div>

          <div className="provider-card-meta">
            <span>
              <MapPin size={14} /> {provider.location}
            </span>
            <span>
              <Users size={14} /> {provider.cooperative}
            </span>
            {!provider.verified && (
              <span>
                <ShieldCheck size={14} /> Verification pending
              </span>
            )}
          </div>
        </>
      )}

      <div className="provider-card-foot">
        <div className="service-price">
          <strong>from {formatINR(provider.price)}</strong>
          <span>
            {provider.jobs.toLocaleString("en-IN")} jobs · {provider.experience} exp
          </span>
        </div>

        <Link to={`/providers?id=${provider.id}`} className="btn btn-outline btn-sm">
          View Profile
        </Link>
      </div>
    </div>
  );
}

export default ProviderCard;