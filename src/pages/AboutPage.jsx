import { useEffect, useRef, useLayoutEffect } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import SectionTitle from '../components/SectionTitle';
import PageTransition from '../components/PageTransition';
import SEO from '../components/SEO';
import { Target, Award, Heart, Star } from 'lucide-react';

export default function AboutPage() {
    const heroRef = useRef(null);
    const contentRef = useRef(null);

    useEffect(() => {
        // Keep empty for consistency or load specific data
    }, []);

    useLayoutEffect(() => {
        const ctx = gsap.context(() => {
            const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

            tl.fromTo('.section-title',
                { opacity: 0, y: 30 },
                { opacity: 1, y: 0, duration: 0.8 }
            )
                .fromTo(contentRef.current,
                    { opacity: 0, y: 20 },
                    { opacity: 1, y: 0, duration: 0.6 },
                    '-=0.4'
                );
        }, heroRef);

        return () => ctx.revert();
    }, []);

    return (
        <PageTransition>
            <SEO title="Tentang Kami" />
            <div className="page" ref={heroRef}>
                <div className="container">
                    <SectionTitle
                        label="Tentang Kami"
                        title="Himpunan Mahasiswa PUP Semarang"
                        description="Organisasi kemahasiswaan yang berkomitmen membangun generasi unggul."
                    />

                    <div
                        ref={contentRef}
                        className="about-content"
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
                    </div>

                    <div className="vision-mission-grid">
                        <motion.div
                            className="vm-card glass-card"
                            data-aos="fade-right"
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
                            data-aos="fade-left"
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
                    </div>

                    {/* Values */}
                    <div style={{ marginTop: 'var(--spacing-4xl)' }}>
                        <div data-aos="fade-up">
                            <SectionTitle
                                label="Nilai-Nilai"
                                title="Yang Kami Junjung"
                            />
                        </div>

                        <div className="stats-grid">
                            {[
                                { icon: <Heart size={32} />, title: 'Solidaritas', desc: 'Membangun kebersamaan dan rasa kekeluargaan' },
                                { icon: <Award size={32} />, title: 'Integritas', desc: 'Menjunjung tinggi kejujuran dan tanggung jawab' },
                                { icon: <Target size={32} />, title: 'Inovasi', desc: 'Selalu berpikir kreatif dan solutif' },
                                { icon: <Star size={32} />, title: 'Profesional', desc: 'Bekerja dengan standar kualitas terbaik' },
                            ].map((value, i) => (
                                <motion.div
                                    key={value.title}
                                    className="stat-card glass-card"
                                    data-aos="zoom-in-up"
                                    data-aos-delay={i * 100}
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
                        </div>
                    </div>
                </div>
            </div>
        </PageTransition>
    );
}
