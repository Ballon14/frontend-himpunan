import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Trophy, User, CalendarDays } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import SectionTitle from '../components/SectionTitle';
import { SkeletonCard } from '../components/Skeleton';
import PageTransition from '../components/PageTransition';
import SEO from '../components/SEO';
import useDebounce from '../hooks/useDebounce';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import { getPrestasi } from '../api/prestasi';
import { formatDate } from '../utils/format';

const KATEGORI_OPTIONS = ['Akademik', 'Non-Akademik', 'Lomba', 'Sertifikasi', 'Lainnya'];

export default function PrestasiPage() {
    const [search, setSearch] = useState('');
    const [kategori, setKategori] = useState('');
    const [page, setPage] = useState(1);
    const debouncedSearch = useDebounce(search);

    const { data, isLoading: loading, isError, refetch } = useQuery({
        queryKey: ['prestasi', { page, debouncedSearch, kategori }],
        queryFn: async () => {
            const params = { page, per_page: 12 };
            if (debouncedSearch) params.search = debouncedSearch;
            if (kategori) params.kategori = kategori;
            const res = await getPrestasi(params);
            return res.data?.data || { data: [], meta: null };
        },
        staleTime: 5 * 60 * 1000,
    });

    const prestasi = data?.data || [];
    const meta = data?.meta || null;

    return (
        <PageTransition>
            <SEO title="Prestasi" description="Daftar prestasi dan pencapaian anggota himpunan di berbagai bidang." />
            <div className="page">
                <div className="container">
                    <div>
                        <SectionTitle
                            label="Prestasi"
                            title="Prestasi & Pencapaian"
                            description="Koleksi prestasi dan pencapaian yang diraih oleh anggota himpunan di berbagai bidang."
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
                                placeholder="Cari prestasi..."
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
                            {KATEGORI_OPTIONS.map(k => (
                                <option key={k} value={k}>{k}</option>
                            ))}
                        </select>
                    </div>

                    {isError ? (
                        <div className="error-container" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
                            <h2>Terjadi Kesalahan</h2>
                            <p style={{ color: 'var(--color-text-secondary)', marginBottom: '1.5rem' }}>
                                Gagal memuat data. Silakan coba lagi.
                            </p>
                            <button className="btn btn-primary" onClick={() => refetch()}>
                                Coba Lagi
                            </button>
                        </div>
                    ) : loading ? (
                        <div className="cards-grid">
                            {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
                        </div>
                    ) : prestasi.length > 0 ? (
                        <div className="cards-grid">
                            {prestasi.map((item, i) => (
                                <Link key={item.id} to={`/prestasi/${item.id}`} className="prestasi-card-link">
                                <motion.div
                                    className="card"
                                    initial={{ opacity: 0, y: 24 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.04, duration: 0.35 }}
                                    whileHover={{ y: -8, boxShadow: '0 24px 68px -12px rgba(0,0,0,0.6)' }}
                                    style={{ cursor: 'pointer' }}
                                >
                                    <div className="card-image" style={{ position: 'relative', aspectRatio: '16/10', overflow: 'hidden' }}>
                                        <motion.div
                                            style={{ position: 'absolute', width: '100%', height: '100%', inset: 0 }}
                                            whileHover={{ scale: 1.08 }}
                                            transition={{ duration: 0.3 }}
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
                                                <div style={{
                                                    width: '100%', height: '100%',
                                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                    background: 'linear-gradient(135deg, rgba(192,57,43,0.15), rgba(230,126,34,0.1))',
                                                    color: 'var(--color-text-muted)',
                                                }}>
                                                    <Trophy size={48} />
                                                </div>
                                            )}
                                        </motion.div>
                                        <motion.div
                                            style={{
                                                position: 'absolute',
                                                inset: 0,
                                                background: 'rgba(0,0,0,0)',
                                                pointerEvents: 'none',
                                            }}
                                            whileHover={{ background: 'rgba(0,0,0,0.15)' }}
                                            transition={{ duration: 0.3 }}
                                        />
                                        <div style={{
                                            position: 'absolute', top: 12, right: 12,
                                            background: 'rgba(0,0,0,0.65)',
                                            backdropFilter: 'blur(6px)',
                                            padding: '4px 10px',
                                            borderRadius: '20px',
                                            fontSize: '0.75rem',
                                            fontWeight: 600,
                                            color: '#fff',
                                            textTransform: 'capitalize',
                                        }}>
                                            {item.kategori}
                                        </div>
                                    </div>

                                    <div className="card-body" style={{ padding: '1.25rem' }}>
                                        <h3 className="card-title" style={{
                                            fontSize: '1.1rem', fontWeight: 700,
                                            marginBottom: '0.5rem', lineHeight: 1.3,
                                            fontFamily: 'Comfortaa, sans-serif',
                                        }}>
                                            {item.judul}
                                        </h3>

                                        {item.deskripsi && (
                                            <p style={{
                                                color: 'var(--color-text-secondary)',
                                                fontSize: '0.875rem',
                                                lineHeight: 1.6,
                                                marginBottom: '0.75rem',
                                                display: '-webkit-box',
                                                WebkitLineClamp: 2,
                                                WebkitBoxOrient: 'vertical',
                                                overflow: 'hidden',
                                            }}>
                                                {item.deskripsi}
                                            </p>
                                        )}

                                        <div style={{
                                            display: 'flex', flexWrap: 'wrap', gap: '0.75rem',
                                            fontSize: '0.8rem', color: 'var(--color-text-muted)',
                                            borderTop: '1px solid var(--color-border, rgba(255,255,255,0.08))',
                                            paddingTop: '0.75rem', marginTop: 'auto',
                                        }}>
                                            {item.penerima && (
                                                <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                                                    <User size={14} />
                                                    {item.penerima}
                                                </span>
                                            )}
                                            <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                                                <CalendarDays size={14} />
                                                {formatDate(item.tanggal)}
                                            </span>
                                        </div>
                                    </div>
                                </motion.div>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div className="empty-state">
                            <div className="empty-icon"><Trophy size={48} /></div>
                            <p>{search || kategori ? 'Tidak ada prestasi yang cocok.' : 'Belum ada prestasi.'}</p>
                        </div>
                    )}

                    {meta && meta.last_page > 1 && (
                        <div className="pagination">
                            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page <= 1}>Prev</button>
                            {Array.from({ length: meta.last_page }, (_, i) => i + 1)
                                .filter(p => Math.abs(p - page) <= 2 || p === 1 || p === meta.last_page)
                                .map((p, idx, arr) => {
                                    if (idx > 0 && p - arr[idx - 1] > 1) {
                                        return (
                                            <span key={`dot-${p}`}>
                                                <button disabled style={{ border: 'none', background: 'none' }}>...</button>
                                                <button
                                                    className={page === p ? 'active' : ''}
                                                    onClick={() => setPage(p)}
                                                >
                                                    {p}
                                                </button>
                                            </span>
                                        );
                                    }
                                    return (
                                        <button
                                            key={p}
                                            className={page === p ? 'active' : ''}
                                            onClick={() => setPage(p)}
                                        >
                                            {p}
                                        </button>
                                    );
                                })}
                            <button onClick={() => setPage(p => Math.min(meta.last_page, p + 1))} disabled={page >= meta.last_page}>Next</button>
                        </div>
                    )}
                </div>
            </div>
        </PageTransition>
    );
}
