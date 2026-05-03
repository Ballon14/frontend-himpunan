import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Image as ImageIcon, X as XIcon, Share2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { useQuery } from '@tanstack/react-query';
import SectionTitle from '../components/SectionTitle';
import LoadingSpinner from '../components/LoadingSpinner';
import PageTransition from '../components/PageTransition';
import SEO from '../components/SEO';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import { getGaleri } from '../api/galeri';
import { formatDate } from '../utils/format';

export default function GaleriPage() {
    const [search, setSearch] = useState('');
    const [kategori, setKategori] = useState('');
    const [page, setPage] = useState(1);

    const { data, isLoading: loading } = useQuery({
        queryKey: ['galeri', { page, search, kategori }],
        queryFn: async () => {
            const params = { page, per_page: 12 };
            if (search) params.search = search;
            if (kategori) params.kategori = kategori;
            const res = await getGaleri(params);
            return res.data?.data || { data: [], meta: null };
        },
        staleTime: 5 * 60 * 1000,
    });

    const galeri = data?.data || [];
    const meta = data?.meta || null;

    const handleShare = async (item) => {
        const url = item.foto;
        const title = item.judul || 'Galeri Himpunan';
        if (navigator.share) {
            try {
                await navigator.share({ title, url });
            } catch (error) {
                console.error('Share error:', error);
            }
        } else {
            await navigator.clipboard.writeText(url);
            toast.success('Link foto disalin ke clipboard!');
        }
    };

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

                    {loading ? (
                        <LoadingSpinner />
                    ) : galeri.length > 0 ? (
                        <div className="gallery-grid">
                            {galeri.map((item, i) => (
                                <motion.div
                                    key={item.id}
                                    className="gallery-item"

                                    whileHover={{ scale: 1.03, boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)' }}
                                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                                    onClick={() => openLightbox(i)}
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
                            {Array.from({ length: meta.last_page }, (_, i) => i + 1).map(p => (
                                <button key={p} className={page === p ? 'active' : ''} onClick={() => setPage(p)}>{p}</button>
                            ))}
                            <button onClick={() => setPage(p => Math.min(meta.last_page, p + 1))} disabled={page >= meta.last_page}>Next →</button>
                        </div>
                    )}
                </div>

                {/* Lightbox Slider */}
                <AnimatePresence>
                    {lightboxIndex >= 0 && galeri[lightboxIndex] && (
                        <motion.div
                            className="lightbox-overlay"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={closeLightbox}
                        >
                            {/* Prev Button */}
                            {galeri.length > 1 && (
                                <motion.button
                                    className="lightbox-nav-btn prev"
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
                                    <button className="lightbox-action-btn" onClick={() => handleShare(galeri[lightboxIndex])}>
                                        <Share2 size={24} />
                                    </button>
                                    <button className="lightbox-action-btn" onClick={closeLightbox}>
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
