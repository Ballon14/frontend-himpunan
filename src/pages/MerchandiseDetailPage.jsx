import { useEffect, useState, useRef, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ShoppingBag, Tag, CheckCircle, XCircle, Share2, MessageCircle, Phone, ZoomIn, ChevronLeft, ChevronRight, X, Package, Calendar, Eye, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';
import LoadingSpinner from '../components/LoadingSpinner';
import PageTransition from '../components/PageTransition';
import SEO from '../components/SEO';
import { getMerchandiseById, getMerchandise } from '../api/komunitas';

function formatRupiah(num) {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(num);
}



export default function MerchandiseDetailPage() {
    const { id } = useParams();
    const [item, setItem] = useState(null);
    const [related, setRelated] = useState([]);
    const [recommendations, setRecommendations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Gallery state
    const [activeIndex, setActiveIndex] = useState(0);
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [isZoomed, setIsZoomed] = useState(false);
    const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 });
    const [imgError, setImgError] = useState(false);
    const mainImageRef = useRef(null);

    useEffect(() => {
        const fetchDetail = async () => {
            setLoading(true);
            setError(null);
            try {
                const res = await getMerchandiseById(id);
                const data = res.data?.data || null;
                setItem(data);

                if (data?.kategori) {
                    try {
                        const relRes = await getMerchandise({ kategori: data.kategori, per_page: 5 });
                        const relItems = (relRes.data?.data?.data || []).filter(r => r.id !== data.id).slice(0, 4);
                        setRelated(relItems);
                    } catch { setRelated([]); }
                }

                // Fetch recommendations from all categories
                try {
                    const recRes = await getMerchandise({ per_page: 12 });
                    const allItems = recRes.data?.data?.data || [];
                    const recItems = allItems.filter(r => r.id !== data?.id).slice(0, 8);
                    setRecommendations(recItems);
                } catch { setRecommendations([]); }
            } catch {
                setError('Merchandise tidak ditemukan.');
            } finally {
                setLoading(false);
            }
        };
        fetchDetail();
        setActiveIndex(0);
        setImgError(false);
        window.scrollTo(0, 0);
    }, [id]);

    let galleryViews = [];
    if (item?.foto && Array.isArray(item.foto)) {
        galleryViews = item.foto.map((url, i) => ({
            id: `view-${i}`, url, label: `Tampilan ${i + 1}`, objectPosition: 'center center'
        }));
    } else if (item?.foto) {
        galleryViews = [{ id: 'main', url: item.foto, label: 'Tampak Utama', objectPosition: 'center center' }];
    }

    const handleShare = async () => {
        const url = window.location.href;
        const title = item?.nama || 'Merchandise Himpunan';
        if (navigator.share) {
            try { await navigator.share({ title, url }); }
            catch (err) { if (err.name !== 'AbortError') console.error('Share error:', err); }
        } else {
            await navigator.clipboard.writeText(url);
            toast.success('Link disalin ke clipboard!');
        }
    };

    const handleMouseMove = useCallback((e) => {
        if (!mainImageRef.current) return;
        const rect = mainImageRef.current.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        setZoomPos({ x: Math.max(0, Math.min(100, x)), y: Math.max(0, Math.min(100, y)) });
    }, []);

    const navigateGallery = (dir) => {
        setActiveIndex(prev => {
            const next = prev + dir;
            if (next < 0) return galleryViews.length - 1;
            if (next >= galleryViews.length) return 0;
            return next;
        });
    };

    if (loading) return (
        <div className="page"><div className="container"><LoadingSpinner /></div></div>
    );

    if (error || !item) return (
        <div className="page">
            <div className="container">
                <div className="error-container">
                    <h2>😕 {error || 'Merchandise tidak ditemukan'}</h2>
                    <Link to="/komunitas" className="btn btn-outline">← Kembali ke Komunitas</Link>
                </div>
            </div>
        </div>
    );

    const currentView = galleryViews[activeIndex] || null;

    return (
        <PageTransition>
            <SEO title={item.nama} description={item.deskripsi?.substring(0, 150) || `Merchandise resmi himpunan - ${item.nama}`} image={item.foto} />
            <div className="page merch-detail-page">
                <div className="container">

                    {/* Breadcrumb Navigation */}
                    <nav className="merch-breadcrumb" data-aos="fade-down">
                        <Link to="/" className="merch-breadcrumb-link">Beranda</Link>
                        <span className="merch-breadcrumb-sep">/</span>
                        <Link to="/komunitas" className="merch-breadcrumb-link">Komunitas</Link>
                        <span className="merch-breadcrumb-sep">/</span>
                        <span className="merch-breadcrumb-current">{item.nama}</span>
                    </nav>

                    {/* Main Product Layout */}
                    <div className="merch-detail-layout" data-aos="fade-up">

                        {/* === Gallery Section === */}
                        <div className="merch-gallery-section">
                            {/* Main Image Display */}
                            <div className="merch-gallery-main-wrapper">
                                {item.foto && !imgError ? (
                                    <>
                                        <motion.div
                                            className={`merch-gallery-main ${isZoomed ? 'zoomed' : ''}`}
                                            ref={mainImageRef}
                                            onMouseEnter={() => setIsZoomed(true)}
                                            onMouseLeave={() => setIsZoomed(false)}
                                            onMouseMove={handleMouseMove}
                                            onClick={() => setLightboxOpen(true)}
                                            key={activeIndex}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{ duration: 0.3 }}
                                        >
                                            <img
                                                src={currentView?.url}
                                                alt={`${item.nama} - ${currentView?.label}`}
                                                onError={() => setImgError(true)}
                                                style={{
                                                    objectPosition: currentView?.objectPosition,
                                                    ...(isZoomed ? {
                                                        transform: 'scale(1.8)',
                                                        transformOrigin: `${zoomPos.x}% ${zoomPos.y}%`
                                                    } : {})
                                                }}
                                            />
                                            <div className="merch-gallery-zoom-hint">
                                                <ZoomIn size={16} />
                                                <span>Hover untuk zoom • Klik untuk fullscreen</span>
                                            </div>
                                        </motion.div>

                                        {/* Gallery Navigation Arrows */}
                                        {galleryViews.length > 1 && (
                                            <>
                                                <button className="merch-gallery-arrow merch-gallery-arrow-left" onClick={(e) => { e.stopPropagation(); navigateGallery(-1); }}>
                                                    <ChevronLeft size={20} />
                                                </button>
                                                <button className="merch-gallery-arrow merch-gallery-arrow-right" onClick={(e) => { e.stopPropagation(); navigateGallery(1); }}>
                                                    <ChevronRight size={20} />
                                                </button>
                                            </>
                                        )}

                                        {/* Share Button (floating top right) */}
                                        <button className="merch-gallery-share" onClick={handleShare} title="Bagikan">
                                            <Share2 size={18} />
                                        </button>
                                    </>
                                ) : (
                                    <div className="merch-detail-placeholder">
                                        <ShoppingBag size={80} />
                                        <span>Foto belum tersedia</span>
                                    </div>
                                )}
                            </div>

                            {/* Thumbnail Strip */}
                            {galleryViews.length > 1 && !imgError && (
                                <div className="merch-gallery-thumbs">
                                    {galleryViews.map((view, i) => (
                                        <button
                                            key={view.id}
                                            className={`merch-gallery-thumb ${i === activeIndex ? 'active' : ''}`}
                                            onClick={() => setActiveIndex(i)}
                                            title={view.label}
                                        >
                                            <img
                                                src={view.url}
                                                alt={view.label}
                                                style={{ objectPosition: view.objectPosition }}
                                            />
                                            {i === activeIndex && (
                                                <motion.div className="merch-thumb-indicator" layoutId="thumbIndicator" />
                                            )}
                                        </button>
                                    ))}
                                </div>
                            )}

                            {/* Image Counter */}
                            {galleryViews.length > 1 && !imgError && (
                                <div className="merch-gallery-counter">
                                    <Eye size={14} />
                                    <span>{activeIndex + 1} / {galleryViews.length} — {currentView?.label}</span>
                                </div>
                            )}
                        </div>

                        {/* === Info Section === */}
                        <div className="merch-detail-info">
                            {/* Category Badge */}
                            <span className="merch-detail-kategori">
                                <Tag size={14} /> {item.kategori.charAt(0).toUpperCase() + item.kategori.slice(1)}
                            </span>

                            {/* Title */}
                            <h1 className="merch-detail-title">{item.nama}</h1>

                            {/* Price + Status */}
                            <div className="merch-detail-price-block">
                                <span className="merch-detail-price">{formatRupiah(item.harga)}</span>
                                <span className={`merch-detail-status ${item.is_available ? 'available' : 'unavailable'}`}>
                                    {item.is_available ? <><CheckCircle size={16} /> Tersedia</> : <><XCircle size={16} /> Stok Habis</>}
                                </span>
                            </div>

                            {/* Divider */}
                            <div className="merch-detail-divider" />

                            {/* Description */}
                            {item.deskripsi && (
                                <div className="merch-detail-desc">
                                    <h3>Deskripsi Produk</h3>
                                    <p>{item.deskripsi}</p>
                                </div>
                            )}

                            {/* Product Specs */}
                            <div className="merch-detail-specs">
                                <h3>Informasi Produk</h3>
                                <div className="merch-spec-grid">
                                    <div className="merch-spec-item">
                                        <div className="merch-spec-icon"><Tag size={16} /></div>
                                        <div>
                                            <span className="merch-spec-label">Kategori</span>
                                            <span className="merch-spec-value">{item.kategori.charAt(0).toUpperCase() + item.kategori.slice(1)}</span>
                                        </div>
                                    </div>
                                    <div className="merch-spec-item">
                                        <div className="merch-spec-icon"><Package size={16} /></div>
                                        <div>
                                            <span className="merch-spec-label">Status</span>
                                            <span className="merch-spec-value">{item.is_available ? 'Tersedia' : 'Habis'}</span>
                                        </div>
                                    </div>
                                    <div className="merch-spec-item">
                                        <div className="merch-spec-icon"><ShoppingBag size={16} /></div>
                                        <div>
                                            <span className="merch-spec-label">Harga</span>
                                            <span className="merch-spec-value">{formatRupiah(item.harga)}</span>
                                        </div>
                                    </div>
                                    <div className="merch-spec-item">
                                        <div className="merch-spec-icon"><Calendar size={16} /></div>
                                        <div>
                                            <span className="merch-spec-label">Ditambahkan</span>
                                            <span className="merch-spec-value">
                                                {item.created_at ? new Date(item.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : '-'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* WhatsApp CTA */}
                            <div className="merch-detail-cta">
                                <div className="merch-cta-content">
                                    <div className="merch-wa-cta-icon">
                                        <MessageCircle size={24} />
                                    </div>
                                    <div className="merch-cta-text">
                                        <h3>Tertarik? Pesan Sekarang</h3>
                                        <p>Hubungi kami langsung via WhatsApp untuk pemesanan <strong>{item.nama}</strong>.</p>
                                    </div>
                                </div>
                                <a
                                    href={`https://wa.me/6281515630448?text=${encodeURIComponent(`Halo Admin HMTKBG, saya tertarik dengan merchandise "${item.nama}" (${formatRupiah(item.harga)}). Apakah masih tersedia?`)}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="btn btn-primary merch-contact-btn merch-wa-detail-btn"
                                >
                                    <Phone size={18} />
                                    Hubungi via WhatsApp
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Related Items (Same Category) */}
                    {related.length > 0 && (
                        <div className="merch-related" data-aos="fade-up">
                            <h2 className="merch-related-title">Merchandise Lainnya</h2>
                            <div className="merch-related-grid">
                                {related.map((rel, i) => (
                                    <Link key={rel.id} to={`/komunitas/merchandise/${rel.id}`} className="merch-related-card" data-aos="zoom-in" data-aos-delay={i * 80}>
                                        <div className="merch-related-img">
                                            {rel.foto ? (
                                                <img src={rel.foto} alt={rel.nama} loading="lazy" />
                                            ) : (
                                                <div className="merch-card-img-placeholder"><ShoppingBag size={28} /></div>
                                            )}
                                        </div>
                                        <div className="merch-related-body">
                                            <h4>{rel.nama}</h4>
                                            <span className="merch-price">{formatRupiah(rel.harga)}</span>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Recommendations Section */}
                    {recommendations.length > 0 && (
                        <div className="merch-recommendations" data-aos="fade-up">
                            <div className="merch-rec-header">
                                <div className="merch-rec-header-left">
                                    <Sparkles size={20} className="merch-rec-icon" />
                                    <h2 className="merch-rec-title">Rekomendasi Untukmu</h2>
                                </div>
                                <Link to="/komunitas" className="merch-rec-see-all">
                                    Lihat Semua <ChevronRight size={16} />
                                </Link>
                            </div>
                            <div className="merch-rec-grid">
                                {recommendations.map((rec, i) => (
                                    <Link
                                        key={rec.id}
                                        to={`/komunitas/merchandise/${rec.id}`}
                                        className="merch-rec-card"
                                        data-aos="fade-up"
                                        data-aos-delay={i * 60}
                                    >
                                        <div className="merch-rec-card-img">
                                            {rec.foto ? (
                                                <img src={rec.foto} alt={rec.nama} loading="lazy" />
                                            ) : (
                                                <div className="merch-card-img-placeholder"><ShoppingBag size={32} /></div>
                                            )}
                                            <span className={`merch-rec-badge ${rec.is_available ? 'available' : 'unavailable'}`}>
                                                {rec.is_available ? 'Tersedia' : 'Habis'}
                                            </span>
                                        </div>
                                        <div className="merch-rec-card-body">
                                            <span className="merch-rec-kategori">{rec.kategori}</span>
                                            <h4 className="merch-rec-nama">{rec.nama}</h4>
                                            <span className="merch-rec-harga">{formatRupiah(rec.harga)}</span>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Lightbox Modal */}
            <AnimatePresence>
                {lightboxOpen && item.foto && (
                    <motion.div
                        className="merch-lightbox-overlay"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setLightboxOpen(false)}
                    >
                        <motion.div
                            className="merch-lightbox-content"
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <button className="merch-lightbox-close" onClick={() => setLightboxOpen(false)}>
                                <X size={24} />
                            </button>

                            <img
                                src={currentView?.url}
                                alt={`${item.nama} - ${currentView?.label}`}
                                className="merch-lightbox-img"
                                style={{ objectPosition: currentView?.objectPosition }}
                            />

                            {/* Lightbox Navigation */}
                            {galleryViews.length > 1 && (
                                <>
                                    <button className="merch-lightbox-nav merch-lightbox-prev" onClick={() => navigateGallery(-1)}>
                                        <ChevronLeft size={28} />
                                    </button>
                                    <button className="merch-lightbox-nav merch-lightbox-next" onClick={() => navigateGallery(1)}>
                                        <ChevronRight size={28} />
                                    </button>
                                </>
                            )}

                            {/* Lightbox Thumbstrip */}
                            <div className="merch-lightbox-thumbstrip">
                                {galleryViews.map((view, i) => (
                                    <button
                                        key={view.id}
                                        className={`merch-lightbox-thumb ${i === activeIndex ? 'active' : ''}`}
                                        onClick={() => setActiveIndex(i)}
                                    >
                                        <img src={view.url} alt={view.label} style={{ objectPosition: view.objectPosition }} />
                                    </button>
                                ))}
                            </div>

                            <div className="merch-lightbox-caption">
                                {currentView?.label} — {activeIndex + 1}/{galleryViews.length}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </PageTransition>
    );
}
