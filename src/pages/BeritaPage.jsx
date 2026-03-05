import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, FileText, ArrowRight } from 'lucide-react';
import SectionTitle from '../components/SectionTitle';
import LoadingSpinner from '../components/LoadingSpinner';
import PageTransition from '../components/PageTransition';
import SEO from '../components/SEO';
import { getBerita } from '../api/berita';

export default function BeritaPage() {
    const [berita, setBerita] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [meta, setMeta] = useState(null);

    // Use the SEO component below instead of document.title
    useEffect(() => { }, []);

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const params = { page, per_page: 9 };
            if (search) params.search = search;
            const res = await getBerita(params);
            setBerita(res.data?.data?.data || []);
            setMeta(res.data?.data?.meta || null);
        } catch {
            setBerita([]);
        } finally {
            setLoading(false);
        }
    }, [page, search]);

    useEffect(() => { fetchData(); }, [fetchData]);

    const formatDate = (dateStr) => {
        if (!dateStr) return '-';
        return new Date(dateStr).toLocaleDateString('id-ID', {
            day: 'numeric', month: 'long', year: 'numeric',
        });
    };

    const stripHtml = (html) => {
        if (!html) return '';
        return html.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').trim();
    };

    return (
        <PageTransition>
            <SEO title="Berita" description="Informasi terkini seputar kegiatan dan aktivitas himpunan." />
            <div className="page">
                <div className="container">
                    <div data-aos="fade-down">
                        <SectionTitle
                            label="Berita"
                            title="Semua Berita"
                            description="Informasi terkini seputar kegiatan dan aktivitas himpunan."
                        />
                    </div>

                    <div className="filter-bar" data-aos="fade-up" data-aos-delay="100">
                        <div style={{ position: 'relative', flex: 1, minWidth: 250 }}>
                            <Search size={18} style={{
                                position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)',
                                color: 'var(--color-text-muted)',
                            }} />
                            <input
                                type="text"
                                className="search-input"
                                placeholder="Cari berita..."
                                value={search}
                                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                                style={{ paddingLeft: 40 }}
                            />
                        </div>
                    </div>

                    {loading ? (
                        <LoadingSpinner />
                    ) : berita.length > 0 ? (
                        <div className="cards-grid">
                            {berita.map((item, i) => (
                                <motion.div
                                    key={item.id}
                                    className="content-card glass-card"
                                    data-aos="fade-up"
                                    data-aos-delay={(i % 9) * 100}
                                    whileHover={{ y: -8, boxShadow: '0 20px 40px rgba(0,0,0,0.15)' }}
                                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                                >
                                    {item.thumbnail ? (
                                        <motion.img
                                            src={item.thumbnail}
                                            alt={item.judul}
                                            className="card-image"
                                            whileHover={{ scale: 1.05 }}
                                            transition={{ duration: 0.4 }}
                                        />
                                    ) : (
                                        <div className="card-image-placeholder"><FileText size={48} /></div>
                                    )}
                                    <div className="card-body">
                                        <div className="card-meta">
                                            <span className="badge badge-success">Published</span>
                                            <span>{formatDate(item.published_at)}</span>
                                        </div>
                                        <h3 className="card-title">
                                            <Link to={`/berita/${item.slug}`}>{item.judul}</Link>
                                        </h3>
                                        <p className="card-description">{stripHtml(item.isi)}</p>
                                        <div className="card-footer">
                                            <Link to={`/berita/${item.slug}`} className="card-link">
                                                Baca Selengkapnya <ArrowRight size={18} style={{ marginLeft: '0.25rem' }} />
                                            </Link>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    ) : (
                        <div className="empty-state" data-aos="fade-in">
                            <div className="empty-icon"><FileText size={48} /></div>
                            <p>{search ? 'Tidak ada berita yang cocok.' : 'Belum ada berita.'}</p>
                        </div>
                    )}

                    {meta && meta.last_page > 1 && (
                        <div className="pagination" data-aos="fade-up">
                            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page <= 1}>← Prev</button>
                            {Array.from({ length: meta.last_page }, (_, i) => i + 1).map(p => (
                                <button key={p} className={page === p ? 'active' : ''} onClick={() => setPage(p)}>{p}</button>
                            ))}
                            <button onClick={() => setPage(p => Math.min(meta.last_page, p + 1))} disabled={page >= meta.last_page}>Next →</button>
                        </div>
                    )}
                </div>
            </div>
        </PageTransition>
    );
}
