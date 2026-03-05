import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowLeft, FiCalendar, FiClock } from 'react-icons/fi';
import LoadingSpinner from '../components/LoadingSpinner';
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
                if (res.data?.data?.judul) {
                    document.title = `${res.data.data.judul} — HIMAPUP`;
                }
            } catch {
                setError('Berita tidak ditemukan.');
            } finally {
                setLoading(false);
            }
        };
        fetchDetail();
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
        <motion.div
            className="detail-page"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            <div className="container">
                <div className="detail-header">
                    <Link to="/berita" className="back-link">
                        <FiArrowLeft /> Kembali ke Berita
                    </Link>
                    <h1>{berita.judul}</h1>
                    <div className="detail-meta">
                        <span className="meta-item">
                            <FiCalendar /> {formatDate(berita.published_at)}
                        </span>
                        <span className="meta-item">
                            <FiClock /> {formatTime(berita.published_at)}
                        </span>
                        <span className="badge badge-success">{berita.status}</span>
                    </div>
                </div>

                {berita.thumbnail && (
                    <div className="detail-thumbnail">
                        <img src={berita.thumbnail} alt={berita.judul} />
                    </div>
                )}

                <div className="detail-content">
                    <div className="prose" dangerouslySetInnerHTML={{ __html: berita.isi }} />
                </div>
            </div>
        </motion.div>
    );
}
