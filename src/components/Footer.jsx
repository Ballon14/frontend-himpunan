import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Instagram, Mail, MapPin, Youtube, Building2, PhoneCall } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';

export default function Footer() {
    const year = new Date().getFullYear();
    const { settings, getWaUrl, getWaDisplay } = useSettings();

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
                            {settings.site_description || 'Himpunan Mahasiswa Teknologi Konstruksi Bangunan Gedung Semarang. Membangun generasi unggul, berprestasi, dan berkarakter.'}
                        </p>
                        <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-primary)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <Building2 size={14} /> {settings.site_tagline || 'Membangun dari Pondasi Ilmu'}
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
                        {settings.whatsapp_number && (
                            <a href={getWaUrl('Halo Admin HMTKBG, saya ingin bertanya.')} target="_blank" rel="noopener noreferrer">
                                <PhoneCall size={18} style={{ marginRight: 6, verticalAlign: 'middle', color: '#2ecc71' }} />
                                {getWaDisplay()}
                            </a>
                        )}
                        {settings.email && (
                            <a href={`mailto:${settings.email}`}>
                                <Mail size={18} style={{ marginRight: 6, verticalAlign: 'middle' }} />
                                {settings.email}
                            </a>
                        )}
                        {settings.instagram_url && (
                            <a href={settings.instagram_url} target="_blank" rel="noopener noreferrer">
                                <Instagram size={18} style={{ marginRight: 6, verticalAlign: 'middle' }} />
                                {settings.instagram_username || '@hmtkbg'}
                            </a>
                        )}
                        {settings.tiktok_url && (
                            <a href={settings.tiktok_url} target="_blank" rel="noopener noreferrer">
                                <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: 6, verticalAlign: 'middle' }}>
                                    <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5v3a8 8 0 0 1-5-3v5.5a4 4 0 0 1-4-4 4 4 0 0 1 4-4Z"></path>
                                </svg>
                                {settings.tiktok_username || '@hmtkbg'}
                            </a>
                        )}
                        {settings.youtube_url && (
                            <a href={settings.youtube_url} target="_blank" rel="noopener noreferrer">
                                <Youtube size={18} style={{ marginRight: 6, verticalAlign: 'middle' }} />
                                {settings.youtube_channel || 'HMTKBG Politeknik PU'}
                            </a>
                        )}
                        {settings.alamat && (
                            <span style={{ display: 'flex', alignItems: 'flex-start', color: 'var(--color-text-muted)', fontSize: '0.85rem', marginTop: '4px' }}>
                                <MapPin size={18} style={{ marginRight: 6, flexShrink: 0, marginTop: 2 }} />
                                {settings.alamat}
                            </span>
                        )}
                    </div>
                </div>

                <div className="footer-bottom">
                    <p>&copy; {year} {settings.site_name || 'HMTKBG'}. All rights reserved.</p>
                    <div className="footer-socials">
                        {settings.whatsapp_number && (
                            <a href={getWaUrl('Halo Admin HMTKBG')} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp">
                                <PhoneCall size={20} />
                            </a>
                        )}
                        {settings.instagram_url && (
                            <a href={settings.instagram_url} target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                                <Instagram size={20} />
                            </a>
                        )}
                        {settings.email && (
                            <a href={`mailto:${settings.email}`} aria-label="Email">
                                <Mail size={20} />
                            </a>
                        )}
                        {settings.tiktok_url && (
                            <a href={settings.tiktok_url} target="_blank" rel="noopener noreferrer" aria-label="TikTok">
                                <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5v3a8 8 0 0 1-5-3v5.5a4 4 0 0 1-4-4 4 4 0 0 1 4-4Z"></path>
                                </svg>
                            </a>
                        )}
                        {settings.youtube_url && (
                            <a href={settings.youtube_url} target="_blank" rel="noopener noreferrer" aria-label="YouTube">
                                <Youtube size={20} />
                            </a>
                        )}
                    </div>
                </div>
            </div>
        </footer>
    );
}
