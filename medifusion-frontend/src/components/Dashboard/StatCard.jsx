function StatCard({ title, count, icon, glowColor = 'blue' }) {
  return (
    <div className="col-md-6 col-lg-3">
      <div className="stat-box">
        <div className={`stat-icon-wrapper bg-${glowColor}-subtle text-${glowColor}`}>
          {icon}
        </div>
        <div>
          <span className="text-muted small d-block font-semibold">{title}</span>
          <h3 className="fw-bold mb-0 text-white fs-2">{count ?? 0}</h3>
        </div>
      </div>
    </div>
  );
}

export default StatCard;