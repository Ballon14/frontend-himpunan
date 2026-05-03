import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, Clipboard, Share2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { useQuery } from '@tanstack/react-query';
import LoadingSpinner from '../components/LoadingSpinner';
import PageTransition from '../components/PageTransition';
import SEO from '../components/SEO';
import { getProgramKerjaById } from '../api/programKerja';
import { formatDate } from '../utils/format';

const STATUS_MAP = {
    perencanaan: { class: 'badge-gray', label: 'Perencanaan' },
    berjalan: { class: 'badge-info', label: 'Berjalan' },
    selesai: { class: 'badge-success', label: 'Selesai' },
    dibatalkan: { class: 'badge-danger', label: 'Dibatalkan' },
};

export default function ProgramKerjaDetailPage() {
    const { id } = useParams();

    const { data: proker, isLoading: loading, isError } = useQuery({
        queryKey: ['programKerjaDetail', id],
        queryFn: async () => {
            const res = await getProgramKerjaById(id);
            return res.data?.data || null;
        },
        staleTime: 5 * 60 * 1000,
    });

    const error = isError ? 'Program kerja tidak ditemukan.' : null;

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [id]);

    const handleShare = async () => {
        const url = window.location.href;
        const title = proker?.nama_program || 'Program Kerja Himpunan';
        if (navigator.share) {
            try {
                await navigator.share({ title, url });
            } catch (error) {
                console.error('Share error:', error);
            }
        } else {
            await navigator.clipboard.writeText(url);
            toast.success('Link program kerja disalin ke clipboard!');
        }
    };

    if (loading) return (
        <div className="page"><div className="container"><LoadingSpinner /></div></div>
    );

    if (error || !proker) return (
        <div className="page">
            <div className="container">
                <div className="error-container">
                    <h2>😕 {error || 'Program kerja tidak ditemukan'}</h2>
                    <Link to="/program-kerja" className="btn btn-outline">← Kembali ke Program Kerja</Link>
                </div>
            </div>
        </div>
    );

    const s = STATUS_MAP[proker.status] || { class: 'badge-gray', label: proker.status };

    return (
        <PageTransition>
            {proker && <SEO title={proker.nama_program} description={proker.deskripsi?.substring(0, 150) + '...'} image={proker.foto} type="article" />}
            <div className="detail-page">
                <div className="container" style={{ maxWidth: 800 }}>
                    <div className="detail-header" style={{ textAlign: 'center', marginBottom: 'var(--spacing-3xl)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--spacing-lg)', alignItems: 'center' }}>
                            <Link to="/program-kerja" className="back-link btn-outline" style={{ display: 'inline-flex', padding: '0.5rem 1rem', fontSize: 'var(--font-size-sm)', gap: '0.5rem', alignItems: 'center', textDecoration: 'none', marginBottom: 0 }}>
                                <ArrowLeft size={18} /> Kembali
                            </Link>
                            <button className="btn btn-outline" onClick={handleShare} style={{ display: 'inline-flex', padding: '0.5rem 1rem', fontSize: 'var(--font-size-sm)', gap: '0.5rem', alignItems: 'center' }}>
                                <Share2 size={16} /> Bagikan
                            </button>
                        </div>

                        <span className={`badge ${s.class}`} style={{ display: 'inline-block', marginBottom: 'var(--spacing-md)' }}>{s.label}</span>
                        <h1 style={{ fontSize: 'var(--font-size-3xl)', marginBottom: 'var(--spacing-md)' }}>{proker.nama_program}</h1>

                        <div className="detail-meta" style={{ justifyContent: 'center', opacity: 0.8 }}>
                            <span className="meta-item">
                                <Calendar size={16} style={{ marginRight: '0.5rem' }} /> {formatDate(proker.tanggal_mulai)} — {formatDate(proker.tanggal_selesai)}
                            </span>
                        </div>
                    </div>

                    {proker.foto ? (
                        <div className="detail-thumbnail" style={{ borderRadius: 'var(--radius-lg)', overflow: 'hidden', boxShadow: '0 20px 40px rgba(0,0,0,0.1)', marginBottom: 'var(--spacing-2xl)', maxHeight: '500px' }}>
                            <img src={proker.foto} alt={proker.nama_program} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </div>
                    ) : (
                        <div style={{ height: 300, backgroundColor: 'var(--color-bg-alt)', borderRadius: 'var(--radius-lg)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-text-muted)', fontSize: '3rem', marginBottom: 'var(--spacing-2xl)' }}>
                            <Clipboard size={64} />
                        </div>
                    )}

                    <div
                        className="detail-content glass-card"

                        style={{ padding: 'var(--spacing-2xl)', lineHeight: 1.8, fontSize: 'var(--font-size-md)' }}
                    >
                        <h3 style={{ marginBottom: 'var(--spacing-md)' }}>Deskripsi Program</h3>
                        <div className="prose" dangerouslySetInnerHTML={{ __html: proker.deskripsi }} />
                    </div>
                </div>
            </div>
        </PageTransition>
    );
}
