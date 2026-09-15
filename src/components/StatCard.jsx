function StatCard({ title, value, change, icon, type = "blue", suffix }) {
  return (
    <div className="stat-card">
      <div className="stat-top">
        <div className={`stat-icon ${type}`}>{icon}</div>
        {change && (
          <span className={`stat-change ${change.startsWith("-") ? "down" : ""}`}>
            {change}
          </span>
        )}
      </div>
      <p>{title}</p>
      <h3>
        {value}
        {suffix && <small className="stat-suffix">{suffix}</small>}
      </h3>
    </div>
  );
}

export default StatCard;