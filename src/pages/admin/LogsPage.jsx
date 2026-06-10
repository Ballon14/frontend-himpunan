import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getLogs, clearLogs, downloadLogs } from '../../api/admin';
import { Terminal, RefreshCw, Trash2, Download, Search } from 'lucide-react';
import toast from 'react-hot-toast';

export default function LogsPage() {
    const queryClient = useQueryClient();
    const [limit, setLimit] = useState(100);
    const [search, setSearch] = useState('');

    const { data: logsData, isLoading, refetch, isFetching } = useQuery({
        queryKey: ['system-logs', limit],
        queryFn: async () => {
            const res = await getLogs(limit);
            return res.data?.data || [];
        },
        refetchInterval: 15000, // Auto refresh every 15 seconds
    });

    const clearMutation = useMutation({
        mutationFn: clearLogs,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['system-logs'] });
            toast.success('Log sistem berhasil dikosongkan.');
        },
        onError: () => toast.error('Gagal mengosongkan log sistem.')
    });

    const handleClear = () => {
        if (!confirm('Apakah Anda yakin ingin mengosongkan seluruh log sistem? Tindakan ini tidak dapat dibatalkan.')) return;
        clearMutation.mutate();
    };

    const handleDownload = async () => {
        try {
            toast.loading('Mempersiapkan pengunduhan log...', { id: 'download-logs' });
            const res = await downloadLogs();
            const url = window.URL.createObjectURL(new Blob([res.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'hmtkbg-system.log');
            document.body.appendChild(link);
            link.click();
            link.remove();
            toast.success('Log berhasil diunduh.', { id: 'download-logs' });
        } catch (err) {
            console.error(err);
            toast.error('Gagal mengunduh file log.', { id: 'download-logs' });
        }
    };

    // Filter logs dynamically in the frontend based on the search query
    const filteredLogs = (logsData || []).filter(line => 
        line.toLowerCase().includes(search.toLowerCase())
    );

    // Color code logs based on level helper
    const getLineStyle = (line) => {
        if (line.includes('[ERROR]')) {
            return { color: '#ff7675', fontWeight: '600' }; // Light red for errors
        }
        if (line.includes('[WARN]')) {
            return { color: '#ffeaa7', fontWeight: '500' }; // Yellow for warnings
        }
        if (line.includes('[INFO]')) {
            return { color: '#81ecec' }; // Light cyan for info
        }
        return { color: '#dfe6e9' }; // Off-white for others
    };

    return (
        <div className="admin-page">
            <div className="admin-page-header-simple" style={{ marginBottom: '2rem' }}>
                <h2 className="admin-page-title" style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-primary)' }}>
                    Log Aktivitas & Sistem
                </h2>
                <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', marginTop: '0.25rem' }}>
                    Pantau aktivitas server, performa sistem, dan detail kesalahan unhandled secara langsung dari peramban Anda.
                </p>
            </div>

            {/* Actions Bar */}
            <div className="admin-page-header" style={{ marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                <div style={{ display: 'flex', gap: '1rem', flex: 1, minWidth: '280px' }}>
                    <div className="admin-search-bar" style={{ flex: 1, maxWidth: '400px' }}>
                        <Search size={16} className="admin-search-icon" />
                        <input
                            type="text"
                            placeholder="Cari kata kunci dalam log..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    
                    <select 
                        value={limit} 
                        onChange={(e) => setLimit(Number(e.target.value))}
                        className="admin-select"
                        style={{
                            padding: '8px 12px',
                            background: 'var(--admin-surface)',
                            border: '1px solid var(--admin-border)',
                            borderRadius: 'var(--admin-radius-sm)',
                            color: 'var(--admin-text)',
                            fontSize: '0.875rem',
                            cursor: 'pointer'
                        }}
                    >
                        <option value={50}>50 Baris</option>
                        <option value={100}>100 Baris</option>
                        <option value={250}>250 Baris</option>
                        <option value={500}>500 Baris</option>
                    </select>
                </div>

                <div style={{ display: 'flex', gap: '0.75rem' }}>
                    <button 
                        onClick={() => refetch()} 
                        className="admin-btn admin-btn-secondary" 
                        disabled={isLoading || isFetching}
                        title="Segarkan Log"
                        style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                    >
                        <RefreshCw size={16} className={isFetching ? 'animate-spin' : ''} />
                        Segarkan
                    </button>
                    <button 
                        onClick={handleDownload} 
                        className="admin-btn admin-btn-secondary" 
                        disabled={isLoading || (logsData || []).length === 0}
                        style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                    >
                        <Download size={16} />
                        Unduh Log
                    </button>
                    <button 
                        onClick={handleClear} 
                        className="admin-btn admin-btn-danger" 
                        disabled={isLoading || (logsData || []).length === 0 || clearMutation.isPending}
                        style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                    >
                        <Trash2 size={16} />
                        Kosongkan
                    </button>
                </div>
            </div>

            {/* Terminal Log Console */}
            <div 
                className="glass-card" 
                style={{ 
                    padding: '1.5rem', 
                    background: '#090d16',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: '8px',
                    boxShadow: '0 10px 40px rgba(0,0,0,0.5)'
                }}
            >
                {/* Terminal Header */}
                <div 
                    style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'space-between',
                        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
                        paddingBottom: '0.75rem',
                        marginBottom: '1rem',
                        color: 'rgba(255, 255, 255, 0.4)',
                        fontSize: '0.8125rem',
                        fontFamily: 'monospace'
                    }}
                >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Terminal size={14} style={{ color: 'var(--color-primary)' }} />
                        <span>hmtkbg-server-console (~/logs/app.log)</span>
                    </div>
                    <div>
                        {isFetching ? 'Memperbarui...' : 'Auto-refresh aktif (15s)'}
                    </div>
                </div>

                {/* Log Lines Area */}
                <div 
                    style={{ 
                        fontFamily: 'Courier New, Courier, monospace', 
                        fontSize: '0.8125rem', 
                        lineHeight: '1.5',
                        overflowY: 'auto',
                        maxHeight: '500px',
                        minHeight: '300px',
                        paddingRight: '0.5rem'
                    }}
                    className="custom-scrollbar"
                >
                    {isLoading ? (
                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '300px', color: 'rgba(255,255,255,0.4)' }}>
                            <div className="admin-spinner" style={{ marginRight: '1rem' }} />
                            Menghubungkan ke logs stream...
                        </div>
                    ) : filteredLogs.length === 0 ? (
                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '300px', color: 'rgba(255,255,255,0.3)', fontStyle: 'italic' }}>
                            {search ? 'Tidak ada baris log yang cocok dengan filter pencarian.' : 'Belum ada log aktivitas yang tercatat.'}
                        </div>
                    ) : (
                        filteredLogs.map((line, idx) => (
                            <div 
                                key={idx} 
                                style={{ 
                                    whiteSpace: 'pre-wrap', 
                                    wordBreak: 'break-all', 
                                    padding: '0.25rem 0',
                                    borderBottom: '1px solid rgba(255, 255, 255, 0.02)',
                                    ...getLineStyle(line) 
                                }}
                            >
                                {line}
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
