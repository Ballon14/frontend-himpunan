export default function StatsCard({ icon: Icon, label, value, color = '#6366f1' }) {
    return (
        <div className="admin-stats-card" style={{ '--card-accent': color }}>
            <div className="admin-stats-icon" style={{ background: `${color}20`, color }}>
                <Icon size={24} />
            </div>
            <div className="admin-stats-info">
                <span className="admin-stats-value">{value}</span>
                <span className="admin-stats-label">{label}</span>
            </div>
        </div>
    );
}
