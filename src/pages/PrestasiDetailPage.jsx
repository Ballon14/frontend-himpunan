import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, Trophy, User, Share2, AlertCircle } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import LoadingSpinner from '../components/LoadingSpinner';
import PageTransition from '../components/PageTransition';
import SEO from '../components/SEO';
import { getPrestasiById, getPrestasi } from '../api/prestasi';
import { formatDate } from '../utils/format';
import useShare from '../hooks/useShare';

export default function PrestasiDetailPage() {
    const { id } = useParams();
    const share = useShare();

    const { data: prestasi, isLoading: loading, isError } = useQuery({
        queryKey: ['prestasiDetail', id],
        queryFn: async () => {
            const res = await getPrestasiById(id);
            return res.data?.data || null;
        },
        staleTime: 5 * 60 * 1000,
    });

    const { data: relatedData } = useQuery({
        queryKey: ['prestasiRelated', id],
        queryFn: async () => {
            const res = await getPrestasi({ per_page: 4 });
            return res.data?.data?.data || [];
        },
        staleTime: 5 * 60 * 1000,
    });
    const relatedPrestasi = (relatedData || []).filter(p => p.id !== id).slice(0, 3);

    const error = isError ? 'Prestasi tidak ditemukan.' : null;

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [id]);

    if (loading) return (
        <div className="page"><div className="container"><LoadingSpinner /></div></div>
    );

    if (error || !prestasi) return (
        <div className="page">
            <div className="container">
                <div className="error-container">
                    <h2><AlertCircle size={24} style={{ display: 'inline', verticalAlign: 'text-bottom', marginRight: '0.4rem' }} />{error || 'Prestasi tidak ditemukan'}</h2>
                    <Link to="/prestasi" className="btn btn-outline">Kembali ke Prestasi</Link>
                </div>
            </div>
        </div>
    );

    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'CreativeWork',
        name: prestasi.judul,
        description: prestasi.deskripsi || prestasi.judul,
        image: prestasi.foto || undefined,
        datePublished: prestasi.tanggal,
        author: prestasi.penerima
            ? { '@type': 'Person', name: prestasi.penerima }
            : undefined,
        url: `${window.location.origin}/prestasi/${prestasi.id}`,
    };

    return (
        <PageTransition>
            <SEO
                title={prestasi.judul}
                description={prestasi.deskripsi ? prestasi.deskripsi.substring(0, 150) + '...' : `Prestasi ${prestasi.judul} oleh ${prestasi.penerima || 'HMTKBG'}`}
                image={prestasi.foto}
                type="article"
                jsonLd={jsonLd}
            />
            <div className="detail-page">
                <div className="container" style={{ maxWidth: 800 }}>
                    <nav className="breadcrumb" aria-label="Breadcrumb" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: 'var(--spacing-md)', fontSize: 'var(--font-size-sm)', color: 'var(--color-text-muted)' }}>
                        <Link to="/" style={{ color: 'var(--color-text-secondary)' }}>Beranda</Link>
                        <span>/</span>
                        <Link to="/prestasi" style={{ color: 'var(--color-text-secondary)' }}>Prestasi</Link>
                        <span>/</span>
                        <span style={{ color: 'var(--color-text)' }}>{prestasi.judul}</span>
                    </nav>

                    <div className="detail-header" style={{ textAlign: 'center', marginBottom: 'var(--spacing-3xl)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--spacing-lg)', alignItems: 'center' }}>
                            <Link to="/prestasi" className="back-link btn-outline" style={{ display: 'inline-flex', padding: '0.5rem 1rem', fontSize: 'var(--font-size-sm)', gap: '0.5rem', alignItems: 'center', textDecoration: 'none', marginBottom: 0 }}>
                                <ArrowLeft size={18} /> Kembali
                            </Link>
                            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
                                <button className="btn btn-outline" onClick={() => share({ title: prestasi?.judul || 'Prestasi HMTKBG' })} style={{ display: 'inline-flex', padding: '0.5rem 1rem', fontSize: 'var(--font-size-sm)', gap: '0.5rem', alignItems: 'center' }}>
                                    <Share2 size={16} /> Bagikan
                                </button>
                                <a href={`https://wa.me/?text=${encodeURIComponent(prestasi.judul + ' ' + window.location.href)}`} target="_blank" rel="noopener noreferrer" className="btn btn-outline" style={{ display: 'inline-flex', padding: '0.5rem 0.75rem', fontSize: 'var(--font-size-sm)', gap: '0.5rem', alignItems: 'center', textDecoration: 'none' }}>
                                    WhatsApp
                                </a>
                                <a href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(prestasi.judul)}&url=${encodeURIComponent(window.location.href)}`} target="_blank" rel="noopener noreferrer" className="btn btn-outline" style={{ display: 'inline-flex', padding: '0.5rem 0.75rem', fontSize: 'var(--font-size-sm)', gap: '0.5rem', alignItems: 'center', textDecoration: 'none' }}>
                                    Twitter
                                </a>
                                <a href={`https://t.me/share/url?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(prestasi.judul)}`} target="_blank" rel="noopener noreferrer" className="btn btn-outline" style={{ display: 'inline-flex', padding: '0.5rem 0.75rem', fontSize: 'var(--font-size-sm)', gap: '0.5rem', alignItems: 'center', textDecoration: 'none' }}>
                                    Telegram
                                </a>
                            </div>
                        </div>

                        <span className="badge badge-success" style={{ display: 'inline-block', marginBottom: 'var(--spacing-md)', textTransform: 'capitalize' }}>{prestasi.kategori}</span>
                        <h1 style={{ fontSize: 'var(--font-size-3xl)', marginBottom: 'var(--spacing-md)', fontFamily: 'Comfortaa, sans-serif' }}>{prestasi.judul}</h1>

                        <div className="detail-meta" style={{ justifyContent: 'center', opacity: 0.8, flexWrap: 'wrap', gap: '1rem' }}>
                            <span className="meta-item">
                                <Calendar size={16} style={{ marginRight: '0.5rem' }} /> {formatDate(prestasi.tanggal)}
                            </span>
                            {prestasi.penerima && (
                                <span className="meta-item">
                                    <User size={16} style={{ marginRight: '0.5rem' }} /> {prestasi.penerima}
                                </span>
                            )}
                        </div>
                    </div>

                    {prestasi.foto ? (
                        <motion.div
                            className="detail-thumbnail"
                            style={{ borderRadius: 'var(--radius-lg)', overflow: 'hidden', boxShadow: '0 20px 60px rgba(0,0,0,0.3)', marginBottom: 'var(--spacing-2xl)', maxHeight: '500px' }}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            <img src={prestasi.foto} alt={prestasi.judul} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </motion.div>
                    ) : (
                        <div style={{ height: 300, background: 'linear-gradient(135deg, rgba(192,57,43,0.15), rgba(230,126,34,0.1))', borderRadius: 'var(--radius-lg)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-text-muted)', marginBottom: 'var(--spacing-2xl)' }}>
                            <Trophy size={64} />
                        </div>
                    )}

                    {prestasi.deskripsi && (
                        <div
                            className="detail-content glass-card"
                            style={{ padding: 'var(--spacing-2xl)', lineHeight: 1.8, fontSize: 'var(--font-size-md)' }}
                        >
                            <h3 style={{ marginBottom: 'var(--spacing-md)', fontFamily: 'Comfortaa, sans-serif' }}>Deskripsi</h3>
                            <p style={{ color: 'var(--color-text-secondary)', whiteSpace: 'pre-wrap' }}>{prestasi.deskripsi}</p>
                        </div>
                    )}

                    {relatedPrestasi.length > 0 && (
                        <div className="section" style={{ marginTop: 'var(--spacing-3xl)' }}>
                            <h3 style={{ fontFamily: 'Comfortaa, sans-serif', fontSize: 'var(--font-size-xl)', fontWeight: 700, marginBottom: 'var(--spacing-lg)' }}>Prestasi Lainnya</h3>
                            <div className="cards-grid">
                                {relatedPrestasi.map(item => (
                                    <Link key={item.id} to={`/prestasi/${item.id}`} className="prestasi-card-link">
                                    <div className="card">
                                        <div style={{ position: 'relative', aspectRatio: '16/10', overflow: 'hidden' }}>
                                            {item.foto ? (
                                                <img src={item.foto} alt={item.judul} loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                            ) : (
                                                <div style={{
                                                    width: '100%', height: '100%',
                                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                    background: 'linear-gradient(135deg, rgba(192,57,43,0.15), rgba(230,126,34,0.1))',
                                                    color: 'var(--color-text-muted)',
                                                }}>
                                                    <Trophy size={32} />
                                                </div>
                                            )}
                                            <div style={{
                                                position: 'absolute', top: 12, right: 12,
                                                background: 'rgba(0,0,0,0.65)',
                                                padding: '4px 10px', borderRadius: '20px',
                                                fontSize: '0.75rem', fontWeight: 600, color: '#fff',
                                                textTransform: 'capitalize',
                                            }}>
                                                {item.kategori}
                                            </div>
                                        </div>
                                        <div style={{ padding: '1rem' }}>
                                            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.25rem', fontFamily: 'Comfortaa, sans-serif' }}>{item.judul}</h4>
                                            <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: 4 }}>
                                                <Calendar size={12} /> {formatDate(item.tanggal)}
                                            </span>
                                        </div>
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
