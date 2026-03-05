import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import SectionTitle from '../components/SectionTitle';
import { FiMail, FiMapPin, FiPhone, FiInstagram } from 'react-icons/fi';
import { postPesan } from '../api/pesan';

const contactItems = [
    {
        icon: <FiMail />,
        title: 'Email',
        description: 'himpunan@pup.ac.id',
        link: 'mailto:himpunan@pup.ac.id',
    },
    {
        icon: <FiPhone />,
        title: 'Telepon',
        description: '+62 24 123 4567',
        link: 'tel:+622412345567',
    },
    {
        icon: <FiMapPin />,
        title: 'Alamat',
        description: 'Jl. Soekarno Hatta No.100, Siwalan, Kec. Gayamsari, Kota Semarang, Jawa Tengah 50166',
    },
    {
        icon: <FiInstagram />,
        title: 'Instagram',
        description: '@himapup',
        link: 'https://instagram.com/himapup',
    },
];

export default function ContactPage() {
    const [formData, setFormData] = useState({ nama: '', email: '', isi_pesan: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState({ success: false, message: '' });

    useEffect(() => {
        document.title = 'Kontak — HIMAPUP';
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setSubmitStatus({ success: false, message: '' });

        try {
            // Provide a default name if anonymous
            const dataToSubmit = {
                ...formData,
                nama: formData.nama.trim() || 'Anonim',
                email: formData.email.trim() || null,
            };

            await postPesan(dataToSubmit);
            setSubmitStatus({ success: true, message: 'Pesan berhasil dikirim. Terima kasih atas masukannya!' });
            setFormData({ nama: '', email: '', isi_pesan: '' });
        } catch (error) {
            setSubmitStatus({
                success: false,
                message: error.response?.data?.message || 'Gagal mengirim pesan. Silakan coba lagi.'
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="page">
            <div className="container">
                <SectionTitle
                    label="Kontak"
                    title="Hubungi Kami"
                    description="Jangan ragu untuk menghubungi kami jika ada pertanyaan atau ingin berkolaborasi."
                />

                <div className="contact-grid">
                    {contactItems.map((item, i) => (
                        <motion.div
                            key={item.title}
                            className="contact-info-card glass-card"
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1, duration: 0.5 }}
                        >
                            <div className="contact-icon">{item.icon}</div>
                            <div>
                                <h3>{item.title}</h3>
                                {item.link ? (
                                    <a href={item.link} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-text-secondary)' }}>
                                        {item.description}
                                    </a>
                                ) : (
                                    <p>{item.description}</p>
                                )}
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Anonymous Form Section */}
                <motion.div
                    className="contact-form-section glass-card"
                    style={{
                        marginTop: 'var(--spacing-3xl)',
                        padding: 'var(--spacing-2xl) var(--spacing-lg)',
                    }}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                >
                    <div style={{ textAlign: 'center', marginBottom: 'var(--spacing-xl)', maxWidth: 600, margin: '0 auto var(--spacing-xl)' }}>
                        <h2 style={{ fontSize: 'var(--font-size-2xl)', marginBottom: 'var(--spacing-sm)' }}>Kirim Pesan Anonim</h2>
                        <p style={{ color: 'var(--color-text-secondary)' }}>Punya kritik, saran, atau pertanyaan? Sampaikan kepada kami. Identitas Anda (nama/email) bersifat opsional.</p>
                    </div>

                    <form onSubmit={handleSubmit} style={{ maxWidth: 600, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
                        {submitStatus.message && (
                            <div className={`alert ${submitStatus.success ? 'alert-success' : 'alert-danger'}`} style={{
                                padding: '1rem',
                                borderRadius: 'var(--radius-md)',
                                backgroundColor: submitStatus.success ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                                color: submitStatus.success ? '#22c55e' : '#ef4444',
                                border: `1px solid ${submitStatus.success ? 'rgba(34, 197, 94, 0.2)' : 'rgba(239, 68, 68, 0.2)'}`,
                                marginBottom: 'var(--spacing-sm)'
                            }}>
                                {submitStatus.message}
                            </div>
                        )}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-md)' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: 'var(--spacing-xs)', fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>Nama (Opsional)</label>
                                <input
                                    type="text"
                                    name="nama"
                                    value={formData.nama}
                                    onChange={handleChange}
                                    placeholder="Anonim"
                                    className="form-input search-input"
                                    style={{ width: '100%', paddingLeft: '1rem' }}
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: 'var(--spacing-xs)', fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>Email (Opsional)</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="email@contoh.com"
                                    className="form-input search-input"
                                    style={{ width: '100%', paddingLeft: '1rem' }}
                                />
                            </div>
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: 'var(--spacing-xs)', fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>Pesan *</label>
                            <textarea
                                name="isi_pesan"
                                required
                                value={formData.isi_pesan}
                                onChange={handleChange}
                                placeholder="Tuliskan pesan Anda di sini..."
                                className="form-input search-input"
                                rows="5"
                                style={{ width: '100%', paddingLeft: '1rem', paddingTop: '0.75rem', resize: 'vertical' }}
                            ></textarea>
                        </div>
                        <button type="submit" className="btn btn-primary" disabled={isSubmitting} style={{ alignSelf: 'flex-start', opacity: isSubmitting ? 0.7 : 1 }}>
                            {isSubmitting ? 'Mengirim...' : 'Kirim Pesan'}
                        </button>
                    </form>
                </motion.div>

                {/* Google Maps Embed */}
                <motion.div
                    style={{
                        marginTop: 'var(--spacing-3xl)',
                        borderRadius: 'var(--radius-lg)',
                        overflow: 'hidden',
                        border: '1px solid var(--color-border)',
                    }}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                >
                    <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15841.060957012895!2d110.4310954871582!3d-6.977998799999991!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e708d71c4e34935%3A0xb31f9b4f9556f45b!2sPublic%20Works%20Polytechnic!5e0!3m2!1sen!2sid!4v1772291760982!5m2!1sen!2sid" width="100%" height="400" style={{ border: 0 }} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade" title="Lokasi HIMAPUP"></iframe>
                </motion.div>
            </div>
        </div>
    );
}
