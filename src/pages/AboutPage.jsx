import { useEffect } from 'react';
import { motion } from 'framer-motion';
import SectionTitle from '../components/SectionTitle';
import { FiTarget, FiAward, FiHeart, FiStar } from 'react-icons/fi';

export default function AboutPage() {
    useEffect(() => {
        document.title = 'Tentang Kami — HIMAPUP';
    }, []);

    return (
        <div className="page">
            <div className="container">
                <SectionTitle
                    label="Tentang Kami"
                    title="Himpunan Mahasiswa PUP Semarang"
                    description="Organisasi kemahasiswaan yang berkomitmen membangun generasi unggul."
                />

                <motion.div
                    className="about-content"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <p>
                        Himpunan Mahasiswa Politeknik Pembangunan Umum (HIMAPUP) Semarang merupakan
                        organisasi kemahasiswaan yang menjadi wadah bagi seluruh mahasiswa untuk
                        mengembangkan potensi, kreativitas, dan jiwa kepemimpinan.
                    </p>

                    <p>
                        Didirikan dengan semangat untuk memajukan kehidupan kampus, HIMAPUP aktif
                        menyelenggarakan berbagai kegiatan yang bermanfaat mulai dari seminar,
                        workshop, bakti sosial, hingga kompetisi yang dapat meningkatkan soft skill
                        maupun hard skill mahasiswa.
                    </p>
                </motion.div>

                <div className="vision-mission-grid">
                    <motion.div
                        className="vm-card glass-card"
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <h3>
                            <FiTarget className="vm-icon" /> Visi
                        </h3>
                        <p style={{ color: 'var(--color-text-secondary)', lineHeight: 1.8 }}>
                            Menjadi organisasi kemahasiswaan terdepan yang menghasilkan
                            kader-kader unggul, berprestasi, berkarakter, dan berdaya saing global.
                        </p>
                    </motion.div>

                    <motion.div
                        className="vm-card glass-card"
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <h3>
                            <FiStar className="vm-icon" /> Misi
                        </h3>
                        <ul>
                            <li>Meningkatkan kualitas akademik dan non-akademik mahasiswa</li>
                            <li>Menyelenggarakan kegiatan yang bermanfaat dan relevan</li>
                            <li>Membangun jaringan kerja sama dengan berbagai pihak</li>
                            <li>Menciptakan lingkungan kampus yang kondusif dan inklusif</li>
                            <li>Mengembangkan potensi kepemimpinan mahasiswa</li>
                        </ul>
                    </motion.div>
                </div>

                {/* Values */}
                <div style={{ marginTop: 'var(--spacing-4xl)' }}>
                    <SectionTitle
                        label="Nilai-Nilai"
                        title="Yang Kami Junjung"
                    />

                    <div className="stats-grid">
                        {[
                            { icon: <FiHeart />, title: 'Solidaritas', desc: 'Membangun kebersamaan dan rasa kekeluargaan' },
                            { icon: <FiAward />, title: 'Integritas', desc: 'Menjunjung tinggi kejujuran dan tanggung jawab' },
                            { icon: <FiTarget />, title: 'Inovasi', desc: 'Selalu berpikir kreatif dan solutif' },
                            { icon: <FiStar />, title: 'Profesional', desc: 'Bekerja dengan standar kualitas terbaik' },
                        ].map((value, i) => (
                            <motion.div
                                key={value.title}
                                className="stat-card glass-card"
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1, duration: 0.5 }}
                            >
                                <div className="stat-icon">{value.icon}</div>
                                <div style={{ fontSize: 'var(--font-size-lg)', fontWeight: 700, marginBottom: '0.5rem' }}>
                                    {value.title}
                                </div>
                                <div className="stat-label">{value.desc}</div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
