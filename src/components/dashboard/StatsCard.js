const StatsCard = ({ title, value, icon, color }) => {
  return (
    <div className="stats-card">
      <div className="stats-card-header">
        <div className="stats-card-title">{title}</div>
        <div className={`stats-card-icon ${color}`}>{icon}</div>
      </div>
      <div className="stats-card-value">{value}</div>
    </div>
  )
}

export default StatsCard
