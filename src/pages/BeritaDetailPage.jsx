import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, Clock } from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';
import PageTransition from '../components/PageTransition';
import SEO from '../components/SEO';
import { getBeritaBySlug } from '../api/berita';

export default function BeritaDetailPage() {
    const { slug } = useParams();
    const [berita, setBerita] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchDetail = async () => {
            setLoading(true);
            try {
                const res = await getBeritaBySlug(slug);
                setBerita(res.data?.data || null);
            } catch {
                setError('Berita tidak ditemukan.');
            } finally {
                setLoading(false);
            }
        };
        fetchDetail();

        // Ensure scroll to top when page changes (slug dependency)
        window.scrollTo(0, 0);
    }, [slug]);

    const formatDate = (dateStr) => {
        if (!dateStr) return '-';
        return new Date(dateStr).toLocaleDateString('id-ID', {
            day: 'numeric', month: 'long', year: 'numeric',
        });
    };

    const formatTime = (dateStr) => {
        if (!dateStr) return '-';
        return new Date(dateStr).toLocaleTimeString('id-ID', {
            hour: '2-digit', minute: '2-digit',
        });
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
                    <div className="detail-header" data-aos="fade-down">
                        <Link to="/berita" className="back-link">
                            <ArrowLeft size={18} style={{ marginRight: '0.5rem' }} /> Kembali ke Berita
                        </Link>
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
                        <div className="detail-thumbnail" data-aos="zoom-in" data-aos-delay="100">
                            <img src={berita.thumbnail} alt={berita.judul} />
                        </div>
                    )}

                    <div
                        className="detail-content"
                        data-aos="fade-up"
                        data-aos-delay="200"
                    >
                        <div className="prose" dangerouslySetInnerHTML={{ __html: berita.isi }} />
                    </div>
                </div>
            </div>
        </PageTransition>
    );
}
