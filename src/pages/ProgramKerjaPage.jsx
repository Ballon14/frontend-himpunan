import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Clipboard, Calendar } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import SectionTitle from '../components/SectionTitle';
import LoadingSpinner from '../components/LoadingSpinner';
import PageTransition from '../components/PageTransition';
import SEO from '../components/SEO';
import { getProgramKerja } from '../api/programKerja';
import { formatDate } from '../utils/format';

const STATUS_MAP = {
    perencanaan: { class: 'badge-gray', label: 'Perencanaan' },
    berjalan: { class: 'badge-info', label: 'Berjalan' },
    selesai: { class: 'badge-success', label: 'Selesai' },
    dibatalkan: { class: 'badge-danger', label: 'Dibatalkan' },
};

export default function ProgramKerjaPage() {
    const [search, setSearch] = useState('');
    const [status, setStatus] = useState('');
    const [page, setPage] = useState(1);

    const { data, isLoading: loading } = useQuery({
        queryKey: ['programKerja', { page, search, status }],
        queryFn: async () => {
            const params = { page, per_page: 9 };
            if (search) params.search = search;
            if (status) params.status = status;
            const res = await getProgramKerja(params);
            return res.data?.data || { data: [], meta: null };
        },
        staleTime: 5 * 60 * 1000,
    });

    const proker = data?.data || [];
    const meta = data?.meta || null;

    return (
        <PageTransition>
            <SEO title="Program Kerja" description="Program dan kegiatan yang diselenggarakan oleh himpunan." />
            <div className="page">
                <div className="container">
                    <div>
                        <SectionTitle
                            label="Program Kerja"
                            title="Daftar Program Kerja"
                            description="Program dan kegiatan yang diselenggarakan oleh himpunan."
                        />
                    </div>

                    <div className="filter-bar">
                        <div style={{ position: 'relative', flex: 1, minWidth: 250 }}>
                            <Search size={18} style={{
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
                                const MotionLink = motion(Link); // create a motion Link component
                                return (
                                    <MotionLink
                                        to={`/program-kerja/${item.id}`}
                                        key={item.id}
                                        className="content-card glass-card"
                                        style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}

                                        whileHover={{ y: -8, boxShadow: '0 20px 40px rgba(0,0,0,0.15)' }}
                                        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                                    >
                                        {item.foto ? (
                                            <div style={{ overflow: 'hidden' }}>
                                                <motion.img
                                                    src={item.foto}
                                                    alt={item.nama_program}
                                                    className="card-image"
                                                    whileHover={{ scale: 1.05 }}
                                                    transition={{ duration: 0.4 }}
                                                />
                                            </div>
                                        ) : (
                                            <div className="card-image-placeholder"><Clipboard size={48} /></div>
                                        )}
                                        <div className="card-body">
                                            <div className="card-meta">
                                                <span className={`badge ${s.class}`}>{s.label}</span>
                                            </div>
                                            <h3 className="card-title">{item.nama_program}</h3>
                                            <p className="card-description">{item.deskripsi.length > 100 ? item.deskripsi.substring(0, 100) + '...' : item.deskripsi}</p>
                                            <div className="card-footer">
                                                <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>
                                                    <Calendar size={14} /> {formatDate(item.tanggal_mulai)} — {formatDate(item.tanggal_selesai)}
                                                </span>
                                            </div>
                                        </div>
                                    </MotionLink>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="empty-state">
                            <div className="empty-icon"><Clipboard size={48} /></div>
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
        </PageTransition>
    );
}
