import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Instagram, Mail, MapPin, Youtube, Building2 } from 'lucide-react';

export default function Footer() {
    const year = new Date().getFullYear();

    return (
        <footer className="footer">
            <div className="container">
                <div className="footer-grid">
                    <div className="footer-brand">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1rem' }}>
                            <motion.img
                                src="/logo.jpg"
                                alt="Logo HMTKBG"
                                style={{ height: '50px', width: 'auto', borderRadius: '50%' }}
                                whileHover={{ rotate: 10, scale: 1.1 }}
                                transition={{ type: 'spring', stiffness: 300, damping: 15 }}
                            />
                            <h3 style={{ margin: 0 }}>HM<span>TKBG</span></h3>
                        </div>
                        <p style={{ marginBottom: '0.75rem' }}>
                            Himpunan Mahasiswa Teknologi Konstruksi Bangunan Gedung Semarang.
                            Membangun generasi unggul, berprestasi, dan berkarakter.
                        </p>
                        <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-primary)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <Building2 size={14} /> Membangun dari Pondasi Ilmu
                        </p>
                    </div>

                    <div className="footer-col">
                        <h4>Menu</h4>
                        <Link to="/">Beranda</Link>
                        <Link to="/tentang">Tentang</Link>
                        <Link to="/anggota">Anggota</Link>
                        <Link to="/berita">Berita</Link>
                    </div>

                    <div className="footer-col">
                        <h4>Lainnya</h4>
                        <Link to="/program-kerja">Program Kerja</Link>
                        <Link to="/galeri">Galeri</Link>
                        <Link to="/komunitas">Komunitas</Link>
                        <Link to="/kontak">Kontak</Link>
                    </div>

                    <div className="footer-col">
                        <h4>Kontak</h4>
                        <a href="mailto:hima.kbg@gmail.com">
                            <Mail size={18} style={{ marginRight: 6, verticalAlign: 'middle' }} />
                            hima.kbg@gmail.com
                        </a>
                        <a href="https://www.instagram.com/hmtkbg?igsh=M2owdXpkMXprcjA4" target="_blank" rel="noopener noreferrer">
                            <Instagram size={18} style={{ marginRight: 6, verticalAlign: 'middle' }} />
                            @hmtkbg
                        </a>
                        <a href="https://www.tiktok.com/@hmtkbg?_r=1&_t=ZS-9AM3oNXfHBm" target="_blank" rel="noopener noreferrer">
                            <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: 6, verticalAlign: 'middle' }}>
                                <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5v3a8 8 0 0 1-5-3v5.5a4 4 0 0 1-4-4 4 4 0 0 1 4-4Z"></path>
                            </svg>
                            @hmtkbg
                        </a>
                        <a href="https://www.youtube.com/@hmtkbgpoliteknikpu6903" target="_blank" rel="noopener noreferrer">
                            <Youtube size={18} style={{ marginRight: 6, verticalAlign: 'middle' }} />
                            HMTKBG Politeknik PU
                        </a>
                        <a href="#">
                            <MapPin size={18} style={{ marginRight: 6, verticalAlign: 'middle' }} />
                            Semarang, Jawa Tengah
                        </a>
                    </div>
                </div>

                <div className="footer-bottom">
                    <p>&copy; {year} HMTKBG. All rights reserved.</p>
                    <div className="footer-socials">
                        <a href="https://www.instagram.com/hmtkbg?igsh=M2owdXpkMXprcjA4" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                            <Instagram size={20} />
                        </a>
                        <a href="mailto:hima.kbg@gmail.com" aria-label="Email">
                            <Mail size={20} />
                        </a>
                        <a href="https://www.tiktok.com/@hmtkbg?_r=1&_t=ZS-9AM3oNXfHBm" target="_blank" rel="noopener noreferrer" aria-label="TikTok">
                            <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5v3a8 8 0 0 1-5-3v5.5a4 4 0 0 1-4-4 4 4 0 0 1 4-4Z"></path>
                            </svg>
                        </a>
                        <a href="https://www.youtube.com/@hmtkbgpoliteknikpu6903" target="_blank" rel="noopener noreferrer" aria-label="YouTube">
                            <Youtube size={20} />
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
