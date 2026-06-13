import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, Clock, Share2, AlertCircle } from 'lucide-react';
import DOMPurify from 'dompurify';
import { useQuery } from '@tanstack/react-query';
import LoadingSpinner from '../components/LoadingSpinner';
import PageTransition from '../components/PageTransition';
import SEO from '../components/SEO';
import { getBeritaBySlug, getBerita } from '../api/berita';
import { formatDate, formatTime } from '../utils/format';
import useShare from '../hooks/useShare';

export default function BeritaDetailPage() {
    const { slug } = useParams();
    const share = useShare();

    const { data: berita, isLoading: loading, isError } = useQuery({
        queryKey: ['beritaDetail', slug],
        queryFn: async () => {
            const res = await getBeritaBySlug(slug);
            return res.data?.data || null;
        },
        staleTime: 5 * 60 * 1000,
    });

    const { data: relatedData } = useQuery({
        queryKey: ['beritaRelated', slug],
        queryFn: async () => {
            const res = await getBerita({ per_page: 4 });
            return res.data?.data?.data || [];
        },
        staleTime: 5 * 60 * 1000,
    });
    const relatedBerita = (relatedData || []).filter(b => b.slug !== slug).slice(0, 3);

    const error = isError ? 'Berita tidak ditemukan.' : null;

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [slug]);

    if (loading) return (
        <div className="page"><div className="container"><LoadingSpinner /></div></div>
    );

    if (error || !berita) return (
        <div className="page">
            <div className="container">
                <div className="error-container">
                    <h2><AlertCircle size={24} style={{ display: 'inline', verticalAlign: 'text-bottom', marginRight: '0.4rem' }} />{error || 'Berita tidak ditemukan'}</h2>
                    <Link to="/berita" className="btn btn-outline">← Kembali ke Berita</Link>
                </div>
            </div>
        </div>
    );

    return (
        <PageTransition>
            {berita && <SEO title={berita.judul} description={berita.isi?.substring(0, 150).replace(/<[^>]+>/g, '') + '...'} image={berita.thumbnail} type="article" />}
            <div className="detail-page">
                <div className="container">
                    <nav className="breadcrumb" aria-label="Breadcrumb" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: 'var(--spacing-md)', fontSize: 'var(--font-size-sm)', color: 'var(--color-text-muted)' }}>
                        <Link to="/" style={{ color: 'var(--color-text-secondary)' }}>Beranda</Link>
                        <span>/</span>
                        <Link to="/berita" style={{ color: 'var(--color-text-secondary)' }}>Berita</Link>
                        <span>/</span>
                        <span style={{ color: 'var(--color-text)' }}>{berita.judul}</span>
                    </nav>
                    <div className="detail-header">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                            <Link to="/berita" className="back-link" style={{ marginBottom: 0 }}>
                                <ArrowLeft size={18} style={{ marginRight: '0.5rem' }} /> Kembali ke Berita
                            </Link>
                            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
                                <button className="btn btn-outline" onClick={() => share({ title: berita?.judul || 'Berita Himpunan' })} style={{ display: 'inline-flex', padding: '0.5rem 1rem', fontSize: 'var(--font-size-sm)', gap: '0.5rem', alignItems: 'center' }}>
                                    <Share2 size={16} /> Bagikan
                                </button>
                                <a href={`https://wa.me/?text=${encodeURIComponent(berita.judul + ' ' + window.location.href)}`} target="_blank" rel="noopener noreferrer" className="btn btn-outline" style={{ display: 'inline-flex', padding: '0.5rem 0.75rem', fontSize: 'var(--font-size-sm)', gap: '0.5rem', alignItems: 'center', textDecoration: 'none' }}>
                                    WhatsApp
                                </a>
                                <a href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(berita.judul)}&url=${encodeURIComponent(window.location.href)}`} target="_blank" rel="noopener noreferrer" className="btn btn-outline" style={{ display: 'inline-flex', padding: '0.5rem 0.75rem', fontSize: 'var(--font-size-sm)', gap: '0.5rem', alignItems: 'center', textDecoration: 'none' }}>
                                    Twitter
                                </a>
                                <a href={`https://t.me/share/url?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(berita.judul)}`} target="_blank" rel="noopener noreferrer" className="btn btn-outline" style={{ display: 'inline-flex', padding: '0.5rem 0.75rem', fontSize: 'var(--font-size-sm)', gap: '0.5rem', alignItems: 'center', textDecoration: 'none' }}>
                                    Telegram
                                </a>
                            </div>
                        </div>
                        <h1>{berita.judul}</h1>
                        <div className="detail-meta">
                            <span className="meta-item">
                                <Calendar size={16} style={{ marginRight: '0.5rem' }} /> {formatDate(berita.published_at)}
                            </span>
                            <span className="meta-item">
                                <Clock size={16} style={{ marginRight: '0.5rem' }} /> {formatTime(berita.published_at)}
                            </span>
                            <span className="badge badge-success">{berita.status}</span>
                        </div>
                    </div>

                    {berita.thumbnail && (
                        <div className="detail-thumbnail">
                            <img src={berita.thumbnail} alt={berita.judul} />
                        </div>
                    )}

                    <div
                        className="detail-content"

                    >
                        <div className="prose" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(berita.isi || '') }} />
                    </div>

                    {relatedBerita.length > 0 && (
                        <div className="section" style={{ marginTop: 'var(--spacing-3xl)' }}>
                            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: 'var(--font-size-xl)', fontWeight: 700, marginBottom: 'var(--spacing-lg)' }}>Berita Terkait</h3>
                            <div className="cards-grid">
                                {relatedBerita.map(item => (
                                    <Link key={item.slug} to={`/berita/${item.slug}`} className="content-card glass-card" style={{ textDecoration: 'none', color: 'inherit' }}>
                                        {item.thumbnail && (
                                            <div className="card-thumbnail">
                                                <img src={item.thumbnail} alt={item.judul} loading="lazy" />
                                            </div>
                                        )}
                                        <div className="card-body">
                                            <h4 className="card-title">{item.judul}</h4>
                                            <p className="card-excerpt">{item.isi?.substring(0, 100).replace(/<[^>]+>/g, '')}...</p>
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
