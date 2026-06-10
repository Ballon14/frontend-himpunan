import { motion } from 'framer-motion';
import { Target, Award, Star, Users, Shield, Lightbulb, Handshake, Download } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import SectionTitle from '../components/SectionTitle';
import PageTransition from '../components/PageTransition';
import SEO from '../components/SEO';
import { getStrukturImage } from '../api/admin';
import { fadeInUp, staggerContainer, scaleIn } from '../utils/animations';

export default function AboutPage() {
    const { data: strukturData } = useQuery({
        queryKey: ['struktur-image'],
        queryFn: async () => {
            const res = await getStrukturImage();
            return res.data?.data;
        },
        staleTime: 5 * 60 * 1000,
    });

    const imageUrl = strukturData?.url || '/images/bagan-organisasi.png';

    return (
        <PageTransition>
            <SEO title="Tentang Kami" />
            <motion.div className="page" initial="hidden" animate="visible" variants={staggerContainer}>
                <div className="container">
                    <motion.div variants={fadeInUp}>
                        <SectionTitle
                            label="Tentang Kami"
                            title="Himpunan Mahasiswa TKBG Semarang"
                            description="Organisasi kemahasiswaan di bawah Program Studi Teknologi Konstruksi Bangunan Gedung — Politeknik Pekerjaan Umum."
                        />
                    </motion.div>

                    {/* About Content — Blueprint styled */}
                    <motion.div className="about-content" variants={fadeInUp}>
                        <p>
                            Himpunan Mahasiswa Teknologi Konstruksi Bangunan Gedung (HMTKBG) Semarang merupakan
                            organisasi kemahasiswaan yang menjadi wadah bagi seluruh mahasiswa untuk
                            mengembangkan potensi, kreativitas, dan jiwa kepemimpinan di bidang konstruksi dan teknik sipil.
                        </p>
                        <p>
                            Didirikan dengan semangat untuk memajukan kehidupan kampus, HMTKBG aktif
                            menyelenggarakan berbagai kegiatan yang bermanfaat mulai dari seminar,
                            workshop, bakti sosial, hingga kompetisi yang dapat meningkatkan soft skill
                            maupun hard skill mahasiswa di ranah konstruksi bangunan gedung.
                        </p>
                    </motion.div>

                    {/* Visi & Misi — Blueprint Cards */}
                    <motion.div
                        className="vision-mission-grid"
                        variants={staggerContainer}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: '-100px' }}
                    >
                        <motion.div
                            className="blueprint-card"
                            variants={{
                                hidden: { opacity: 0, x: -30 },
                                visible: { opacity: 1, x: 0, transition: { duration: 0.6 } }
                            }}
                        >
                            <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                                <Target className="vm-icon" size={28} style={{ color: 'var(--color-primary)' }} /> Visi
                            </h3>
                            <p style={{ color: 'var(--color-text-secondary)', lineHeight: 1.8 }}>
                                Menjadi organisasi kemahasiswaan terdepan yang menghasilkan
                                kader-kader unggul, berprestasi, berkarakter, dan berdaya saing global
                                di bidang Teknologi Konstruksi Bangunan Gedung.
                            </p>
                        </motion.div>

                        <motion.div
                            className="blueprint-card"
                            variants={{
                                hidden: { opacity: 0, x: 30 },
                                visible: { opacity: 1, x: 0, transition: { duration: 0.6 } }
                            }}
                        >
                            <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                                <Star className="vm-icon" size={28} style={{ color: 'var(--color-primary)' }} /> Misi
                            </h3>
                            <ul>
                                <li>Meningkatkan kualitas akademik dan non-akademik mahasiswa</li>
                                <li>Menyelenggarakan kegiatan yang bermanfaat dan relevan</li>
                                <li>Membangun jaringan kerja sama dengan berbagai pihak</li>
                                <li>Menciptakan lingkungan kampus yang kondusif dan inklusif</li>
                                <li>Mengembangkan potensi kepemimpinan mahasiswa</li>
                            </ul>
                        </motion.div>
                    </motion.div>

                    {/* Steel Beam Divider */}
                    <div className="section-divider--beam" />

                    {/* Values — New Card Design */}
                    <div style={{ marginTop: 'var(--spacing-2xl)' }}>
                        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-50px' }} variants={fadeInUp}>
                            <SectionTitle
                                label="Nilai-Nilai"
                                title="Yang Kami Junjung"
                            />
                        </motion.div>

                        <motion.div
                            className="values-grid"
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, margin: '-50px' }}
                            variants={staggerContainer}
                        >
                            {[
                                { icon: <Handshake size={28} />, title: 'Solidaritas', desc: 'Membangun kebersamaan dan rasa kekeluargaan antar mahasiswa' },
                                { icon: <Shield size={28} />, title: 'Integritas', desc: 'Menjunjung tinggi kejujuran dan tanggung jawab dalam berorganisasi' },
                                { icon: <Lightbulb size={28} />, title: 'Inovasi', desc: 'Selalu berpikir kreatif dan solutif untuk kemajuan bersama' },
                                { icon: <Award size={28} />, title: 'Profesional', desc: 'Bekerja dengan standar kualitas terbaik di bidang konstruksi' },
                            ].map((value) => (
                                <motion.div
                                    key={value.title}
                                    className="value-card"
                                    variants={scaleIn}
                                    whileHover={{ y: -6 }}
                                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                                >
                                    <div className="value-card-icon">{value.icon}</div>
                                    <div className="value-card-title">{value.title}</div>
                                    <div className="value-card-desc">{value.desc}</div>
                                </motion.div>
                            ))}
                        </motion.div>
                    </div>

                    {/* Steel Beam Divider */}
                    <div className="section-divider--beam" />

                    {/* ─── Struktur Organisasi ──────────────────────── */}
                    <div className="org-structure-section">
                        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-50px' }} variants={fadeInUp}>
                            <SectionTitle
                                label="Struktur Organisasi"
                                title="Pengurus HMTKBG"
                                description="Susunan kepengurusan Himpunan Mahasiswa Teknologi Konstruksi Bangunan Gedung."
                            />
                        </motion.div>

                        <motion.div className="org-period-badge" variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
                            <Users size={16} /> Periode 2024 — 2025
                        </motion.div>

                        <motion.div
                            className="org-image-container"
                            variants={fadeInUp}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, margin: '-50px' }}
                        >
                            <img
                                src={imageUrl}
                                alt="Bagan Struktur Organisasi HMTKBG"
                                className="org-structure-image"
                            />
                            <div className="org-image-actions">
                                <a
                                    href={imageUrl}
                                    download="Bagan-Struktur-Organisasi-HMTKBG.png"
                                    target="_blank"
                                    rel="noreferrer"
                                    className="btn-download"
                                >
                                    <Download size={18} />
                                    <span>Unduh Bagan Organisasi</span>
                                </a>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </motion.div>
        </PageTransition>
    );
}
