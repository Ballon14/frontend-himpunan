import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getLogs, getSystemLogs, clearLogs, downloadLogs } from '../../api/admin';
import ConfirmDialog from '../../components/admin/ConfirmDialog';
import {
    Shield, RefreshCw, Trash2, Download, Search, Terminal,
    User, Globe, Clock, ChevronDown, ChevronUp, Filter, Activity, Eye,
    Users, Newspaper, Image, CalendarDays, ShoppingBag, ClipboardList, Lock, Package, Trophy
} from 'lucide-react';
import { notifySuccess, notifyError, notifyLoading } from '../../utils/toast';

// ── helpers ──────────────────────────────────────────────────────────────────

const ACTION_BADGE = {
    'membuat':          { bg: '#27ae60', label: 'Membuat' },
    'memperbarui':      { bg: '#2980b9', label: 'Memperbarui' },
    'menghapus':        { bg: '#c0392b', label: 'Menghapus' },
    'login berhasil':   { bg: '#27ae60', label: 'Login' },
    'login gagal':      { bg: '#e67e22', label: 'Login Gagal' },
    'logout':           { bg: '#7f8c8d', label: 'Logout' },
};

const RESOURCE_ICON = {
    anggota: Users, berita: Newspaper, galeri: Image, prestasi: Trophy,
    kegiatan: CalendarDays, merchandise: ShoppingBag, 'program kerja': ClipboardList, auth: Lock,
};

const RESOURCE_LABEL = {
    anggota: 'Anggota', berita: 'Berita', galeri: 'Galeri', prestasi: 'Prestasi',
    kegiatan: 'Kegiatan', merchandise: 'Merchandise', 'program kerja': 'Program Kerja', auth: 'Auth',
};

function ResourceIcon({ resource, size = 14 }) {
    const Icon = RESOURCE_ICON[resource] || Package;
    return <Icon size={size} style={{ flexShrink: 0 }} />;
}

function formatTimestamp(iso) {
    if (!iso) return '—';
    const d = new Date(iso);
    return d.toLocaleString('id-ID', {
        day: '2-digit', month: 'short', year: 'numeric',
        hour: '2-digit', minute: '2-digit', second: '2-digit',
    });
}

function relativeTime(iso) {
    if (!iso) return '';
    const diff = Date.now() - new Date(iso).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'baru saja';
    if (mins < 60) return `${mins} menit lalu`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs} jam lalu`;
    const days = Math.floor(hrs / 24);
    return `${days} hari lalu`;
}

// ── component ────────────────────────────────────────────────────────────────

export default function LogsPage() {
    const queryClient = useQueryClient();
    const [tab, setTab] = useState('audit'); // 'audit' | 'system'
    const [search, setSearch] = useState('');
    const [filterAction, setFilterAction] = useState('');
    const [filterResource, setFilterResource] = useState('');
    const [filterDate, setFilterDate] = useState('');
    const [expandedRow, setExpandedRow] = useState(null);
    const [limit, setLimit] = useState(200);
    const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, title: '', message: '', onConfirm: null });

    // ── Audit trail query ─────────────────────────────────────────────────
    const { data: auditLogs = [], isLoading: auditLoading, refetch: refetchAudit, isFetching: auditFetching } = useQuery({
        queryKey: ['audit-logs', limit],
        queryFn: async () => {
            const res = await getLogs(limit);
            return res.data?.data || [];
        },
        refetchInterval: 15000,
    });

    // ── System log query ──────────────────────────────────────────────────
    const { data: systemLogs = [], isLoading: sysLoading, refetch: refetchSys, isFetching: sysFetching } = useQuery({
        queryKey: ['system-logs', limit],
        queryFn: async () => {
            const res = await getSystemLogs(limit);
            return res.data?.data || [];
        },
        refetchInterval: 15000,
        enabled: tab === 'system',
    });

    // ── Clear mutation ────────────────────────────────────────────────────
    const clearMutation = useMutation({
        mutationFn: clearLogs,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['audit-logs'] });
            queryClient.invalidateQueries({ queryKey: ['system-logs'] });
            notifySuccess('Semua log berhasil dikosongkan.');
        },
        onError: () => notifyError('Gagal mengosongkan log.'),
    });

    const handleClear = () => {
        setConfirmDialog({
            isOpen: true,
            title: 'Kosongkan Semua Log',
            message: 'Audit trail dan log sistem akan dikosongkan. Tindakan ini tidak dapat dibatalkan.',
            onConfirm: () => clearMutation.mutateAsync(),
        });
    };

    const handleDownload = async () => {
        try {
            notifyLoading('Mempersiapkan unduhan...', { id: 'dl' });
            const res = await downloadLogs();
            const url = window.URL.createObjectURL(new Blob([res.data]));
            const a = document.createElement('a');
            a.href = url;
            a.setAttribute('download', 'hmtkbg-system.log');
            document.body.appendChild(a);
            a.click();
            a.remove();
            notifySuccess('Log berhasil diunduh.', 'dl');
        } catch {
            notifyError('Gagal mengunduh file log.', 'dl');
        }
    };

    // ── Filtering ─────────────────────────────────────────────────────────
    const filtered = auditLogs.filter(log => {
        if (filterAction && log.action !== filterAction) return false;
        if (filterResource && log.resource !== filterResource) return false;
        if (filterDate) {
            const logDate = new Date(log.timestamp).toISOString().slice(0, 10);
            if (logDate !== filterDate) return false;
        }
        if (search) {
            const q = search.toLowerCase();
            return (
                log.actor?.toLowerCase().includes(q) ||
                log.action?.toLowerCase().includes(q) ||
                log.resource?.toLowerCase().includes(q) ||
                log.ip?.toLowerCase().includes(q) ||
                log.resourceId?.toLowerCase().includes(q) ||
                JSON.stringify(log.changes || '').toLowerCase().includes(q)
            );
        }
        return true;
    });

    // Unique values for filter dropdowns
    const uniqueActions = [...new Set(auditLogs.map(l => l.action).filter(Boolean))];
    const uniqueResources = [...new Set(auditLogs.map(l => l.resource).filter(Boolean))];

    const isLoading = tab === 'audit' ? auditLoading : sysLoading;
    const isFetching = tab === 'audit' ? auditFetching : sysFetching;
    const totalCount = auditLogs.length;
    const shownCount = filtered.length;

    // ── Styles ────────────────────────────────────────────────────────────
    const tabBtn = (active) => ({
        display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
        padding: '0.6rem 1.2rem', border: 'none', cursor: 'pointer',
        fontSize: '0.875rem', fontWeight: active ? 600 : 400,
        color: active ? 'var(--admin-primary)' : 'var(--admin-text-muted)',
        background: active ? 'rgba(var(--admin-primary-rgb), 0.1)' : 'transparent',
        borderRadius: 'var(--admin-radius-sm)',
        transition: 'all 0.2s',
    });

    const filterSelect = {
        padding: '0.5rem 0.75rem', background: 'var(--admin-surface)',
        border: '1px solid var(--admin-border)', borderRadius: 'var(--admin-radius-sm)',
        color: 'var(--admin-text)', fontSize: '0.8125rem', cursor: 'pointer',
    };

    return (
        <div className="admin-page">
            {/* Header */}
            <div style={{ marginBottom: '1.5rem' }}>
                <h2 className="admin-page-title" style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--admin-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Shield size={24} /> Audit Trail & Log Sistem
                </h2>
                <p style={{ color: 'var(--admin-text-muted)', fontSize: '0.875rem', marginTop: '0.25rem' }}>
                    Pantau setiap perubahan data: siapa yang mengubah, dari IP mana, dan apa yang diubah.
                </p>
            </div>

            {/* Tabs + Actions */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', gap: '0.25rem', background: 'var(--admin-surface-alt, rgba(255,255,255,0.03))', padding: '0.25rem', borderRadius: 'var(--admin-radius-sm)' }}>
                    <button style={tabBtn(tab === 'audit')} onClick={() => setTab('audit')}>
                        <Activity size={16} /> Audit Trail
                    </button>
                    <button style={tabBtn(tab === 'system')} onClick={() => setTab('system')}>
                        <Terminal size={16} /> Log Sistem
                    </button>
                </div>

                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    <select value={limit} onChange={(e) => setLimit(Number(e.target.value))} style={filterSelect}>
                        <option value={50}>50</option>
                        <option value={100}>100</option>
                        <option value={200}>200</option>
                        <option value={500}>500</option>
                    </select>
                    <button onClick={() => { refetchAudit(); refetchSys(); }} className="admin-btn admin-btn-secondary" disabled={isLoading || isFetching} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <RefreshCw size={14} className={isFetching ? 'animate-spin' : ''} /> Segarkan
                    </button>
                    <button onClick={handleDownload} className="admin-btn admin-btn-secondary" disabled={isLoading || totalCount === 0} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <Download size={14} /> Unduh
                    </button>
                    <button onClick={handleClear} className="admin-btn admin-btn-danger" disabled={isLoading || totalCount === 0 || clearMutation.isPending} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <Trash2 size={14} /> Kosongkan
                    </button>
                </div>
            </div>

            {/* ════════════════════ AUDIT TRAIL TAB ════════════════════ */}
            {tab === 'audit' && (
                <>
                    {/* Filters */}
                    <div style={{
                        display: 'flex', gap: '0.75rem', marginBottom: '1rem', flexWrap: 'wrap', alignItems: 'center',
                        padding: '0.75rem 1rem', background: 'var(--admin-surface)', border: '1px solid var(--admin-border)',
                        borderRadius: 'var(--admin-radius-sm)',
                    }}>
                        <Filter size={14} style={{ color: 'var(--admin-text-muted)' }} />

                        <div className="admin-search-bar" style={{ flex: 1, minWidth: 180, maxWidth: 320 }}>
                            <Search size={14} className="admin-search-icon" />
                            <input type="text" placeholder="Cari actor, IP, resource..." value={search} onChange={(e) => setSearch(e.target.value)} />
                        </div>

                        <select value={filterAction} onChange={(e) => setFilterAction(e.target.value)} style={filterSelect}>
                            <option value="">Semua Aksi</option>
                            {uniqueActions.map(a => (
                                <option key={a} value={a}>{ACTION_BADGE[a]?.label || a}</option>
                            ))}
                        </select>

                        <select value={filterResource} onChange={(e) => setFilterResource(e.target.value)} style={filterSelect}>
                            <option value="">Semua Resource</option>
                            {uniqueResources.map(r => (
                                <option key={r} value={r}>{RESOURCE_LABEL[r] || r}</option>
                            ))}
                        </select>

                        <input type="date" value={filterDate} onChange={(e) => setFilterDate(e.target.value)} style={{ ...filterSelect, colorScheme: 'dark' }} />

                        {(search || filterAction || filterResource || filterDate) && (
                            <button onClick={() => { setSearch(''); setFilterAction(''); setFilterResource(''); setFilterDate(''); }}
                                style={{ ...filterSelect, color: 'var(--admin-primary)', cursor: 'pointer' }}>
                                Reset
                            </button>
                        )}

                        <span style={{ marginLeft: 'auto', fontSize: '0.75rem', color: 'var(--admin-text-muted)' }}>
                            {shownCount} dari {totalCount} entri
                        </span>
                    </div>

                    {/* Table */}
                    <div style={{
                        border: '1px solid var(--admin-border)', borderRadius: 'var(--admin-radius)',
                        overflow: 'hidden', background: 'var(--admin-surface)',
                    }}>
                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8125rem' }}>
                                <thead>
                                    <tr style={{ background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid var(--admin-border)' }}>
                                        <th style={{ padding: '0.75rem 1rem', textAlign: 'left', color: 'var(--admin-text-muted)', fontWeight: 600, whiteSpace: 'nowrap' }}>Waktu</th>
                                        <th style={{ padding: '0.75rem 1rem', textAlign: 'left', color: 'var(--admin-text-muted)', fontWeight: 600, whiteSpace: 'nowrap' }}>Aktor</th>
                                        <th style={{ padding: '0.75rem 1rem', textAlign: 'left', color: 'var(--admin-text-muted)', fontWeight: 600, whiteSpace: 'nowrap' }}>Aksi</th>
                                        <th style={{ padding: '0.75rem 1rem', textAlign: 'left', color: 'var(--admin-text-muted)', fontWeight: 600, whiteSpace: 'nowrap' }}>Resource</th>
                                        <th style={{ padding: '0.75rem 1rem', textAlign: 'left', color: 'var(--admin-text-muted)', fontWeight: 600, whiteSpace: 'nowrap' }}>IP Address</th>
                                        <th style={{ padding: '0.75rem 1rem', textAlign: 'center', color: 'var(--admin-text-muted)', fontWeight: 600, width: 50 }}>Detail</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {auditLoading ? (
                                        <tr>
                                            <td colSpan={6} style={{ padding: '3rem', textAlign: 'center', color: 'var(--admin-text-muted)' }}>
                                                <div className="admin-spinner" style={{ margin: '0 auto 1rem' }} />
                                                Memuat audit trail...
                                            </td>
                                        </tr>
                                    ) : filtered.length === 0 ? (
                                        <tr>
                                            <td colSpan={6} style={{ padding: '3rem', textAlign: 'center', color: 'var(--admin-text-muted)' }}>
                                                {search || filterAction || filterResource || filterDate
                                                    ? 'Tidak ada entri yang cocok dengan filter.'
                                                    : 'Belum ada aktivitas yang tercatat.'}
                                            </td>
                                        </tr>
                                    ) : (
                                        filtered.map((log, idx) => {
                                            const badge = ACTION_BADGE[log.action] || { bg: '#636e72', label: log.action };
                                            const isExpanded = expandedRow === idx;
                                            const hasChanges = log.changes && Object.keys(log.changes).length > 0;

                                            return (
                                                <>
                                                    <tr
                                                        key={idx}
                                                        style={{
                                                            borderBottom: '1px solid var(--admin-border)',
                                                            cursor: hasChanges ? 'pointer' : 'default',
                                                            transition: 'background 0.15s',
                                                        }}
                                                        onClick={() => hasChanges && setExpandedRow(isExpanded ? null : idx)}
                                                        onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
                                                        onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                                                    >
                                                        <td style={{ padding: '0.65rem 1rem', whiteSpace: 'nowrap' }}>
                                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                                                <Clock size={12} style={{ color: 'var(--admin-text-muted)', flexShrink: 0 }} />
                                                                <div>
                                                                    <div>{formatTimestamp(log.timestamp)}</div>
                                                                    <div style={{ fontSize: '0.7rem', color: 'var(--admin-text-muted)' }}>{relativeTime(log.timestamp)}</div>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td style={{ padding: '0.65rem 1rem' }}>
                                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                                                <User size={12} style={{ color: 'var(--admin-text-muted)', flexShrink: 0 }} />
                                                                <span style={{ fontWeight: 500 }}>{log.actor || 'Unknown'}</span>
                                                            </div>
                                                        </td>
                                                        <td style={{ padding: '0.65rem 1rem' }}>
                                                            <span style={{
                                                                display: 'inline-block', padding: '0.2rem 0.6rem',
                                                                borderRadius: '999px', fontSize: '0.75rem', fontWeight: 600,
                                                                color: '#fff', background: badge.bg, whiteSpace: 'nowrap',
                                                            }}>
                                                                {badge.label}
                                                            </span>
                                                        </td>
                                                        <td style={{ padding: '0.65rem 1rem', whiteSpace: 'nowrap' }}>
                                                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
                                                                <ResourceIcon resource={log.resource} />
                                                                {log.resource}
                                                            </span>
                                                            {log.resourceId && (
                                                                <span style={{ fontSize: '0.7rem', color: 'var(--admin-text-muted)', marginLeft: '0.4rem' }}>
                                                                    #{log.resourceId.substring(0, 8)}
                                                                </span>
                                                            )}
                                                        </td>
                                                        <td style={{ padding: '0.65rem 1rem' }}>
                                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                                                <Globe size={12} style={{ color: 'var(--admin-text-muted)', flexShrink: 0 }} />
                                                                <code style={{ fontSize: '0.75rem', color: 'var(--admin-text-muted)' }}>{log.ip || '—'}</code>
                                                            </div>
                                                        </td>
                                                        <td style={{ padding: '0.65rem 1rem', textAlign: 'center' }}>
                                                            {hasChanges ? (
                                                                isExpanded
                                                                    ? <ChevronUp size={16} style={{ color: 'var(--admin-primary)' }} />
                                                                    : <Eye size={16} style={{ color: 'var(--admin-text-muted)' }} />
                                                            ) : (
                                                                <span style={{ color: 'var(--admin-text-muted)', fontSize: '0.7rem' }}>—</span>
                                                            )}
                                                        </td>
                                                    </tr>

                                                    {/* Expanded detail row */}
                                                    {isExpanded && hasChanges && (
                                                        <tr key={`${idx}-detail`} style={{ borderBottom: '1px solid var(--admin-border)' }}>
                                                            <td colSpan={6} style={{ padding: '0.75rem 1rem 1rem 2.5rem', background: 'rgba(255,255,255,0.02)' }}>
                                                                <div style={{ fontSize: '0.75rem', color: 'var(--admin-text-muted)', marginBottom: '0.5rem', fontWeight: 600 }}>
                                                                    Data yang diubah:
                                                                </div>
                                                                <div style={{
                                                                    fontFamily: 'Courier New, monospace', fontSize: '0.8rem',
                                                                    background: '#0d1117', padding: '0.75rem 1rem',
                                                                    borderRadius: 'var(--admin-radius-sm)', border: '1px solid var(--admin-border)',
                                                                    maxHeight: 200, overflowY: 'auto',
                                                                }}>
                                                                    {Object.entries(log.changes).map(([key, val]) => (
                                                                        <div key={key} style={{ marginBottom: '0.25rem' }}>
                                                                            <span style={{ color: '#7ee787' }}>{key}</span>
                                                                            <span style={{ color: 'var(--admin-text-muted)' }}>: </span>
                                                                            <span style={{ color: '#a5d6ff' }}>
                                                                                {typeof val === 'object' ? JSON.stringify(val) : String(val)}
                                                                            </span>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                                <div style={{ marginTop: '0.5rem', fontSize: '0.7rem', color: 'var(--admin-text-muted)' }}>
                                                                    {log.method} {log.path}
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    )}
                                                </>
                                            );
                                        })
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </>
            )}

            {/* ════════════════════ SYSTEM LOG TAB ════════════════════ */}
            {tab === 'system' && (
                <div style={{
                    background: '#090d16', border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: '8px', boxShadow: '0 10px 40px rgba(0,0,0,0.5)',
                    padding: '1.5rem',
                }}>
                    {/* Terminal header */}
                    <div style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '0.75rem',
                        marginBottom: '1rem', color: 'rgba(255,255,255,0.4)', fontSize: '0.8125rem',
                        fontFamily: 'monospace',
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Terminal size={14} style={{ color: 'var(--admin-primary)' }} />
                            <span>hmtkbg-server-console</span>
                        </div>
                        <span>{sysFetching ? 'Memperbarui...' : 'Auto-refresh 15s'}</span>
                    </div>

                    {/* Log lines */}
                    <div style={{
                        fontFamily: 'Courier New, monospace', fontSize: '0.8125rem', lineHeight: 1.6,
                        overflowY: 'auto', maxHeight: 500, minHeight: 300, paddingRight: '0.5rem',
                    }} className="custom-scrollbar">
                        {sysLoading ? (
                            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 300, color: 'rgba(255,255,255,0.4)' }}>
                                <div className="admin-spinner" style={{ marginRight: '1rem' }} />
                                Menghubungkan ke log stream...
                            </div>
                        ) : systemLogs.length === 0 ? (
                            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 300, color: 'rgba(255,255,255,0.3)', fontStyle: 'italic' }}>
                                Belum ada log sistem.
                            </div>
                        ) : (
                            systemLogs.map((line, i) => {
                                let color = '#dfe6e9';
                                let weight = 'normal';
                                if (line.includes('[ERROR]')) { color = '#ff7675'; weight = '600'; }
                                else if (line.includes('[WARN]')) { color = '#ffeaa7'; weight = '500'; }
                                else if (line.includes('[INFO]')) { color = '#81ecec'; }
                                return (
                                    <div key={i} style={{
                                        whiteSpace: 'pre-wrap', wordBreak: 'break-all',
                                        padding: '0.2rem 0', borderBottom: '1px solid rgba(255,255,255,0.02)',
                                        color, fontWeight: weight,
                                    }}>
                                        {line}
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>
            )}

            <ConfirmDialog {...confirmDialog} onClose={() => setConfirmDialog(d => ({ ...d, isOpen: false }))} />
        </div>
    );
}
