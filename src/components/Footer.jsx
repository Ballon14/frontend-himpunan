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
                        <a href="http://www.youtube.com/@hmtkbgpoliteknikpu6903" target="_blank" rel="noopener noreferrer" aria-label="YouTube">
                            <Youtube size={20} />
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
