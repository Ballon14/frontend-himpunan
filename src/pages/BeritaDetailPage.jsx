import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, Clock, Share2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { useQuery } from '@tanstack/react-query';
import LoadingSpinner from '../components/LoadingSpinner';
import PageTransition from '../components/PageTransition';
import SEO from '../components/SEO';
import { getBeritaBySlug } from '../api/berita';
import { formatDate, formatTime } from '../utils/format';

export default function BeritaDetailPage() {
    const { slug } = useParams();

    const { data: berita, isLoading: loading, isError } = useQuery({
        queryKey: ['beritaDetail', slug],
        queryFn: async () => {
            const res = await getBeritaBySlug(slug);
            return res.data?.data || null;
        },
        staleTime: 5 * 60 * 1000,
    });

    const error = isError ? 'Berita tidak ditemukan.' : null;

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [slug]);

    const handleShare = async () => {
        const url = window.location.href;
        const title = berita?.judul || 'Berita Himpunan';
        if (navigator.share) {
            try {
                await navigator.share({ title, url });
            } catch (error) {
                console.error('Share error:', error);
            }
        } else {
            await navigator.clipboard.writeText(url);
            toast.success('Link berita disalin ke clipboard!');
        }
    };

    if (loading) return (
        <div className="page"><div className="container"><LoadingSpinner /></div></div>
    );

    if (error || !berita) return (
        <div className="page">
            <div className="container">
                <div className="error-container">
                    <h2>😕 {error || 'Berita tidak ditemukan'}</h2>
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
                    <div className="detail-header">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                            <Link to="/berita" className="back-link" style={{ marginBottom: 0 }}>
                                <ArrowLeft size={18} style={{ marginRight: '0.5rem' }} /> Kembali ke Berita
                            </Link>
                            <button className="btn btn-outline" onClick={handleShare} style={{ display: 'inline-flex', padding: '0.5rem 1rem', fontSize: 'var(--font-size-sm)', gap: '0.5rem', alignItems: 'center' }}>
                                <Share2 size={16} /> Bagikan
                            </button>
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
                        <div className="prose" dangerouslySetInnerHTML={{ __html: berita.isi }} />
                    </div>
                </div>
            </div>
        </PageTransition>
    );
}
