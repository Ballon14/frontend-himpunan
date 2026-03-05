import { useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Search, User } from 'lucide-react';
import SectionTitle from '../components/SectionTitle';
import LoadingSpinner from '../components/LoadingSpinner';
import PageTransition from '../components/PageTransition';
import SEO from '../components/SEO';
import { getAnggota } from '../api/anggota';

export default function AnggotaPage() {
    const [anggota, setAnggota] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [angkatan, setAngkatan] = useState('');
    const [page, setPage] = useState(1);
    const [meta, setMeta] = useState(null);

    useEffect(() => {
        // Init logic if any
    }, []);

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const params = { page, per_page: 12 };
            if (search) params.search = search;
            if (angkatan) params.angkatan = angkatan;
            params.status_aktif = 1;

            const res = await getAnggota(params);
            setAnggota(res.data?.data?.data || []);
            setMeta(res.data?.data?.meta || null);
        } catch {
            setAnggota([]);
        } finally {
            setLoading(false);
        }
    }, [page, search, angkatan]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleSearch = (e) => {
        setSearch(e.target.value);
        setPage(1);
    };

    return (
        <PageTransition>
            <SEO title="Anggota" />
            <div className="page">
                <div className="container">
                    <div data-aos="fade-down">
                        <SectionTitle
                            label="Anggota"
                            title="Daftar Anggota"
                            description="Kenali anggota-anggota himpunan kami yang berdedikasi."
                        />
                    </div>

                    <div className="filter-bar" data-aos="fade-up" data-aos-delay="100">
                        <div style={{ position: 'relative', flex: 1, minWidth: 250 }}>
                            <Search size={18} style={{
                                position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)',
                                color: 'var(--color-text-muted)',
                            }} />
                            <input
                                type="text"
                                className="search-input"
                                placeholder="Cari nama, NIM, atau jurusan..."
                                value={search}
                                onChange={handleSearch}
                                style={{ paddingLeft: 40 }}
                            />
                        </div>
                        <select
                            className="filter-select"
                            value={angkatan}
                            onChange={(e) => { setAngkatan(e.target.value); setPage(1); }}
                        >
                            <option value="">Semua Angkatan</option>
                            {['2020', '2021', '2022', '2023', '2024', '2025'].map(a => (
                                <option key={a} value={a}>{a}</option>
                            ))}
                        </select>
                    </div>

                    {loading ? (
                        <LoadingSpinner />
                    ) : anggota.length > 0 ? (
                        <div className="members-grid">
                            {anggota.map((item, i) => (
                                <motion.div
                                    key={item.id}
                                    className="member-card glass-card"
                                    data-aos="zoom-in"
                                    data-aos-delay={(i % 12) * 50}
                                    whileHover={{ y: -8, boxShadow: '0 15px 30px rgba(0,0,0,0.1)' }}
                                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                                >
                                    <motion.div whileHover={{ scale: 1.05 }} transition={{ duration: 0.3 }}>
                                        {item.foto ? (
                                            <img src={item.foto} alt={item.nama} className="member-avatar" />
                                        ) : (
                                            <div className="member-avatar-placeholder">
                                                {item.nama?.charAt(0)?.toUpperCase() || <User size={40} />}
                                            </div>
                                        )}
                                    </motion.div>
                                    <h3 className="member-name">{item.nama}</h3>
                                    {item.jabatan && <p className="member-role">{item.jabatan}</p>}
                                    <p className="member-info">
                                        {item.nim} • {item.jurusan} • Angkatan {item.angkatan}
                                    </p>
                                </motion.div>
                            ))}
                        </div>
                    ) : (
                        <div className="empty-state" data-aos="fade-in">
                            <div className="empty-icon"><User size={48} /></div>
                            <p>Tidak ada anggota ditemukan.</p>
                        </div>
                    )}

                    {/* Pagination */}
                    {meta && meta.last_page > 1 && (
                        <div className="pagination" data-aos="fade-up">
                            <button
                                onClick={() => setPage(p => Math.max(1, p - 1))}
                                disabled={page <= 1}
                            >
                                ← Prev
                            </button>
                            {Array.from({ length: meta.last_page }, (_, i) => i + 1)
                                .filter(p => Math.abs(p - page) <= 2 || p === 1 || p === meta.last_page)
                                .map((p, idx, arr) => {
                                    if (idx > 0 && p - arr[idx - 1] > 1) {
                                        return (
                                            <span key={`dot-${p}`}>
                                                <button disabled style={{ border: 'none', background: 'none' }}>...</button>
                                                <button
                                                    className={page === p ? 'active' : ''}
                                                    onClick={() => setPage(p)}
                                                >
                                                    {p}
                                                </button>
                                            </span>
                                        );
                                    }
                                    return (
                                        <button
                                            key={p}
                                            className={page === p ? 'active' : ''}
                                            onClick={() => setPage(p)}
                                        >
                                            {p}
                                        </button>
                                    );
                                })}
                            <button
                                onClick={() => setPage(p => Math.min(meta.last_page, p + 1))}
                                disabled={page >= meta.last_page}
                            >
                                Next →
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </PageTransition>
    );
}
