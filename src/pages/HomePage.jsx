import { useEffect, useState, useRef, useLayoutEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Users, FileText, Clipboard, Image as ImageIcon, ArrowRight } from 'lucide-react';
import SectionTitle from '../components/SectionTitle';
import LoadingSpinner from '../components/LoadingSpinner';
import PageTransition from '../components/PageTransition';
import SEO from '../components/SEO';
import { getBerita } from '../api/berita';
import { getProgramKerja } from '../api/programKerja';
import { getAnggota } from '../api/anggota';
import { getGaleri } from '../api/galeri';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';

gsap.registerPlugin(ScrollTrigger);

export default function HomePage() {
    const [stats, setStats] = useState({ anggota: 0, berita: 0, proker: 0, galeri: 0 });
    const [berita, setBerita] = useState([]);
    const [proker, setProker] = useState([]);
    const [loading, setLoading] = useState(true);

    // GSAP refs
    const heroRef = useRef(null);
    const heroTitleRef = useRef(null);
    const heroBadgeRef = useRef(null);
    const heroDescRef = useRef(null);
    const heroButtonsRef = useRef(null);
    const statsRef = useRef(null);
    const ctaRef = useRef(null);

    useEffect(() => {
        loadData();
    }, []);

    // GSAP Hero Timeline Animation
    useLayoutEffect(() => {
        const ctx = gsap.context(() => {
            const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

            tl.fromTo(heroBadgeRef.current,
                { opacity: 0, scale: 0.5, y: -20 },
                { opacity: 1, scale: 1, y: 0, duration: 0.6 }
            )
                .fromTo(heroTitleRef.current,
                    { opacity: 0, y: 60, clipPath: 'inset(100% 0% 0% 0%)' },
                    { opacity: 1, y: 0, clipPath: 'inset(0% 0% 0% 0%)', duration: 0.8 },
                    '-=0.3'
                )
                .fromTo(heroDescRef.current,
                    { opacity: 0, y: 30 },
                    { opacity: 1, y: 0, duration: 0.6 },
                    '-=0.4'
                )
                .fromTo(heroButtonsRef.current?.children || [],
                    { opacity: 0, y: 20, scale: 0.9 },
                    { opacity: 1, y: 0, scale: 1, duration: 0.5, stagger: 0.15 },
                    '-=0.3'
                );

            // Stats counter animation with ScrollTrigger
            if (statsRef.current) {
                gsap.fromTo(
                    statsRef.current.querySelectorAll('.stat-card'),
                    { opacity: 0, y: 50, scale: 0.95 },
                    {
                        opacity: 1, y: 0, scale: 1,
                        duration: 0.7,
                        stagger: 0.12,
                        ease: 'back.out(1.7)',
                        scrollTrigger: {
                            trigger: statsRef.current,
                            start: 'top 80%',
                            toggleActions: 'play none none none',
                        },
                    }
                );
            }

            // CTA section parallax-like animation
            if (ctaRef.current) {
                gsap.fromTo(
                    ctaRef.current,
                    { opacity: 0, scale: 0.9 },
                    {
                        opacity: 1, scale: 1,
                        duration: 0.8,
                        ease: 'power2.out',
                        scrollTrigger: {
                            trigger: ctaRef.current,
                            start: 'top 85%',
                            toggleActions: 'play none none none',
                        },
                    }
                );
            }
        }, heroRef);

        return () => ctx.revert();
    }, []);

    const loadData = async () => {
        try {
            const [anggotaRes, beritaRes, prokerRes, galeriRes] = await Promise.allSettled([
                getAnggota({ per_page: 1 }),
                getBerita({ per_page: 3 }),
                getProgramKerja({ per_page: 3 }),
                getGaleri({ per_page: 1 }),
            ]);

            if (anggotaRes.status === 'fulfilled') {
                setStats(prev => ({ ...prev, anggota: anggotaRes.value.data?.data?.meta?.total || 0 }));
            }
            if (beritaRes.status === 'fulfilled') {
                setBerita(beritaRes.value.data?.data?.data || []);
                setStats(prev => ({ ...prev, berita: beritaRes.value.data?.data?.meta?.total || 0 }));
            }
            if (prokerRes.status === 'fulfilled') {
                setProker(prokerRes.value.data?.data?.data || []);
                setStats(prev => ({ ...prev, proker: prokerRes.value.data?.data?.meta?.total || 0 }));
            }
            if (galeriRes.status === 'fulfilled') {
                setStats(prev => ({ ...prev, galeri: galeriRes.value.data?.data?.meta?.total || 0 }));
            }
        } catch {
            // Silently handle — homepage should degrade gracefully
        } finally {
            setLoading(false);
        }
    };

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
            <div ref={heroRef}>
                {/* Hero Section — GSAP Timeline */}
                <section className="hero">
                    <div className="grid-pattern" />
                    <div className="hero-content">
                        <div ref={heroBadgeRef} className="hero-badge" style={{ opacity: 0 }}>
                            🏛️ Politeknik Pembangunan Umum Semarang
                        </div>

                        <h1 ref={heroTitleRef} style={{ opacity: 0 }}>
                            Himpunan Mahasiswa{' '}
                            <span className="text-gradient">PUP Semarang</span>
                        </h1>

                        <p ref={heroDescRef} style={{ opacity: 0 }}>
                            Membangun generasi unggul, berprestasi, dan berkarakter melalui
                            wadah organisasi kemahasiswaan yang inovatif dan inspiratif.
                        </p>

                        <div ref={heroButtonsRef} className="hero-buttons">
                            <Link to="/tentang" className="btn btn-primary">
                                Tentang Kami <ArrowRight size={18} style={{ marginLeft: '0.5rem' }} />
                            </Link>
                            <Link to="/berita" className="btn btn-outline">
                                Berita Terbaru
                            </Link>
                        </div>
                    </div>
                </section>

                {/* Stats Section — GSAP ScrollTrigger */}
                <section className="section section-alt">
                    <div className="container">
                        <div className="stats-grid" ref={statsRef}>
                            {[
                                { icon: <Users />, number: stats.anggota, label: 'Anggota Aktif' },
                                { icon: <FileText />, number: stats.berita, label: 'Berita Dipublikasi' },
                                { icon: <Clipboard />, number: stats.proker, label: 'Program Kerja' },
                                { icon: <ImageIcon />, number: stats.galeri, label: 'Foto Galeri' },
                            ].map((stat) => (
                                <div key={stat.label} className="stat-card glass-card" style={{ opacity: 0 }}>
                                    <div className="stat-icon">{stat.icon}</div>
                                    <div className="stat-number">{loading ? '—' : stat.number}</div>
                                    <div className="stat-label">{stat.label}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Latest Berita — AOS */}
                <section className="section">
                    <div className="container">
                        <SectionTitle
                            label="Berita"
                            title="Berita Terbaru"
                            description="Informasi dan kabar terkini seputar kegiatan himpunan."
                        />

                        {loading ? (
                            <LoadingSpinner />
                        ) : berita.length > 0 ? (
                            <div className="cards-grid">
                                {berita.map((item, i) => (
                                    <motion.div
                                        key={item.id}
                                        className="content-card glass-card"
                                        data-aos="fade-up"
                                        data-aos-delay={i * 100}
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
                            </div>
                        ) : (
                            <div className="empty-state">
                                <div className="empty-icon"><FileText size={48} /></div>
                                <p>Belum ada berita yang dipublikasi.</p>
                            </div>
                        )}

                        {berita.length > 0 && (
                            <div style={{ textAlign: 'center', marginTop: '2rem' }} data-aos="fade-up" data-aos-delay="300">
                                <Link to="/berita" className="btn btn-outline">
                                    Lihat Semua Berita <ArrowRight size={18} style={{ marginLeft: '0.5rem' }} />
                                </Link>
                            </div>
                        )}
                    </div>
                </section>

                {/* Program Kerja — AOS */}
                <section className="section section-alt">
                    <div className="container">
                        <SectionTitle
                            label="Program Kerja"
                            title="Kegiatan & Program"
                            description="Program kerja yang sedang dan akan dilaksanakan."
                        />

                        {loading ? (
                            <LoadingSpinner />
                        ) : proker.length > 0 ? (
                            <div className="cards-grid">
                                {proker.map((item, i) => {
                                    const statusMap = {
                                        perencanaan: { class: 'badge-gray', label: 'Perencanaan' },
                                        berjalan: { class: 'badge-info', label: 'Berjalan' },
                                        selesai: { class: 'badge-success', label: 'Selesai' },
                                        dibatalkan: { class: 'badge-danger', label: 'Dibatalkan' },
                                    };
                                    const s = statusMap[item.status] || { class: 'badge-gray', label: item.status };
                                    const MotionLink = motion(Link);

                                    return (
                                        <MotionLink
                                            to={`/program-kerja/${item.id}`}
                                            key={item.id}
                                            className="content-card glass-card"
                                            style={{ textDecoration: 'none', color: 'inherit', display: 'flex', flexDirection: 'column' }}
                                            data-aos="fade-up"
                                            data-aos-delay={i * 100}
                                            whileHover={{ y: -8, boxShadow: '0 20px 40px rgba(0,0,0,0.15)' }}
                                            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                                        >
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
                                        </MotionLink>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="empty-state">
                                <div className="empty-icon"><Clipboard size={48} /></div>
                                <p>Belum ada program kerja.</p>
                            </div>
                        )}

                        {proker.length > 0 && (
                            <div style={{ textAlign: 'center', marginTop: '2rem' }} data-aos="fade-up" data-aos-delay="300">
                                <Link to="/program-kerja" className="btn btn-outline">
                                    Lihat Semua Program <ArrowRight size={18} style={{ marginLeft: '0.5rem' }} />
                                </Link>
                            </div>
                        )}
                    </div>
                </section>

                {/* CTA — GSAP ScrollTrigger */}
                <section className="section">
                    <div className="container" style={{ position: 'relative' }}>
                        <div
                            ref={ctaRef}
                            className="cta-box"
                            style={{ textAlign: 'center', maxWidth: 800, margin: '0 auto', opacity: 0 }}
                        >
                            <div className="cta-box-bg" />
                            <div style={{ position: 'relative', zIndex: 1 }}>
                                <h2 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.75rem)', fontWeight: 900, marginBottom: '1rem', letterSpacing: '-0.03em' }}>
                                    Mari Berkembang <span className="text-gradient">Bersama Kami!</span>
                                </h2>
                                <p style={{ color: 'var(--color-text-secondary)', marginBottom: '2.5rem', fontSize: 'var(--font-size-lg)', maxWidth: 600, margin: '0 auto 2.5rem', lineHeight: 1.8 }}>
                                    Himpunan Mahasiswa memberikan wadah bagi kamu untuk melatih kepemimpinan, mengasah keterampilan, dan membangun relasi di ranah akademik maupun profesional.
                                </p>
                                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} style={{ display: 'inline-block' }}>
                                    <Link to="/kontak" className="btn btn-primary" style={{ padding: '1rem 2.5rem', fontSize: 'var(--font-size-md)', borderRadius: 'var(--radius-full)' }}>
                                        Hubungi Kami Sekarang <ArrowRight size={20} style={{ marginLeft: '0.75rem' }} />
                                    </Link>
                                </motion.div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </PageTransition>
    );
}
