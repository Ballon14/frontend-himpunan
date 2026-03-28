import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Mail, MapPin, Instagram, Send } from 'lucide-react';
import SectionTitle from '../components/SectionTitle';
import PageTransition from '../components/PageTransition';
import SEO from '../components/SEO';
import { postPesan } from '../api/pesan';

export default function ContactPage() {
    const [formData, setFormData] = useState({ nama: '', email: '', isi_pesan: '' });
    const [status, setStatus] = useState({ loading: false, success: false, error: null });

    useEffect(() => {
        // Init logic
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus({ loading: true, success: false, error: null });
        try {
            await postPesan(formData);
            setStatus({ loading: false, success: true, error: null });
            setFormData({ nama: '', email: '', isi_pesan: '' });
            setTimeout(() => setStatus(s => ({ ...s, success: false })), 5000);
        } catch (err) {
            setStatus({
                loading: false, success: false,
                error: err.response?.data?.message || 'Terjadi kesalahan saat mengirim pesan.'
            });
        }
    };

    return (
        <PageTransition>
            <SEO title="Kontak" />
            <div className="page">
                <div className="container">
                    <div data-aos="fade-down">
                        <SectionTitle
                            label="Kontak"
                            title="Hubungi Kami"
                            description="Punya pertanyaan atau masukan? Jangan ragu untuk menghubungi kami."
                        />
                    </div>

                    <div className="contact-grid">
                        <div className="contact-info glass-card" data-aos="fade-right" style={{ display: 'flex', flexDirection: 'column', gap: '2rem', padding: '2.5rem' }}>
                            <div>
                                <h3 style={{ fontSize: 'var(--font-size-xl)', marginBottom: '0.5rem' }}>Informasi Kontak</h3>
                                <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-sm)', lineHeight: 1.6 }}>
                                    Layanan ini dikelola penuh oleh anggota HMTKBG. Waktu operasional layanan adalah hari kerja pukul 08:00 WIB hingga 16:00 WIB.
                                </p>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginTop: '1rem' }}>
                                <motion.div
                                    style={{ display: 'flex', alignItems: 'flex-start', gap: '1.25rem' }}
                                    whileHover={{ x: 5 }}
                                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                                >
                                    <div className="contact-icon" style={{
                                        width: 50, height: 50, borderRadius: '12px',
                                        backgroundColor: 'rgba(var(--color-primary-rgb), 0.15)',
                                        color: 'var(--color-primary)',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        fontSize: '1.5rem', shrink: 0
                                    }}>
                                        <MapPin size={28} />
                                    </div>
                                    <div>
                                        <h4 style={{ fontSize: 'var(--font-size-md)', marginBottom: '0.25rem', fontWeight: 600 }}>Sekretariat HMTKBG</h4>
                                        <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-sm)', lineHeight: 1.6 }}>
                                            Gedung Pusat Kegiatan Mahasiswa Lt. 2<br />
                                            Teknologi Konstruksi Bangunan Gedung<br />
                                            Semarang, Jawa Tengah
                                        </p>
                                    </div>
                                </motion.div>

                                <motion.div
                                    style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}
                                    whileHover={{ x: 5 }}
                                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                                >
                                    <div className="contact-icon" style={{
                                        width: 50, height: 50, borderRadius: '12px',
                                        backgroundColor: 'rgba(var(--color-primary-rgb), 0.15)',
                                        color: 'var(--color-primary)',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        fontSize: '1.5rem', shrink: 0
                                    }}>
                                        <Mail size={28} />
                                    </div>
                                    <div>
                                        <h4 style={{ fontSize: 'var(--font-size-md)', marginBottom: '0.25rem', fontWeight: 600 }}>Email</h4>
                                        <p style={{ fontSize: 'var(--font-size-sm)' }}>
                                            <a href="mailto:hima.kbg@gmail.com" style={{ color: 'var(--color-text-primary)', textDecoration: 'none', transition: 'color 0.2s' }} onMouseOver={e => e.target.style.color = 'var(--color-primary)'} onMouseOut={e => e.target.style.color = 'var(--color-text-primary)'}>
                                                hima.kbg@gmail.com
                                            </a>
                                        </p>
                                    </div>
                                </motion.div>

                                <motion.div
                                    style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}
                                    whileHover={{ x: 5 }}
                                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                                >
                                    <div className="contact-icon" style={{
                                        width: 50, height: 50, borderRadius: '12px',
                                        backgroundColor: 'rgba(var(--color-primary-rgb), 0.15)',
                                        color: 'var(--color-primary)',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        fontSize: '1.5rem', shrink: 0
                                    }}>
                                        <Instagram size={28} />
                                    </div>
                                    <div>
                                        <h4 style={{ fontSize: 'var(--font-size-md)', marginBottom: '0.25rem', fontWeight: 600 }}>Instagram</h4>
                                        <p style={{ fontSize: 'var(--font-size-sm)' }}>
                                            <a href="https://www.instagram.com/hmtkbg?igsh=M2owdXpkMXprcjA4" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-text-primary)', textDecoration: 'none', transition: 'color 0.2s' }} onMouseOver={e => e.target.style.color = 'var(--color-primary)'} onMouseOut={e => e.target.style.color = 'var(--color-text-primary)'}>
                                                @hmtkbg
                                            </a>
                                        </p>
                                    </div>
                                </motion.div>
                            </div>
                        </div>

                        <div className="contact-form glass-card" data-aos="fade-left" style={{ padding: '2.5rem' }}>
                            <h3 style={{ marginBottom: 20, fontSize: 'var(--font-size-xl)' }}>Kirim Pesan</h3>

                            {status.success && (
                                <motion.div
                                    className="alert alert-success"
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                >
                                    ✅ Pesan berhasil dikirim. Terima kasih!
                                </motion.div>
                            )}

                            {status.error && (
                                <motion.div
                                    className="alert alert-error"
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                >
                                    ❌ {status.error}
                                </motion.div>
                            )}

                            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                                <div>
                                    <label style={{ display: 'block', marginBottom: 'var(--spacing-xs)', fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>Nama <span style={{ color: 'var(--color-danger)' }}>*</span></label>
                                    <input
                                        type="text"
                                        className="form-input search-input"
                                        style={{ width: '100%', paddingLeft: '1rem' }}
                                        value={formData.nama}
                                        onChange={e => setFormData({ ...formData, nama: e.target.value })}
                                        placeholder="Masukkan nama Anda"
                                        required
                                    />
                                </div>

                                <div>
                                    <label style={{ display: 'block', marginBottom: 'var(--spacing-xs)', fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>Email (Opsional)</label>
                                    <input
                                        type="email"
                                        className="form-input search-input"
                                        style={{ width: '100%', paddingLeft: '1rem' }}
                                        value={formData.email}
                                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                                        placeholder="Masukkan email Anda"
                                    />
                                </div>

                                <div>
                                    <label style={{ display: 'block', marginBottom: 'var(--spacing-xs)', fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>Pesan <span style={{ color: 'var(--color-danger)' }}>*</span></label>
                                    <textarea
                                        className="form-input search-input"
                                        rows="5"
                                        style={{ width: '100%', paddingLeft: '1rem', paddingTop: '0.75rem', resize: 'vertical' }}
                                        required
                                        value={formData.isi_pesan}
                                        onChange={e => setFormData({ ...formData, isi_pesan: e.target.value })}
                                        placeholder="Tulis pesan Anda di sini..."
                                    ></textarea>
                                </div>

                                <motion.button
                                    type="submit"
                                    className="btn btn-primary"
                                    disabled={status.loading}
                                    style={{ alignSelf: 'flex-start', opacity: status.loading ? 0.7 : 1 }}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    {status.loading ? 'Mengirim...' : <><Send size={18} style={{ marginRight: '0.4rem' }} /> Kirim Pesan</>}
                                </motion.button>
                            </form>
                        </div>
                    </div>

                    {/* Google Maps Embed */}
                    <div
                        style={{
                            marginTop: 'var(--spacing-3xl)',
                            borderRadius: 'var(--radius-lg)',
                            overflow: 'hidden',
                            border: '1px solid var(--color-border)',
                        }}
                        data-aos="fade-up"
                    >
                        <iframe
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15841.060957012895!2d110.4310954871582!3d-6.977998799999991!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e708d71c4e34935%3A0xb31f9b4f9556f45b!2sPublic%20Works%20Polytechnic!5e0!3m2!1sen!2sid!4v1772291760982!5m2!1sen!2sid"
                            width="100%"
                            height="400"
                            style={{ border: 0, display: 'block' }}
                            allowFullScreen
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            title="Lokasi HMTKBG"
                        ></iframe>
                    </div>
                </div>
            </div>
        </PageTransition>
    );
}
