import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';


import { Users, FileText, Clipboard, Image as ImageIcon, ArrowRight } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import SectionTitle from '../components/SectionTitle';
import LoadingSpinner from '../components/LoadingSpinner';
import Skeleton, { SkeletonCard } from '../components/Skeleton';
import PageTransition from '../components/PageTransition';
import SEO from '../components/SEO';
import { getBerita } from '../api/berita';
import { getProgramKerja } from '../api/programKerja';
import { getAnggota } from '../api/anggota';
import { getGaleri } from '../api/galeri';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';



export default function HomePage() {
    const fadeInUp = {
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } }
    };

    const staggerContainer = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.15, delayChildren: 0.1 }
        }
    };

    const { data: anggotaData, isLoading: loadingAnggota } = useQuery({
        queryKey: ['anggota', 'homepage'],
        queryFn: () => getAnggota({ per_page: 1 }),
        staleTime: 60000,
    });

    const { data: beritaData, isLoading: loadingBerita } = useQuery({
        queryKey: ['berita', 'homepage'],
        queryFn: () => getBerita({ per_page: 3 }),
        staleTime: 60000,
    });

    const { data: prokerData, isLoading: loadingProker } = useQuery({
        queryKey: ['proker', 'homepage'],
        queryFn: () => getProgramKerja({ per_page: 3 }),
        staleTime: 60000,
    });

    const { data: galeriData, isLoading: loadingGaleri } = useQuery({
        queryKey: ['galeri', 'homepage'],
        queryFn: () => getGaleri({ per_page: 1 }),
        staleTime: 60000,
    });

    const stats = {
        anggota: anggotaData?.data?.data?.meta?.total || 0,
        berita: beritaData?.data?.data?.meta?.total || 0,
        proker: prokerData?.data?.data?.meta?.total || 0,
        galeri: galeriData?.data?.data?.meta?.total || 0,
    };

    const berita = beritaData?.data?.data?.data || [];
    const proker = prokerData?.data?.data?.data || [];
    const loadingStats = loadingAnggota || loadingBerita || loadingProker || loadingGaleri;

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
            <SEO />
            <div>
                {/* Hero Section — Framer Motion */}
                <section className="hero">
                    <div className="grid-pattern" />
                    <motion.div className="hero-content" initial="hidden" animate="visible" variants={staggerContainer}>
                        <motion.div className="hero-badge" variants={{
                            hidden: { opacity: 0, scale: 0.5, y: -20 },
                            visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.6 } }
                        }}>
                            🏛️ Teknologi Konstruksi Bangunan Gedung Semarang
                        </motion.div>

                        <motion.h1 variants={{
                            hidden: { opacity: 0, y: 60, clipPath: 'inset(100% 0% 0% 0%)' },
                            visible: { opacity: 1, y: 0, clipPath: 'inset(0% 0% 0% 0%)', transition: { duration: 0.8 } }
                        }}>
                            Himpunan Mahasiswa{' '}
                            <span className="text-gradient">TKBG Semarang</span>
                        </motion.h1>

                        <motion.p variants={fadeInUp}>
                            Membangun generasi unggul, berprestasi, dan berkarakter melalui
                            wadah organisasi kemahasiswaan yang inovatif dan inspiratif.
                        </motion.p>

                        <motion.div className="hero-buttons" variants={fadeInUp}>
                            <Link to="/tentang" className="btn btn-primary">
                                Tentang Kami <ArrowRight size={18} style={{ marginLeft: '0.5rem' }} />
                            </Link>
                            <Link to="/berita" className="btn btn-outline">
                                Berita Terbaru
                            </Link>
                        </motion.div>
                    </motion.div>
                </section>

                {/* Stats Section — Framer Motion */}
                <section className="section section-alt">
                    <div className="container">
                        <motion.div className="stats-grid" initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-50px' }} variants={staggerContainer}>
                            {[
                                { icon: <Users />, number: stats.anggota, label: 'Anggota Aktif' },
                                { icon: <FileText />, number: stats.berita, label: 'Berita Dipublikasi' },
                                { icon: <Clipboard />, number: stats.proker, label: 'Program Kerja' },
                                { icon: <ImageIcon />, number: stats.galeri, label: 'Foto Galeri' },
                            ].map((stat) => (
                                <motion.div key={stat.label} className="stat-card glass-card" variants={{
                                    hidden: { opacity: 0, y: 50, scale: 0.95 },
                                    visible: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring', stiffness: 100 } }
                                }}>
                                    <div className="stat-icon">{stat.icon}</div>
                                    <div className="stat-number">{loadingStats ? <Skeleton width="40px" height="36px" style={{ margin: '0 auto' }} /> : stat.number}</div>
                                    <div className="stat-label">{stat.label}</div>
                                </motion.div>
                            ))}
                        </motion.div>
                    </div>
                </section>

                {/* Latest Berita */}
                <section className="section">
                    <div className="container">
                        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-50px' }} variants={fadeInUp}>
                            <SectionTitle
                                label="Berita"
                                title="Berita Terbaru"
                                description="Informasi dan kabar terkini seputar kegiatan himpunan."
                            />
                        </motion.div>

                        {loadingBerita ? (
                            <div className="cards-grid">
                                {[1, 2, 3].map(i => <SkeletonCard key={i} />)}
                            </div>
                        ) : berita.length > 0 ? (
                            <motion.div className="cards-grid" initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-50px' }} variants={staggerContainer}>
                                {berita.map((item, i) => (
                                    <motion.div
                                        key={item.id}
                                        className="content-card glass-card"
                                        variants={{
                                            hidden: { opacity: 0, y: 50 },
                                            visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100 } }
                                        }}
                                        whileHover={{ y: -8, boxShadow: '0 20px 40px rgba(0,0,0,0.15)' }}
                                        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                                    >
                                        {item.thumbnail ? (
                                            <div style={{ overflow: 'hidden', height: 220, borderRadius: 'var(--radius-lg) var(--radius-lg) 0 0' }}>
                                                <LazyLoadImage
                                                    src={item.thumbnail}
                                                    alt={item.judul}
                                                    effect="blur"
                                                    wrapperProps={{ style: { display: 'block', width: '100%', height: '100%' } }}
                                                    style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s' }}
                                                    className="card-image"
                                                    onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'}
                                                    onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
                                                />
                                            </div>
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
                            </motion.div>
                        ) : (
                            <div className="empty-state">
                                <div className="empty-icon"><FileText size={48} /></div>
                                <p>Belum ada berita yang dipublikasi.</p>
                            </div>
                        )}

                        {berita.length > 0 && (
                            <motion.div style={{ textAlign: 'center', marginTop: '2rem' }} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}>
                                <Link to="/berita" className="btn btn-outline">
                                    Lihat Semua Berita <ArrowRight size={18} style={{ marginLeft: '0.5rem' }} />
                                </Link>
                            </motion.div>
                        )}
                    </div>
                </section>

                {/* Program Kerja */}
                <section className="section section-alt">
                    <div className="container">
                        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-50px' }} variants={fadeInUp}>
                            <SectionTitle
                                label="Program Kerja"
                                title="Kegiatan & Program"
                                description="Program kerja yang sedang dan akan dilaksanakan."
                            />
                        </motion.div>

                        {loadingProker ? (
                            <div className="cards-grid">
                                {[1, 2, 3].map(i => <SkeletonCard key={i} />)}
                            </div>
                        ) : proker.length > 0 ? (
                            <motion.div className="cards-grid" initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-50px' }} variants={staggerContainer}>
                                {proker.map((item, i) => {
                                    const statusMap = {
                                        perencanaan: { class: 'badge-gray', label: 'Perencanaan' },
                                        berjalan: { class: 'badge-info', label: 'Berjalan' },
                                        selesai: { class: 'badge-success', label: 'Selesai' },
                                        dibatalkan: { class: 'badge-danger', label: 'Dibatalkan' },
                                    };
                                    const s = statusMap[item.status] || { class: 'badge-gray', label: item.status };
                                    return (
                                        <motion.div
                                            key={item.id}
                                            className="content-card glass-card"
                                            variants={{
                                                hidden: { opacity: 0, y: 50 },
                                                visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100 } }
                                            }}
                                            whileHover={{ y: -8, boxShadow: '0 20px 40px rgba(0,0,0,0.15)' }}
                                            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                                        >
                                            <Link to={`/program-kerja/${item.id}`} style={{ textDecoration: 'none', color: 'inherit', display: 'flex', flexDirection: 'column', height: '100%' }}>
                                            {item.foto ? (
                                                <div style={{ overflow: 'hidden', height: 220, borderRadius: 'var(--radius-lg) var(--radius-lg) 0 0' }}>
                                                    <LazyLoadImage
                                                        src={item.foto}
                                                        alt={item.nama_program}
                                                        effect="blur"
                                                        wrapperProps={{ style: { display: 'block', width: '100%', height: '100%' } }}
                                                        style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s' }}
                                                        className="card-image"
                                                        onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'}
                                                        onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
                                                    />
                                                </div>
                                            ) : (
                                                <div className="card-image-placeholder"><Clipboard size={48} /></div>
                                            )}
                                            <div className="card-body">
                                                <div className="card-meta">
                                                    <span className={`badge ${s.class}`}>{s.label}</span>
                                                    <span>{formatDate(item.tanggal_mulai)} — {formatDate(item.tanggal_selesai)}</span>
                                                </div>
                                                <h3 className="card-title" style={{ transition: 'color 0.2s' }} onMouseOver={(e) => e.target.style.color = 'var(--color-primary)'} onMouseOut={(e) => e.target.style.color = 'var(--color-text)'}>{item.nama_program}</h3>
                                                <p className="card-description">{item.deskripsi}</p>
                                            </div>
                                            </Link>
                                        </motion.div>
                                    );
                                })}
                            </motion.div>
                        ) : (
                            <div className="empty-state">
                                <div className="empty-icon"><Clipboard size={48} /></div>
                                <p>Belum ada program kerja.</p>
                            </div>
                        )}

                        {proker.length > 0 && (
                            <motion.div style={{ textAlign: 'center', marginTop: '2rem' }} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}>
                                <Link to="/program-kerja" className="btn btn-outline">
                                    Lihat Semua Program <ArrowRight size={18} style={{ marginLeft: '0.5rem' }} />
                                </Link>
                            </motion.div>
                        )}
                    </div>
                </section>

                {/* CTA */}
                <section className="section">
                    <div className="container" style={{ position: 'relative' }}>
                        <motion.div
                            className="cta-box"
                            style={{ textAlign: 'center', maxWidth: 800, margin: '0 auto' }}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1, transition: { duration: 0.8, ease: 'easeOut' } }}
                            viewport={{ once: true, margin: '-50px' }}
                        >
                            <div className="cta-box-bg" />
                            <div style={{ position: 'relative', zIndex: 1 }}>
                                <h2 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.75rem)', fontWeight: 900, marginBottom: '1rem', letterSpacing: '-0.03em' }}>
                                    Mari Berkembang <span className="text-gradient">Bersama Kami!</span>
                                </h2>
                                <p className="cta-desc-text" style={{ color: 'var(--color-text-secondary)', marginBottom: '2.5rem', fontSize: 'var(--font-size-lg)', maxWidth: 600, margin: '0 auto 2.5rem', lineHeight: 1.8 }}>
                                    Himpunan Mahasiswa memberikan wadah bagi kamu untuk melatih kepemimpinan, mengasah keterampilan, dan membangun relasi di ranah akademik maupun profesional.
                                </p>
                                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} style={{ display: 'inline-block', width: '100%', maxWidth: '300px' }}>
                                    <Link to="/kontak" className="btn btn-primary cta-btn" style={{ padding: '1rem 2.5rem', fontSize: 'var(--font-size-md)', borderRadius: 'var(--radius-full)', display: 'inline-flex', width: '100%', justifyContent: 'center' }}>
                                        Hubungi Kami Sekarang <ArrowRight size={20} style={{ marginLeft: '0.75rem' }} />
                                    </Link>
                                </motion.div>
                            </div>
                        </motion.div>
                    </div>
                </section>
            </div>
        </PageTransition>
    );
}
