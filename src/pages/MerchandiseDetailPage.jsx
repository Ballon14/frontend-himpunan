import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, ShoppingBag, Tag, CheckCircle, XCircle, Share2 } from 'lucide-react';
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
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchDetail = async () => {
            setLoading(true);
            setError(null);
            try {
                const res = await getMerchandiseById(id);
                const data = res.data?.data || null;
                setItem(data);

                // Fetch related items from the same category
                if (data?.kategori) {
                    try {
                        const relRes = await getMerchandise({ kategori: data.kategori, per_page: 5 });
                        const relItems = (relRes.data?.data?.data || []).filter(r => r.id !== data.id).slice(0, 4);
                        setRelated(relItems);
                    } catch { setRelated([]); }
                }
            } catch {
                setError('Merchandise tidak ditemukan.');
            } finally {
                setLoading(false);
            }
        };
        fetchDetail();
        window.scrollTo(0, 0);
    }, [id]);

    const handleShare = async () => {
        const url = window.location.href;
        const title = item?.nama || 'Merchandise Himpunan';
        if (navigator.share) {
            try { await navigator.share({ title, url }); }
            catch (err) { console.error('Share error:', err); }
        } else {
            await navigator.clipboard.writeText(url);
            toast.success('Link disalin ke clipboard!');
        }
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

    return (
        <PageTransition>
            <SEO title={item.nama} description={item.deskripsi?.substring(0, 150) || `Merchandise resmi himpunan - ${item.nama}`} image={item.foto} />
            <div className="page">
                <div className="container">

                    {/* Back + Share */}
                    <div className="merch-detail-topbar" data-aos="fade-down">
                        <Link to="/komunitas" className="back-link">
                            <ArrowLeft size={18} /> Kembali ke Komunitas
                        </Link>
                        <button className="btn btn-outline merch-share-btn" onClick={handleShare}>
                            <Share2 size={16} /> Bagikan
                        </button>
                    </div>

                    {/* Main Product Layout */}
                    <div className="merch-detail-layout" data-aos="fade-up">
                        {/* Image Section */}
                        <div className="merch-detail-image">
                            {item.foto ? (
                                <motion.img
                                    src={item.foto}
                                    alt={item.nama}
                                    initial={{ opacity: 0, scale: 0.98 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.4 }}
                                />
                            ) : (
                                <div className="merch-detail-placeholder">
                                    <ShoppingBag size={80} />
                                    <span>Foto belum tersedia</span>
                                </div>
                            )}
                        </div>

                        {/* Info Section */}
                        <div className="merch-detail-info">
                            <span className="merch-detail-kategori">
                                <Tag size={14} /> {item.kategori.charAt(0).toUpperCase() + item.kategori.slice(1)}
                            </span>

                            <h1 className="merch-detail-title">{item.nama}</h1>

                            <div className="merch-detail-price-row">
                                <span className="merch-detail-price">{formatRupiah(item.harga)}</span>
                                <span className={`merch-detail-status ${item.is_available ? 'available' : 'unavailable'}`}>
                                    {item.is_available ? <><CheckCircle size={16} /> Tersedia</> : <><XCircle size={16} /> Stok Habis</>}
                                </span>
                            </div>

                            {item.deskripsi && (
                                <div className="merch-detail-desc">
                                    <h3>Deskripsi</h3>
                                    <p>{item.deskripsi}</p>
                                </div>
                            )}

                            <div className="merch-detail-specs">
                                <h3>Informasi Produk</h3>
                                <div className="merch-spec-grid">
                                    <div className="merch-spec-item">
                                        <span className="merch-spec-label">Kategori</span>
                                        <span className="merch-spec-value">{item.kategori.charAt(0).toUpperCase() + item.kategori.slice(1)}</span>
                                    </div>
                                    <div className="merch-spec-item">
                                        <span className="merch-spec-label">Status</span>
                                        <span className="merch-spec-value">{item.is_available ? 'Tersedia' : 'Habis'}</span>
                                    </div>
                                    <div className="merch-spec-item">
                                        <span className="merch-spec-label">Harga</span>
                                        <span className="merch-spec-value">{formatRupiah(item.harga)}</span>
                                    </div>
                                    <div className="merch-spec-item">
                                        <span className="merch-spec-label">Ditambahkan</span>
                                        <span className="merch-spec-value">
                                            {item.created_at ? new Date(item.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : '-'}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="merch-detail-cta">
                                <p>Tertarik dengan produk ini? Hubungi admin kami untuk informasi pemesanan lebih lanjut.</p>
                                <Link to="/kontak" className="btn btn-primary merch-contact-btn">
                                    Hubungi Kami
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Related Items */}
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
                </div>
            </div>
        </PageTransition>
    );
}
