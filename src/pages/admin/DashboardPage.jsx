import { useState, useEffect } from 'react';
import { getDashboardStats, getDashboardCharts } from '../../api/admin';
import StatsCard from '../../components/admin/StatsCard';
import { FiUsers, FiFileText, FiBriefcase, FiImage, FiMail, FiInbox, FiTrendingUp } from 'react-icons/fi';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, Legend,
    BarChart, Bar,
    LineChart, Line,
} from 'recharts';

const CHART_COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6', '#3b82f6', '#14b8a6', '#f97316'];

const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    return (
        <div className="admin-chart-tooltip">
            <p className="admin-chart-tooltip-label">{label}</p>
            {payload.map((entry, i) => (
                <p key={i} style={{ color: entry.color }}>
                    {entry.name}: <strong>{entry.value}</strong>
                </p>
            ))}
        </div>
    );
};

export default function DashboardPage() {
    const [stats, setStats] = useState(null);
    const [charts, setCharts] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        Promise.all([getDashboardStats(), getDashboardCharts()])
            .then(([statsRes, chartsRes]) => {
                setStats(statsRes.data.data);
                setCharts(chartsRes.data.data);
            })
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    if (loading) {
        return <div className="admin-loading"><div className="admin-spinner" /></div>;
    }

    const hasProkerData = charts?.proker_status?.length > 0;
    const hasAnggotaData = charts?.anggota_angkatan?.length > 0;

    return (
        <div className="admin-dashboard">
            {/* Stats Cards */}
            <div className="admin-stats-grid">
                <StatsCard icon={FiUsers} label="Total Anggota" value={stats?.anggota || 0} color="#6366f1" />
                <StatsCard icon={FiFileText} label="Total Berita" value={stats?.berita || 0} color="#10b981" />
                <StatsCard icon={FiBriefcase} label="Program Kerja" value={stats?.program_kerja || 0} color="#f59e0b" />
                <StatsCard icon={FiImage} label="Total Galeri" value={stats?.galeri || 0} color="#ec4899" />
                <StatsCard icon={FiMail} label="Pesan Belum Dibaca" value={stats?.pesan_unread || 0} color="#ef4444" />
                <StatsCard icon={FiInbox} label="Total Pesan" value={stats?.pesan_total || 0} color="#8b5cf6" />
            </div>

            {/* Charts Row 1: Area + Pie */}
            <div className="admin-charts-row">
                <div className="admin-chart-card admin-chart-wide">
                    <div className="admin-chart-header">
                        <h3><FiTrendingUp /> Tren Konten Bulanan</h3>
                        <span className="admin-chart-year">{new Date().getFullYear()}</span>
                    </div>
                    <div className="admin-chart-body">
                        <ResponsiveContainer width="100%" height={280}>
                            <AreaChart data={charts?.content_trend || []}>
                                <defs>
                                    <linearGradient id="gradBerita" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                                    </linearGradient>
                                    <linearGradient id="gradGaleri" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#2a2e3a" />
                                <XAxis dataKey="bulan" stroke="#8b8fa3" fontSize={12} />
                                <YAxis stroke="#8b8fa3" fontSize={12} allowDecimals={false} />
                                <Tooltip content={<CustomTooltip />} />
                                <Legend iconType="circle" wrapperStyle={{ fontSize: 12, color: '#8b8fa3' }} />
                                <Area type="monotone" dataKey="berita" name="Berita" stroke="#6366f1" fill="url(#gradBerita)" strokeWidth={2.5} dot={{ r: 4, fill: '#6366f1' }} />
                                <Area type="monotone" dataKey="galeri" name="Galeri" stroke="#10b981" fill="url(#gradGaleri)" strokeWidth={2.5} dot={{ r: 4, fill: '#10b981' }} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="admin-chart-card">
                    <div className="admin-chart-header">
                        <h3>Status Program Kerja</h3>
                    </div>
                    <div className="admin-chart-body">
                        {hasProkerData ? (
                            <ResponsiveContainer width="100%" height={280}>
                                <PieChart>
                                    <Pie
                                        data={charts.proker_status}
                                        cx="50%" cy="50%"
                                        innerRadius={55} outerRadius={90}
                                        paddingAngle={4}
                                        dataKey="value"
                                        nameKey="name"
                                        animationBegin={0}
                                        animationDuration={800}
                                    >
                                        {charts.proker_status.map((entry, i) => (
                                            <Cell key={i} fill={entry.color} stroke="transparent" />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        contentStyle={{ background: '#1a1d27', border: '1px solid #2a2e3a', borderRadius: 8, fontSize: 13 }}
                                        itemStyle={{ color: '#e4e6ed' }}
                                    />
                                    <Legend iconType="circle" wrapperStyle={{ fontSize: 12, color: '#8b8fa3' }} />
                                </PieChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="admin-chart-empty">Belum ada data program kerja</div>
                        )}
                    </div>
                </div>
            </div>

            {/* Charts Row 2: Bar + Line */}
            <div className="admin-charts-row">
                <div className="admin-chart-card admin-chart-wide">
                    <div className="admin-chart-header">
                        <h3>Distribusi Anggota per Angkatan</h3>
                    </div>
                    <div className="admin-chart-body">
                        {hasAnggotaData ? (
                            <ResponsiveContainer width="100%" height={280}>
                                <BarChart data={charts.anggota_angkatan} barSize={36}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#2a2e3a" />
                                    <XAxis dataKey="angkatan" stroke="#8b8fa3" fontSize={11} height={30} />
                                    <YAxis stroke="#8b8fa3" fontSize={12} allowDecimals={false} />
                                    <Tooltip content={<CustomTooltip />} />
                                    <Bar dataKey="jumlah" name="Jumlah" radius={[6, 6, 0, 0]} animationDuration={800}>
                                        {(charts.anggota_angkatan || []).map((entry, i) => (
                                            <Cell key={i} fill={entry.color || CHART_COLORS[i % CHART_COLORS.length]} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="admin-chart-empty">Belum ada data anggota</div>
                        )}
                    </div>
                </div>

                <div className="admin-chart-card">
                    <div className="admin-chart-header">
                        <h3>Tren Pesan Masuk</h3>
                        <span className="admin-chart-year">{new Date().getFullYear()}</span>
                    </div>
                    <div className="admin-chart-body">
                        <ResponsiveContainer width="100%" height={280}>
                            <LineChart data={charts?.pesan_trend || []}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#2a2e3a" />
                                <XAxis dataKey="bulan" stroke="#8b8fa3" fontSize={12} />
                                <YAxis stroke="#8b8fa3" fontSize={12} allowDecimals={false} />
                                <Tooltip content={<CustomTooltip />} />
                                <Line
                                    type="monotone"
                                    dataKey="pesan"
                                    name="Pesan"
                                    stroke="#ec4899"
                                    strokeWidth={2.5}
                                    dot={{ r: 4, fill: '#ec4899', stroke: '#ec4899' }}
                                    activeDot={{ r: 6, stroke: '#ec4899', strokeWidth: 2, fill: '#0f1117' }}
                                    animationDuration={800}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
}
