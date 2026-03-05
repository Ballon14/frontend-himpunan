import { useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { FiSearch, FiClipboard, FiCalendar } from 'react-icons/fi';
import SectionTitle from '../components/SectionTitle';
import LoadingSpinner from '../components/LoadingSpinner';
import { getProgramKerja } from '../api/programKerja';

const STATUS_MAP = {
    perencanaan: { class: 'badge-gray', label: 'Perencanaan' },
    berjalan: { class: 'badge-info', label: 'Berjalan' },
    selesai: { class: 'badge-success', label: 'Selesai' },
    dibatalkan: { class: 'badge-danger', label: 'Dibatalkan' },
};

export default function ProgramKerjaPage() {
    const [proker, setProker] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [status, setStatus] = useState('');
    const [page, setPage] = useState(1);
    const [meta, setMeta] = useState(null);

    useEffect(() => {
        document.title = 'Program Kerja — HIMAPUP';
    }, []);

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const params = { page, per_page: 9 };
            if (search) params.search = search;
            if (status) params.status = status;
            const res = await getProgramKerja(params);
            setProker(res.data?.data?.data || []);
            setMeta(res.data?.data?.meta || null);
        } catch {
            setProker([]);
        } finally {
            setLoading(false);
        }
    }, [page, search, status]);

    useEffect(() => { fetchData(); }, [fetchData]);

    const formatDate = (dateStr) => {
        if (!dateStr) return '-';
        return new Date(dateStr).toLocaleDateString('id-ID', {
            day: 'numeric', month: 'short', year: 'numeric',
        });
    };

    return (
        <div className="page">
            <div className="container">
                <SectionTitle
                    label="Program Kerja"
                    title="Daftar Program Kerja"
                    description="Program dan kegiatan yang diselenggarakan oleh himpunan."
                />

                <div className="filter-bar">
                    <div style={{ position: 'relative', flex: 1, minWidth: 250 }}>
                        <FiSearch style={{
                            position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)',
                            color: 'var(--color-text-muted)',
                        }} />
                        <input
                            type="text"
                            className="search-input"
                            placeholder="Cari program kerja..."
                            value={search}
                            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                            style={{ paddingLeft: 40 }}
                        />
                    </div>
                    <select
                        className="filter-select"
                        value={status}
                        onChange={(e) => { setStatus(e.target.value); setPage(1); }}
                    >
                        <option value="">Semua Status</option>
                        <option value="perencanaan">Perencanaan</option>
                        <option value="berjalan">Berjalan</option>
                        <option value="selesai">Selesai</option>
                        <option value="dibatalkan">Dibatalkan</option>
                    </select>
                </div>

                {loading ? (
                    <LoadingSpinner />
                ) : proker.length > 0 ? (
                    <div className="cards-grid">
                        {proker.map((item, i) => {
                            const s = STATUS_MAP[item.status] || { class: 'badge-gray', label: item.status };
                            return (
                                <motion.div
                                    key={item.id}
                                    className="content-card glass-card"
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.1, duration: 0.4 }}
                                >
                                    {item.foto ? (
                                        <img src={item.foto} alt={item.nama_program} className="card-image" />
                                    ) : (
                                        <div className="card-image-placeholder"><FiClipboard /></div>
                                    )}
                                    <div className="card-body">
                                        <div className="card-meta">
                                            <span className={`badge ${s.class}`}>{s.label}</span>
                                        </div>
                                        <h3 className="card-title">{item.nama_program}</h3>
                                        <p className="card-description">{item.deskripsi}</p>
                                        <div className="card-footer">
                                            <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>
                                                <FiCalendar /> {formatDate(item.tanggal_mulai)} — {formatDate(item.tanggal_selesai)}
                                            </span>
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="empty-state">
                        <div className="empty-icon"><FiClipboard /></div>
                        <p>{search || status ? 'Tidak ada program kerja yang cocok.' : 'Belum ada program kerja.'}</p>
                    </div>
                )}

                {meta && meta.last_page > 1 && (
                    <div className="pagination">
                        <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page <= 1}>← Prev</button>
                        {Array.from({ length: meta.last_page }, (_, i) => i + 1).map(p => (
                            <button key={p} className={page === p ? 'active' : ''} onClick={() => setPage(p)}>{p}</button>
                        ))}
                        <button onClick={() => setPage(p => Math.min(meta.last_page, p + 1))} disabled={page >= meta.last_page}>Next →</button>
                    </div>
                )}
            </div>
        </div>
    );
}
