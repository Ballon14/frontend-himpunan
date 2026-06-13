import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Image as ImageIcon, X as XIcon, Share2 } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import SectionTitle from '../components/SectionTitle';
import { SkeletonCard } from '../components/Skeleton';
import PageTransition from '../components/PageTransition';
import SEO from '../components/SEO';
import useDebounce from '../hooks/useDebounce';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import { getGaleri } from '../api/galeri';
import { formatDate } from '../utils/format';
import useShare from '../hooks/useShare';

export default function GaleriPage() {
    const share = useShare();
    const [search, setSearch] = useState('');
    const [kategori, setKategori] = useState('');
    const [page, setPage] = useState(1);
    const debouncedSearch = useDebounce(search);

    const { data, isLoading: loading, isError, error, refetch } = useQuery({
        queryKey: ['galeri', { page, debouncedSearch, kategori }],
        queryFn: async () => {
            const params = { page, per_page: 12 };
            if (debouncedSearch) params.search = debouncedSearch;
            if (kategori) params.kategori = kategori;
            const res = await getGaleri(params);
            return res.data?.data || { data: [], meta: null };
        },
        staleTime: 5 * 60 * 1000,
    });

    const galeri = data?.data || [];
    const meta = data?.meta || null;

    // Lightbox Navigation Logic
    const [lightboxIndex, setLightboxIndex] = useState(-1);

    const openLightbox = (index) => setLightboxIndex(index);
    const closeLightbox = () => setLightboxIndex(-1);

    const goToPrev = useCallback(() => {
        setLightboxIndex((prev) => (prev > 0 ? prev - 1 : galeri.length - 1));
    }, [galeri.length]);

    const goToNext = useCallback(() => {
        setLightboxIndex((prev) => (prev < galeri.length - 1 ? prev + 1 : 0));
    }, [galeri.length]);

    // Keyboard navigation
    useEffect(() => {
        const onKeyDown = (e) => {
            if (lightboxIndex === -1) return;
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowLeft') goToPrev();
            if (e.key === 'ArrowRight') goToNext();
        };
        window.addEventListener('keydown', onKeyDown);
        return () => window.removeEventListener('keydown', onKeyDown);
    }, [lightboxIndex, goToPrev, goToNext]);

    return (
        <PageTransition>
            <SEO title="Galeri" description="Dokumentasi kegiatan dan momen-momen penting himpunan." />
            <div className="page">
                <div className="container">
                    <div>
                        <SectionTitle
                            label="Galeri"
                            title="Galeri Foto"
                            description="Dokumentasi kegiatan dan momen-momen penting himpunan."
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

                    {isError ? (
                        <div className="error-container" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
                            <h2>Terjadi Kesalahan</h2>
                            <p style={{ color: 'var(--color-text-secondary)', marginBottom: '1.5rem' }}>
                                Gagal memuat data. Silakan coba lagi.
                            </p>
                            <button className="btn btn-primary" onClick={() => refetch()}>
                                Coba Lagi
                            </button>
                        </div>
                    ) : loading ? (
                        <div className="cards-grid">
                            {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
                        </div>
                    ) : galeri.length > 0 ? (
                        <div className="gallery-grid">
                            {galeri.map((item, i) => (
                                <motion.div
                                    key={item.id}
                                    className="gallery-item"
                                    tabIndex={0}
                                    role="button"
                                    whileHover={{ scale: 1.03, boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)' }}
                                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                                    onClick={() => openLightbox(i)}
                                    onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openLightbox(i); } }}
                                >
                                    {item.foto ? (
                                        <LazyLoadImage
                                            src={item.foto}
                                            alt={item.judul}
                                            effect="blur"
                                            wrapperProps={{ style: { display: 'block', width: '100%', height: '100%' } }}
                                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                        />
                                    ) : (
                                        <div className="gallery-item-placeholder"><ImageIcon size={48} /></div>
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
                            <div className="empty-icon"><ImageIcon size={48} /></div>
                            <p>{search || kategori ? 'Tidak ada foto yang cocok.' : 'Belum ada foto.'}</p>
                        </div>
                    )}

                    {meta && meta.last_page > 1 && (
                        <div className="pagination">
                            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page <= 1}>← Prev</button>
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
                            <button onClick={() => setPage(p => Math.min(meta.last_page, p + 1))} disabled={page >= meta.last_page}>Next →</button>
                        </div>
                    )}
                </div>

                {/* Lightbox Slider */}
                <AnimatePresence>
                    {lightboxIndex >= 0 && galeri[lightboxIndex] && (
                        <motion.div
                            className="lightbox-overlay"
                            role="dialog"
                            aria-modal="true"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={closeLightbox}
                        >
                            {/* Prev Button */}
                            {galeri.length > 1 && (
                                <motion.button
                                    className="lightbox-nav-btn prev"
                                    aria-label="Sebelumnya"
                                    onClick={(e) => { e.stopPropagation(); goToPrev(); }}
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                >
                                    ←
                                </motion.button>
                            )}

                            <motion.div
                                className="lightbox-content"
                                key={`lightbox-${lightboxIndex}`} // forces re-render/animation on slide change
                                initial={{ opacity: 0, x: 50, scale: 0.95 }}
                                animate={{ opacity: 1, x: 0, scale: 1 }}
                                exit={{ opacity: 0, x: -50, scale: 0.95 }}
                                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                                onClick={(e) => e.stopPropagation()}
                            >
                                <div className="lightbox-actions">
                                    <button className="lightbox-action-btn" aria-label="Bagikan" onClick={() => share({ title: galeri[lightboxIndex]?.judul || 'Galeri Himpunan', url: galeri[lightboxIndex]?.foto })}>
                                        <Share2 size={24} />
                                    </button>
                                    <button className="lightbox-action-btn" aria-label="Tutup" onClick={closeLightbox}>
                                        <XIcon size={24} />
                                    </button>
                                </div>

                                {galeri[lightboxIndex].foto && (
                                    <img
                                        src={galeri[lightboxIndex].foto}
                                        alt={galeri[lightboxIndex].judul}
                                    />
                                )}

                                <div className="lightbox-info">
                                    <h3>{galeri[lightboxIndex].judul}</h3>
                                    <p>
                                        {galeri[lightboxIndex].kategori} • {formatDate(galeri[lightboxIndex].tanggal)}
                                        <span className="lightbox-counter">{lightboxIndex + 1} / {galeri.length}</span>
                                    </p>
                                </div>
                            </motion.div>

                            {/* Next Button */}
                            {galeri.length > 1 && (
                                <motion.button
                                    className="lightbox-nav-btn next"
                                    aria-label="Selanjutnya"
                                    onClick={(e) => { e.stopPropagation(); goToNext(); }}
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                >
                                    →
                                </motion.button>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </PageTransition>
    );
}
