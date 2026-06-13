import { useState, useEffect } from 'react';
import { getDashboardStats, getDashboardCharts } from '../../api/admin';
import StatsCard from '../../components/admin/StatsCard';
import { Users, FileText, Briefcase, Image, Mail, Inbox, TrendingUp } from 'lucide-react';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, Legend,
    BarChart, Bar,
    LineChart, Line,
} from 'recharts';

const CHART_COLORS = ['#c0392b', '#e67e22', '#3498db', '#27ae60', '#f39c12', '#8e44ad', '#e74c3c', '#1abc9c'];

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
                <StatsCard icon={Users} label="Total Anggota" value={stats?.anggota || 0} color="#c0392b" />
                <StatsCard icon={FileText} label="Total Berita" value={stats?.berita || 0} color="#27ae60" />
                <StatsCard icon={Briefcase} label="Program Kerja" value={stats?.program_kerja || 0} color="#e67e22" />
                <StatsCard icon={Image} label="Total Galeri" value={stats?.galeri || 0} color="#3498db" />
                <StatsCard icon={Mail} label="Pesan Belum Dibaca" value={stats?.pesan_unread || 0} color="#e74c3c" />
                <StatsCard icon={Inbox} label="Total Pesan" value={stats?.pesan_total || 0} color="#8e44ad" />
            </div>

            {/* Charts Row 1: Area + Pie */}
            <div className="admin-charts-row">
                <div className="admin-chart-card admin-chart-wide">
                    <div className="admin-chart-header">
                        <h3><TrendingUp size={16} /> Tren Konten Bulanan</h3>
                        <span className="admin-chart-year">{new Date().getFullYear()}</span>
                    </div>
                    <div className="admin-chart-body">
                        <ResponsiveContainer width="100%" height={280}>
                            <AreaChart data={charts?.content_trend || []}>
                                <defs>
                                    <linearGradient id="gradBerita" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#c0392b" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#c0392b" stopOpacity={0} />
                                    </linearGradient>
                                    <linearGradient id="gradGaleri" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#e67e22" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#e67e22" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#2a2e36" />
                                <XAxis dataKey="bulan" stroke="#8b919a" fontSize={12} />
                                <YAxis stroke="#8b919a" fontSize={12} allowDecimals={false} />
                                <Tooltip content={<CustomTooltip />} />
                                <Legend iconType="circle" wrapperStyle={{ fontSize: 12, color: '#8b919a' }} />
                                <Area type="monotone" dataKey="berita" name="Berita" stroke="#c0392b" fill="url(#gradBerita)" strokeWidth={2.5} dot={{ r: 4, fill: '#c0392b' }} />
                                <Area type="monotone" dataKey="galeri" name="Galeri" stroke="#e67e22" fill="url(#gradGaleri)" strokeWidth={2.5} dot={{ r: 4, fill: '#e67e22' }} />
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
                                        contentStyle={{ background: '#1a1d24', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8, fontSize: 13 }}
                                        itemStyle={{ color: '#eaedf0' }}
                                    />
                                    <Legend iconType="circle" wrapperStyle={{ fontSize: 12, color: '#8b919a' }} />
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
                                    <CartesianGrid strokeDasharray="3 3" stroke="#2a2e36" />
                                    <XAxis dataKey="angkatan" stroke="#8b919a" fontSize={11} height={30} />
                                    <YAxis stroke="#8b919a" fontSize={12} allowDecimals={false} />
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
                                <CartesianGrid strokeDasharray="3 3" stroke="#2a2e36" />
                                <XAxis dataKey="bulan" stroke="#8b919a" fontSize={12} />
                                <YAxis stroke="#8b919a" fontSize={12} allowDecimals={false} />
                                <Tooltip content={<CustomTooltip />} />
                                <Line
                                    type="monotone"
                                    dataKey="pesan"
                                    name="Pesan"
                                    stroke="#e67e22"
                                    strokeWidth={2.5}
                                    dot={{ r: 4, fill: '#e67e22', stroke: '#e67e22' }}
                                    activeDot={{ r: 6, stroke: '#e67e22', strokeWidth: 2, fill: '#111318' }}
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
