import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSearch, FiImage, FiX } from 'react-icons/fi';
import SectionTitle from '../components/SectionTitle';
import LoadingSpinner from '../components/LoadingSpinner';
import { getGaleri } from '../api/galeri';

export default function GaleriPage() {
    const [galeri, setGaleri] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [kategori, setKategori] = useState('');
    const [page, setPage] = useState(1);
    const [meta, setMeta] = useState(null);
    const [lightbox, setLightbox] = useState(null);

    useEffect(() => {
        document.title = 'Galeri — HIMAPUP';
    }, []);

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const params = { page, per_page: 12 };
            if (search) params.search = search;
            if (kategori) params.kategori = kategori;
            const res = await getGaleri(params);
            setGaleri(res.data?.data?.data || []);
            setMeta(res.data?.data?.meta || null);
        } catch {
            setGaleri([]);
        } finally {
            setLoading(false);
        }
    }, [page, search, kategori]);

    useEffect(() => { fetchData(); }, [fetchData]);

    const formatDate = (dateStr) => {
        if (!dateStr) return '-';
        return new Date(dateStr).toLocaleDateString('id-ID', {
            day: 'numeric', month: 'long', year: 'numeric',
        });
    };

    // Close lightbox on escape
    useEffect(() => {
        const onKeyDown = (e) => { if (e.key === 'Escape') setLightbox(null); };
        window.addEventListener('keydown', onKeyDown);
        return () => window.removeEventListener('keydown', onKeyDown);
    }, []);

    return (
        <div className="page">
            <div className="container">
                <SectionTitle
                    label="Galeri"
                    title="Galeri Foto"
                    description="Dokumentasi kegiatan dan momen-momen penting himpunan."
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
                            placeholder="Cari foto..."
                            value={search}
                            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                            style={{ paddingLeft: 40 }}
                        />
                    </div>
                    <select
                        className="filter-select"
                        value={kategori}
                        onChange={(e) => { setKategori(e.target.value); setPage(1); }}
                    >
                        <option value="">Semua Kategori</option>
                        {['Kegiatan', 'Seminar', 'Workshop', 'Lomba', 'Sosial', 'Gathering'].map(k => (
                            <option key={k} value={k}>{k}</option>
                        ))}
                    </select>
                </div>

                {loading ? (
                    <LoadingSpinner />
                ) : galeri.length > 0 ? (
                    <div className="gallery-grid">
                        {galeri.map((item, i) => (
                            <motion.div
                                key={item.id}
                                className="gallery-item"
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.05, duration: 0.4 }}
                                onClick={() => setLightbox(item)}
                            >
                                {item.foto ? (
                                    <img src={item.foto} alt={item.judul} loading="lazy" />
                                ) : (
                                    <div className="gallery-item-placeholder"><FiImage /></div>
                                )}
                                <div className="gallery-overlay">
                                    <span className="gallery-title">{item.judul}</span>
                                    <span className="gallery-category">{item.kategori} • {formatDate(item.tanggal)}</span>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    <div className="empty-state">
                        <div className="empty-icon"><FiImage /></div>
                        <p>{search || kategori ? 'Tidak ada foto yang cocok.' : 'Belum ada foto.'}</p>
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

            {/* Lightbox */}
            <AnimatePresence>
                {lightbox && (
                    <motion.div
                        className="lightbox-overlay"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setLightbox(null)}
                    >
                        <motion.div
                            className="lightbox-content"
                            initial={{ scale: 0.8 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0.8 }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <button className="lightbox-close" onClick={() => setLightbox(null)}>
                                <FiX />
                            </button>
                            {lightbox.foto && <img src={lightbox.foto} alt={lightbox.judul} />}
                            <div className="lightbox-info">
                                <h3 style={{ fontSize: 'var(--font-size-lg)', marginBottom: 4 }}>{lightbox.judul}</h3>
                                <p style={{ fontSize: 'var(--font-size-sm)', opacity: 0.7 }}>
                                    {lightbox.kategori} • {formatDate(lightbox.tanggal)}
                                </p>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
