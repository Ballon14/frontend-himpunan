import { useEffect } from 'react';
import { motion } from 'framer-motion';

import SectionTitle from '../components/SectionTitle';
import PageTransition from '../components/PageTransition';
import SEO from '../components/SEO';
import { Target, Award, Heart, Star } from 'lucide-react';

export default function AboutPage() {
    const fadeInUp = {
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } }
    };

    const staggerContainer = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.2 }
        }
    };

    return (
        <PageTransition>
            <SEO title="Tentang Kami" />
            <motion.div className="page" initial="hidden" animate="visible" variants={staggerContainer}>
                <div className="container">
                    <motion.div variants={fadeInUp}>
                    <SectionTitle
                        label="Tentang Kami"
                        title="Himpunan Mahasiswa TKBG Semarang"
                        description="Organisasi kemahasiswaan yang berkomitmen membangun generasi unggul."
                    />

                    </motion.div>

                    <motion.div
                        className="about-content"
                        variants={fadeInUp}
                    >
                        <p>
                            Himpunan Mahasiswa Teknologi Konstruksi Bangunan Gedung (HMTKBG) Semarang merupakan
                            organisasi kemahasiswaan yang menjadi wadah bagi seluruh mahasiswa untuk
                            mengembangkan potensi, kreativitas, dan jiwa kepemimpinan.
                        </p>

                        <p>
                            Didirikan dengan semangat untuk memajukan kehidupan kampus, HMTKBG aktif
                            menyelenggarakan berbagai kegiatan yang bermanfaat mulai dari seminar,
                            workshop, bakti sosial, hingga kompetisi yang dapat meningkatkan soft skill
                            maupun hard skill mahasiswa.
                        </p>
                    </motion.div>

                    <motion.div className="vision-mission-grid" variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-100px' }}>
                        <motion.div
                            className="vm-card glass-card"
                            variants={{
                                hidden: { opacity: 0, x: -30 },
                                visible: { opacity: 1, x: 0, transition: { duration: 0.6 } }
                            }}
                            whileHover={{ y: -5, boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}
                        >
                            <h3>
                                <Target className="vm-icon" size={28} /> Visi
                            </h3>
                            <p style={{ color: 'var(--color-text-secondary)', lineHeight: 1.8 }}>
                                Menjadi organisasi kemahasiswaan terdepan yang menghasilkan
                                kader-kader unggul, berprestasi, berkarakter, dan berdaya saing global.
                            </p>
                        </motion.div>

                        <motion.div
                            className="vm-card glass-card"
                            variants={{
                                hidden: { opacity: 0, x: 30 },
                                visible: { opacity: 1, x: 0, transition: { duration: 0.6 } }
                            }}
                            whileHover={{ y: -5, boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}
                        >
                            <h3>
                                <Star className="vm-icon" size={28} /> Misi
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

                    {/* Values */}
                    <div style={{ marginTop: 'var(--spacing-4xl)' }}>
                        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-50px' }} variants={fadeInUp}>
                            <SectionTitle
                                label="Nilai-Nilai"
                                title="Yang Kami Junjung"
                            />
                        </motion.div>

                        <motion.div className="stats-grid" initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-50px' }} variants={staggerContainer}>
                            {[
                                { icon: <Heart size={32} />, title: 'Solidaritas', desc: 'Membangun kebersamaan dan rasa kekeluargaan' },
                                { icon: <Award size={32} />, title: 'Integritas', desc: 'Menjunjung tinggi kejujuran dan tanggung jawab' },
                                { icon: <Target size={32} />, title: 'Inovasi', desc: 'Selalu berpikir kreatif dan solutif' },
                                { icon: <Star size={32} />, title: 'Profesional', desc: 'Bekerja dengan standar kualitas terbaik' },
                            ].map((value, i) => (
                                <motion.div
                                    key={value.title}
                                    className="stat-card glass-card"
                                    variants={{
                                        hidden: { opacity: 0, scale: 0.8 },
                                        visible: { opacity: 1, scale: 1, transition: { type: 'spring', stiffness: 100 } }
                                    }}
                                    whileHover={{ scale: 1.05, y: -5 }}
                                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                                >
                                    <div className="stat-icon">{value.icon}</div>
                                    <div style={{ fontSize: 'var(--font-size-lg)', fontWeight: 700, marginBottom: '0.5rem' }}>
                                        {value.title}
                                    </div>
                                    <div className="stat-label">{value.desc}</div>
                                </motion.div>
                            ))}
                        </motion.div>
                    </div>
                </div>
            </motion.div>
        </PageTransition>
    );
}
