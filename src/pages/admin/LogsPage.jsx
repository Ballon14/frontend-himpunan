import React, { useState } from 'react';
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
    const [tab, setTab] = useState('audit');
    const [search, setSearch] = useState('');
    const [filterAction, setFilterAction] = useState('');
    const [filterResource, setFilterResource] = useState('');
    const [filterDate, setFilterDate] = useState('');
    const [expandedRow, setExpandedRow] = useState(null);
    const [limit, setLimit] = useState(200);
    const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, title: '', message: '', onConfirm: null });

    const { data: auditLogs = [], isLoading: auditLoading, refetch: refetchAudit, isFetching: auditFetching } = useQuery({
        queryKey: ['audit-logs', limit],
        queryFn: async () => {
            const res = await getLogs(limit);
            return res.data?.data || [];
        },
        refetchInterval: 15000,
    });

    const { data: systemLogs = [], isLoading: sysLoading, refetch: refetchSys, isFetching: sysFetching } = useQuery({
        queryKey: ['system-logs', limit],
        queryFn: async () => {
            const res = await getSystemLogs(limit);
            return res.data?.data || [];
        },
        refetchInterval: 15000,
        enabled: tab === 'system',
    });

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

    const uniqueActions = [...new Set(auditLogs.map(l => l.action).filter(Boolean))];
    const uniqueResources = [...new Set(auditLogs.map(l => l.resource).filter(Boolean))];

    const isLoading = tab === 'audit' ? auditLoading : sysLoading;
    const isFetching = tab === 'audit' ? auditFetching : sysFetching;
    const totalCount = auditLogs.length;
    const shownCount = filtered.length;

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
            <div className="logs-toolbar">
                <div className="logs-tabs">
                    <button className={`logs-tab ${tab === 'audit' ? 'active' : ''}`} onClick={() => setTab('audit')}>
                        <Activity size={16} /> Audit Trail
                    </button>
                    <button className={`logs-tab ${tab === 'system' ? 'active' : ''}`} onClick={() => setTab('system')}>
                        <Terminal size={16} /> Log Sistem
                    </button>
                </div>

                <div className="logs-actions">
                    <select value={limit} onChange={(e) => setLimit(Number(e.target.value))} className="logs-select">
                        <option value={50}>50</option>
                        <option value={100}>100</option>
                        <option value={200}>200</option>
                        <option value={500}>500</option>
                    </select>
                    <button onClick={() => { refetchAudit(); refetchSys(); }} className="admin-btn admin-btn-secondary" disabled={isLoading || isFetching} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <RefreshCw size={14} className={isFetching ? 'animate-spin' : ''} /> <span className="logs-btn-label">Segarkan</span>
                    </button>
                    <button onClick={handleDownload} className="admin-btn admin-btn-secondary" disabled={isLoading || totalCount === 0} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <Download size={14} /> <span className="logs-btn-label">Unduh</span>
                    </button>
                    <button onClick={handleClear} className="admin-btn admin-btn-danger" disabled={isLoading || totalCount === 0 || clearMutation.isPending} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <Trash2 size={14} /> <span className="logs-btn-label">Kosongkan</span>
                    </button>
                </div>
            </div>

            {/* AUDIT TRAIL TAB */}
            {tab === 'audit' && (
                <>
                    {/* Filters */}
                    <div className="logs-filter-bar">
                        <Filter size={14} style={{ color: 'var(--admin-text-muted)', flexShrink: 0 }} />

                        <div className="admin-search-bar" style={{ flex: 1, minWidth: 160, maxWidth: 320 }}>
                            <Search size={14} className="admin-search-icon" />
                            <input type="text" placeholder="Cari actor, IP, resource..." value={search} onChange={(e) => setSearch(e.target.value)} />
                        </div>

                        <select value={filterAction} onChange={(e) => setFilterAction(e.target.value)} className="logs-select">
                            <option value="">Semua Aksi</option>
                            {uniqueActions.map(a => (
                                <option key={a} value={a}>{ACTION_BADGE[a]?.label || a}</option>
                            ))}
                        </select>

                        <select value={filterResource} onChange={(e) => setFilterResource(e.target.value)} className="logs-select">
                            <option value="">Semua Resource</option>
                            {uniqueResources.map(r => (
                                <option key={r} value={r}>{RESOURCE_LABEL[r] || r}</option>
                            ))}
                        </select>

                        <input type="date" value={filterDate} onChange={(e) => setFilterDate(e.target.value)} className="logs-select logs-date-input" />

                        {(search || filterAction || filterResource || filterDate) && (
                            <button onClick={() => { setSearch(''); setFilterAction(''); setFilterResource(''); setFilterDate(''); }}
                                className="logs-select" style={{ color: 'var(--admin-primary)', cursor: 'pointer' }}>
                                Reset
                            </button>
                        )}

                        <span className="logs-filter-count">
                            {shownCount} dari {totalCount} entri
                        </span>
                    </div>

                    {/* Table */}
                    <div className="admin-table-wrapper">
                        {auditLoading ? (
                            <div className="admin-loading"><div className="admin-spinner" /></div>
                        ) : (
                            <table className="admin-table">
                                <thead>
                                    <tr>
                                        <th>Waktu</th>
                                        <th>Aktor</th>
                                        <th>Aksi</th>
                                        <th>Resource</th>
                                        <th>IP Address</th>
                                        <th style={{ textAlign: 'center', width: 50 }}>Detail</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filtered.length === 0 ? (
                                        <tr><td colSpan={6} className="admin-empty">
                                            {search || filterAction || filterResource || filterDate
                                                ? 'Tidak ada entri yang cocok dengan filter.'
                                                : 'Belum ada aktivitas yang tercatat.'}
                                        </td></tr>
                                    ) : (
                                        filtered.map((log, idx) => {
                                            const badge = ACTION_BADGE[log.action] || { bg: '#636e72', label: log.action };
                                            const isExpanded = expandedRow === idx;
                                            const hasChanges = log.changes && Object.keys(log.changes).length > 0;

                                            return (
                                                <React.Fragment key={idx}>
                                                <tr>
                                                    <td data-label="Waktu">
                                                        <div className="logs-cell-time">
                                                            <Clock size={12} style={{ color: 'var(--admin-text-muted)', flexShrink: 0 }} />
                                                            <div>
                                                                <div>{formatTimestamp(log.timestamp)}</div>
                                                                <div style={{ fontSize: '0.7rem', color: 'var(--admin-text-muted)' }}>{relativeTime(log.timestamp)}</div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td data-label="Aktor" className="admin-td-primary">
                                                        <div className="logs-cell-actor">
                                                            <User size={12} style={{ color: 'var(--admin-text-muted)', flexShrink: 0 }} />
                                                            <span style={{ fontWeight: 500 }}>{log.actor || 'Unknown'}</span>
                                                        </div>
                                                    </td>
                                                    <td data-label="Aksi">
                                                        <span className="logs-badge" style={{ background: badge.bg }}>
                                                            {badge.label}
                                                        </span>
                                                    </td>
                                                    <td data-label="Resource">
                                                        <span className="logs-cell-resource">
                                                            <ResourceIcon resource={log.resource} />
                                                            {RESOURCE_LABEL[log.resource] || log.resource}
                                                        </span>
                                                        {log.resourceId && (
                                                            <span style={{ fontSize: '0.7rem', color: 'var(--admin-text-muted)', marginLeft: '0.4rem' }}>
                                                                #{log.resourceId.substring(0, 8)}
                                                            </span>
                                                        )}
                                                    </td>
                                                    <td data-label="IP Address">
                                                        <div className="logs-cell-ip">
                                                            <Globe size={12} style={{ color: 'var(--admin-text-muted)', flexShrink: 0 }} />
                                                            <code style={{ fontSize: '0.75rem', color: 'var(--admin-text-muted)' }}>{log.ip || '—'}</code>
                                                        </div>
                                                    </td>
                                                    <td data-label="Detail" style={{ textAlign: 'center' }}>
                                                        {hasChanges ? (
                                                            <button
                                                                className="logs-detail-btn"
                                                                onClick={() => setExpandedRow(isExpanded ? null : idx)}
                                                            >
                                                                {isExpanded
                                                                    ? <ChevronUp size={16} style={{ color: 'var(--admin-primary)' }} />
                                                                    : <Eye size={16} style={{ color: 'var(--admin-text-muted)' }} />
                                                                }
                                                            </button>
                                                        ) : (
                                                            <span style={{ color: 'var(--admin-text-muted)', fontSize: '0.7rem' }}>—</span>
                                                        )}
                                                    </td>
                                                </tr>

                                                {/* Expanded detail row */}
                                                {isExpanded && hasChanges && (
                                                    <tr>
                                                        <td colSpan={6} className="logs-detail-row">
                                                            <div className="logs-detail-label">Data yang diubah:</div>
                                                            <div className="logs-detail-code">
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
                                                </React.Fragment>
                                            );
                                        })
                                    )}
                                </tbody>
                            </table>
                        )}
                    </div>
                </>
            )}

            {/* SYSTEM LOG TAB */}
            {tab === 'system' && (
                <div className="logs-terminal">
                    <div className="logs-terminal-header">
                        <div className="logs-terminal-title">
                            <Terminal size={14} style={{ color: 'var(--admin-primary)' }} />
                            <span>hmtkbg-server-console</span>
                        </div>
                        <span>{sysFetching ? 'Memperbarui...' : 'Auto-refresh 15s'}</span>
                    </div>

                    <div className="logs-terminal-body">
                        {sysLoading ? (
                            <div className="logs-terminal-loading">
                                <div className="admin-spinner" style={{ marginRight: '1rem' }} />
                                Menghubungkan ke log stream...
                            </div>
                        ) : systemLogs.length === 0 ? (
                            <div className="logs-terminal-empty">
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
                                    <div key={i} className="logs-terminal-line" style={{ color, fontWeight: weight }}>
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
