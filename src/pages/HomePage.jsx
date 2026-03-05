import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiUsers, FiFileText, FiClipboard, FiImage, FiArrowRight } from 'react-icons/fi';
import SectionTitle from '../components/SectionTitle';
import LoadingSpinner from '../components/LoadingSpinner';
import { getBerita } from '../api/berita';
import { getProgramKerja } from '../api/programKerja';
import { getAnggota } from '../api/anggota';
import { getGaleri } from '../api/galeri';

const fadeUp = {
    initial: { opacity: 0, y: 40 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.6 },
};

const stagger = {
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
};

export default function HomePage() {
    const [stats, setStats] = useState({ anggota: 0, berita: 0, proker: 0, galeri: 0 });
    const [berita, setBerita] = useState([]);
    const [proker, setProker] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        document.title = 'HIMAPUP — Himpunan Mahasiswa PUP Semarang';
        loadData();
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
        <>
            {/* Hero Section */}
            <section className="hero">
                {/* Background Banner */}
                <div
                    style={{
                        position: 'absolute',
                        inset: 0,
                        backgroundImage: `url('/home-hero.png')`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        opacity: 0.3, /* Allows theme background to blend and ensure text readability in both light/dark modes */
                        zIndex: 0,
                        pointerEvents: 'none'
                    }}
                />
                <motion.div
                    className="hero-content"
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                >
                    <motion.div
                        className="hero-badge"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2 }}
                    >
                        🏛️ Politeknik Pembangunan Umum Semarang
                    </motion.div>

                    <h1>
                        Himpunan Mahasiswa{' '}
                        <span className="text-gradient">PUP Semarang</span>
                    </h1>

                    <p>
                        Membangun generasi unggul, berprestasi, dan berkarakter melalui
                        wadah organisasi kemahasiswaan yang inovatif dan inspiratif.
                    </p>

                    <div className="hero-buttons">
                        <Link to="/tentang" className="btn btn-primary">
                            Tentang Kami <FiArrowRight />
                        </Link>
                        <Link to="/berita" className="btn btn-outline">
                            Berita Terbaru
                        </Link>
                    </div>
                </motion.div>
            </section>

            {/* Stats Section */}
            <section className="section section-alt">
                <div className="container">
                    <div className="stats-grid">
                        {[
                            { icon: <FiUsers />, number: stats.anggota, label: 'Anggota Aktif' },
                            { icon: <FiFileText />, number: stats.berita, label: 'Berita Dipublikasi' },
                            { icon: <FiClipboard />, number: stats.proker, label: 'Program Kerja' },
                            { icon: <FiImage />, number: stats.galeri, label: 'Foto Galeri' },
                        ].map((stat, i) => (
                            <motion.div
                                key={stat.label}
                                className="stat-card glass-card"
                                {...stagger}
                                transition={{ delay: i * 0.1, duration: 0.5 }}
                            >
                                <div className="stat-icon">{stat.icon}</div>
                                <div className="stat-number">{loading ? '—' : stat.number}</div>
                                <div className="stat-label">{stat.label}</div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Latest Berita */}
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
                                    {...stagger}
                                    transition={{ delay: i * 0.15, duration: 0.5 }}
                                >
                                    {item.thumbnail ? (
                                        <img src={item.thumbnail} alt={item.judul} className="card-image" />
                                    ) : (
                                        <div className="card-image-placeholder"><FiFileText /></div>
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
                                                Baca Selengkapnya <FiArrowRight />
                                            </Link>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    ) : (
                        <div className="empty-state">
                            <div className="empty-icon"><FiFileText /></div>
                            <p>Belum ada berita yang dipublikasi.</p>
                        </div>
                    )}

                    {berita.length > 0 && (
                        <motion.div style={{ textAlign: 'center', marginTop: '2rem' }} {...fadeUp}>
                            <Link to="/berita" className="btn btn-outline">
                                Lihat Semua Berita <FiArrowRight />
                            </Link>
                        </motion.div>
                    )}
                </div>
            </section>

            {/* Program Kerja */}
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

                                return (
                                    <motion.div
                                        key={item.id}
                                        className="content-card glass-card"
                                        {...stagger}
                                        transition={{ delay: i * 0.15, duration: 0.5 }}
                                    >
                                        {item.foto ? (
                                            <img src={item.foto} alt={item.nama_program} className="card-image" />
                                        ) : (
                                            <div className="card-image-placeholder"><FiClipboard /></div>
                                        )}
                                        <div className="card-body">
                                            <div className="card-meta">
                                                <span className={`badge ${s.class}`}>{s.label}</span>
                                                <span>{formatDate(item.tanggal_mulai)} — {formatDate(item.tanggal_selesai)}</span>
                                            </div>
                                            <h3 className="card-title">{item.nama_program}</h3>
                                            <p className="card-description">{item.deskripsi}</p>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="empty-state">
                            <div className="empty-icon"><FiClipboard /></div>
                            <p>Belum ada program kerja.</p>
                        </div>
                    )}

                    {proker.length > 0 && (
                        <motion.div style={{ textAlign: 'center', marginTop: '2rem' }} {...fadeUp}>
                            <Link to="/program-kerja" className="btn btn-outline">
                                Lihat Semua Program <FiArrowRight />
                            </Link>
                        </motion.div>
                    )}
                </div>
            </section>

            {/* CTA */}
            <section className="section">
                <div className="container">
                    <motion.div
                        style={{ textAlign: 'center', maxWidth: 600, margin: '0 auto' }}
                        {...fadeUp}
                    >
                        <h2 style={{ fontSize: 'clamp(1.5rem, 3vw, 2.25rem)', fontWeight: 800, marginBottom: '1rem' }}>
                            Tertarik Bergabung?
                        </h2>
                        <p style={{ color: 'var(--color-text-secondary)', marginBottom: '2rem' }}>
                            Mari bersama-sama membangun organisasi yang lebih baik dan berkontribusi untuk kemajuan kampus.
                        </p>
                        <Link to="/kontak" className="btn btn-primary">
                            Hubungi Kami <FiArrowRight />
                        </Link>
                    </motion.div>
                </div>
            </section>
        </>
    );
}
