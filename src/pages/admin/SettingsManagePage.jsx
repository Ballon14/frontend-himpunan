import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getSettings, updateSettings } from '../../api/admin';
import { DEFAULT_SETTINGS } from '../../context/SettingsContext';
import {
    Sliders, PhoneCall, Mail, MapPin, Clock, Globe,
    Instagram, Youtube, Save, RotateCcw, ExternalLink,
    CheckCircle2, AlertCircle, Building2, MessageSquare, Sparkles
} from 'lucide-react';
import { notifySuccess, notifyError } from '../../utils/toast';

export default function SettingsManagePage() {
    const queryClient = useQueryClient();
    const [activeTab, setActiveTab] = useState('kontak');
    const [formData, setFormData] = useState({ ...DEFAULT_SETTINGS });
    const [hasChanges, setHasChanges] = useState(false);

    const { data: serverSettings, isLoading, isError } = useQuery({
        queryKey: ['site-settings'],
        queryFn: async () => {
            const res = await getSettings();
            return res.data?.data || DEFAULT_SETTINGS;
        },
        staleTime: 60 * 1000,
    });

    useEffect(() => {
        if (serverSettings) {
            setFormData({ ...DEFAULT_SETTINGS, ...serverSettings });
            setHasChanges(false);
        }
    }, [serverSettings]);

    const mutation = useMutation({
        mutationFn: updateSettings,
        onSuccess: (res) => {
            queryClient.invalidateQueries({ queryKey: ['site-settings'] });
            notifySuccess('Pengaturan website berhasil disimpan!');
            setHasChanges(false);
            if (res.data?.data) {
                setFormData({ ...DEFAULT_SETTINGS, ...res.data.data });
            }
        },
        onError: (err) => {
            console.error('Save settings error:', err);
            notifyError(err.response?.data?.message || 'Gagal menyimpan pengaturan website.');
        },
    });

    const handleChange = (key, value) => {
        setFormData((prev) => ({ ...prev, [key]: value }));
        setHasChanges(true);
    };

    const handleSave = (e) => {
        e?.preventDefault();
        mutation.mutate(formData);
    };

    const handleReset = () => {
        if (serverSettings) {
            setFormData({ ...DEFAULT_SETTINGS, ...serverSettings });
            setHasChanges(false);
            notifySuccess('Formulir dikembalikan ke nilai tersimpan.');
        }
    };

    // Helper preview WA link
    const getCleanWa = () => {
        let wa = (formData.whatsapp_number || '').replace(/[^0-9]/g, '');
        if (wa.startsWith('0')) wa = '62' + wa.slice(1);
        return wa;
    };

    const waTestUrl = `https://wa.me/${getCleanWa()}?text=${encodeURIComponent('Halo Admin HMTKBG, ini pesan uji coba dari Pengaturan Website.')}`;

    return (
        <div className="admin-page" style={{ maxWidth: '1100px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* ─── Hero Banner ──────────────────────────────────────────────── */}
            <div style={{
                background: 'linear-gradient(135deg, rgba(52, 152, 219, 0.2) 0%, rgba(26, 29, 36, 0.95) 100%)',
                border: '1px solid var(--admin-border)',
                borderRadius: 'var(--admin-radius)',
                padding: '28px',
                position: 'relative',
                overflow: 'hidden',
                display: 'flex',
                alignItems: 'center',
                gap: '24px',
                flexWrap: 'wrap'
            }}>
                <div style={{
                    position: 'absolute',
                    top: '-60px',
                    right: '-60px',
                    width: '200px',
                    height: '200px',
                    borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(52, 152, 219, 0.3) 0%, transparent 70%)',
                    pointerEvents: 'none',
                }} />

                <div style={{
                    width: '74px',
                    height: '74px',
                    borderRadius: '18px',
                    background: 'linear-gradient(135deg, #2980b9 0%, #3498db 100%)',
                    color: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 8px 24px rgba(41, 128, 185, 0.35)',
                    flexShrink: 0,
                }}>
                    <Sliders size={36} strokeWidth={2.2} />
                </div>

                <div style={{ flex: 1, minWidth: '240px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                        <h1 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 700, color: '#fff' }}>
                            Pengaturan Website
                        </h1>
                        <span style={{
                            background: 'rgba(52, 152, 219, 0.2)',
                            color: '#60a5fa',
                            fontSize: '0.72rem',
                            fontWeight: 600,
                            padding: '3px 10px',
                            borderRadius: '999px',
                            border: '1px solid rgba(52, 152, 219, 0.3)'
                        }}>
                            Dinamis
                        </span>
                    </div>
                    <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--admin-text-muted)', lineHeight: '1.5' }}>
                        Kelola nomor WhatsApp, email resmi, alamat sekretariat, media sosial, dan identitas website HMTKBG langsung dari sini tanpa perlu mengubah source code.
                    </p>
                </div>

                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <button
                        type="button"
                        onClick={handleReset}
                        disabled={!hasChanges || mutation.isPending}
                        className="admin-btn admin-btn-secondary"
                        style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem' }}
                    >
                        <RotateCcw size={14} /> Reset
                    </button>
                    <button
                        type="button"
                        onClick={handleSave}
                        disabled={mutation.isPending}
                        className="admin-btn admin-btn-primary"
                        style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', fontWeight: 600 }}
                    >
                        {mutation.isPending ? (
                            <div className="admin-spinner" style={{ width: 14, height: 14 }} />
                        ) : (
                            <Save size={16} />
                        )}
                        <span>{mutation.isPending ? 'Menyimpan...' : 'Simpan Pengaturan'}</span>
                    </button>
                </div>
            </div>

            {/* ─── Navigation Tabs ──────────────────────────────────────────── */}
            <div style={{
                display: 'flex',
                gap: '8px',
                borderBottom: '1px solid var(--admin-border)',
                paddingBottom: '10px',
                overflowX: 'auto',
            }}>
                <button
                    type="button"
                    onClick={() => setActiveTab('kontak')}
                    style={{
                        padding: '10px 18px',
                        borderRadius: 'var(--admin-radius-sm)',
                        border: '1px solid',
                        borderColor: activeTab === 'kontak' ? 'rgba(39, 174, 96, 0.4)' : 'transparent',
                        background: activeTab === 'kontak' ? 'rgba(39, 174, 96, 0.15)' : 'transparent',
                        color: activeTab === 'kontak' ? '#2ecc71' : 'var(--admin-text-muted)',
                        fontWeight: 600,
                        fontSize: '0.85rem',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        transition: 'all 0.2s ease',
                    }}
                >
                    <PhoneCall size={16} /> Kontak & WhatsApp
                </button>
                <button
                    type="button"
                    onClick={() => setActiveTab('sosmed')}
                    style={{
                        padding: '10px 18px',
                        borderRadius: 'var(--admin-radius-sm)',
                        border: '1px solid',
                        borderColor: activeTab === 'sosmed' ? 'rgba(52, 152, 219, 0.4)' : 'transparent',
                        background: activeTab === 'sosmed' ? 'rgba(52, 152, 219, 0.15)' : 'transparent',
                        color: activeTab === 'sosmed' ? '#60a5fa' : 'var(--admin-text-muted)',
                        fontWeight: 600,
                        fontSize: '0.85rem',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        transition: 'all 0.2s ease',
                    }}
                >
                    <Globe size={16} /> Media Sosial
                </button>
                <button
                    type="button"
                    onClick={() => setActiveTab('identitas')}
                    style={{
                        padding: '10px 18px',
                        borderRadius: 'var(--admin-radius-sm)',
                        border: '1px solid',
                        borderColor: activeTab === 'identitas' ? 'rgba(168, 85, 247, 0.4)' : 'transparent',
                        background: activeTab === 'identitas' ? 'rgba(168, 85, 247, 0.15)' : 'transparent',
                        color: activeTab === 'identitas' ? '#c084fc' : 'var(--admin-text-muted)',
                        fontWeight: 600,
                        fontSize: '0.85rem',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        transition: 'all 0.2s ease',
                    }}
                >
                    <Building2 size={16} /> Identitas & Branding
                </button>
            </div>

            {/* ─── Form Content ─────────────────────────────────────────────── */}
            <form onSubmit={handleSave}>
                {/* ═══ TAB 1: KONTAK & WHATSAPP ═══ */}
                {activeTab === 'kontak' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        {/* WhatsApp Card */}
                        <div className="admin-form-card" style={{
                            background: 'var(--admin-surface)',
                            border: '1px solid var(--admin-border)',
                            borderRadius: 'var(--admin-radius)',
                            padding: '24px',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '16px',
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', borderBottom: '1px solid var(--admin-border)', paddingBottom: '12px' }}>
                                <div style={{
                                    width: '36px', height: '36px', borderRadius: '10px',
                                    background: 'rgba(39, 174, 96, 0.15)', color: '#2ecc71',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                                }}>
                                    <MessageSquare size={18} />
                                </div>
                                <div>
                                    <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 600, color: '#fff' }}>Nomor WhatsApp Utama</h3>
                                    <p style={{ margin: 0, fontSize: '0.78rem', color: 'var(--admin-text-muted)' }}>
                                        Digunakan pada tombol order merchandise, banner WhatsApp di halaman Komunitas, dan tombol kontak cepat.
                                    </p>
                                </div>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px', alignItems: 'start' }}>
                                <div className="admin-form-group">
                                    <label className="admin-label">
                                        Nomor WhatsApp <span style={{ color: 'var(--admin-danger)' }}>*</span>
                                    </label>
                                    <div style={{ position: 'relative' }}>
                                        <input
                                            type="text"
                                            value={formData.whatsapp_number || ''}
                                            onChange={(e) => handleChange('whatsapp_number', e.target.value)}
                                            placeholder="Contoh: 6281515630448 atau 081515630448"
                                            className="admin-input"
                                            style={{ paddingLeft: '40px' }}
                                        />
                                        <PhoneCall size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--admin-text-muted)' }} />
                                    </div>
                                    <small style={{ fontSize: '0.75rem', color: 'var(--admin-text-muted)', display: 'block', marginTop: '4px' }}>
                                        Dapat diisi diawali <code>62</code> atau <code>08</code>. Sistem akan otomatis menyesuaikan ke format internasional.
                                    </small>
                                </div>

                                <div style={{
                                    background: 'rgba(255, 255, 255, 0.03)',
                                    border: '1px dashed var(--admin-border)',
                                    borderRadius: 'var(--admin-radius-sm)',
                                    padding: '14px 18px',
                                }}>
                                    <div style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--admin-text-muted)', marginBottom: '6px' }}>
                                        Preview & Pengujian Tautan WhatsApp:
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                                        <code style={{ fontSize: '0.8rem', color: '#2ecc71', background: 'rgba(39, 174, 96, 0.1)', padding: '4px 8px', borderRadius: '4px' }}>
                                            wa.me/{getCleanWa()}
                                        </code>
                                        {getCleanWa() && (
                                            <a
                                                href={waTestUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                style={{
                                                    fontSize: '0.75rem',
                                                    color: '#3498db',
                                                    textDecoration: 'none',
                                                    display: 'inline-flex',
                                                    alignItems: 'center',
                                                    gap: '4px',
                                                    fontWeight: 500,
                                                }}
                                            >
                                                Uji Buka Chat <ExternalLink size={12} />
                                            </a>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Email & Operasional Card */}
                        <div className="admin-form-card" style={{
                            background: 'var(--admin-surface)',
                            border: '1px solid var(--admin-border)',
                            borderRadius: 'var(--admin-radius)',
                            padding: '24px',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '16px',
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', borderBottom: '1px solid var(--admin-border)', paddingBottom: '12px' }}>
                                <div style={{
                                    width: '36px', height: '36px', borderRadius: '10px',
                                    background: 'rgba(52, 152, 219, 0.15)', color: '#3498db',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                                }}>
                                    <Mail size={18} />
                                </div>
                                <div>
                                    <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 600, color: '#fff' }}>Email & Waktu Operasional</h3>
                                    <p style={{ margin: 0, fontSize: '0.78rem', color: 'var(--admin-text-muted)' }}>
                                        Informasi kontak resmi yang tercantum di Footer dan Halaman Kontak.
                                    </p>
                                </div>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
                                <div className="admin-form-group">
                                    <label className="admin-label">Email Resmi Himpunan</label>
                                    <div style={{ position: 'relative' }}>
                                        <input
                                            type="email"
                                            value={formData.email || ''}
                                            onChange={(e) => handleChange('email', e.target.value)}
                                            placeholder="hima.kbg@gmail.com"
                                            className="admin-input"
                                            style={{ paddingLeft: '40px' }}
                                        />
                                        <Mail size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--admin-text-muted)' }} />
                                    </div>
                                </div>

                                <div className="admin-form-group">
                                    <label className="admin-label">Jam Operasional Layanan</label>
                                    <div style={{ position: 'relative' }}>
                                        <input
                                            type="text"
                                            value={formData.jam_operasional || ''}
                                            onChange={(e) => handleChange('jam_operasional', e.target.value)}
                                            placeholder="Senin - Jumat: 08:00 - 16:00 WIB"
                                            className="admin-input"
                                            style={{ paddingLeft: '40px' }}
                                        />
                                        <Clock size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--admin-text-muted)' }} />
                                    </div>
                                </div>
                            </div>

                            <div className="admin-form-group">
                                <label className="admin-label">Alamat / Lokasi Sekretariat</label>
                                <textarea
                                    value={formData.alamat || ''}
                                    onChange={(e) => handleChange('alamat', e.target.value)}
                                    rows={3}
                                    placeholder="Alamat lengkap sekretariat himpunan..."
                                    className="admin-input"
                                    style={{ resize: 'vertical' }}
                                />
                            </div>
                        </div>
                    </div>
                )}

                {/* ═══ TAB 2: MEDIA SOSIAL ═══ */}
                {activeTab === 'sosmed' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        <div className="admin-form-card" style={{
                            background: 'var(--admin-surface)',
                            border: '1px solid var(--admin-border)',
                            borderRadius: 'var(--admin-radius)',
                            padding: '24px',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '20px',
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', borderBottom: '1px solid var(--admin-border)', paddingBottom: '12px' }}>
                                <div style={{
                                    width: '36px', height: '36px', borderRadius: '10px',
                                    background: 'rgba(168, 85, 247, 0.15)', color: '#c084fc',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                                }}>
                                    <Globe size={18} />
                                </div>
                                <div>
                                    <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 600, color: '#fff' }}>Tautan Media Sosial Resmi</h3>
                                    <p style={{ margin: 0, fontSize: '0.78rem', color: 'var(--admin-text-muted)' }}>
                                        Tautan ini akan langsung diperbarui pada ikon media sosial di Footer dan halaman publik.
                                    </p>
                                </div>
                            </div>

                            {/* Instagram */}
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
                                <div className="admin-form-group">
                                    <label className="admin-label">URL Profil Instagram</label>
                                    <div style={{ position: 'relative' }}>
                                        <input
                                            type="url"
                                            value={formData.instagram_url || ''}
                                            onChange={(e) => handleChange('instagram_url', e.target.value)}
                                            placeholder="https://www.instagram.com/hmtkbg"
                                            className="admin-input"
                                            style={{ paddingLeft: '40px' }}
                                        />
                                        <Instagram size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#e1306c' }} />
                                    </div>
                                </div>

                                <div className="admin-form-group">
                                    <label className="admin-label">Username Instagram (Label)</label>
                                    <input
                                        type="text"
                                        value={formData.instagram_username || ''}
                                        onChange={(e) => handleChange('instagram_username', e.target.value)}
                                        placeholder="@hmtkbg"
                                        className="admin-input"
                                    />
                                </div>
                            </div>

                            {/* TikTok */}
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
                                <div className="admin-form-group">
                                    <label className="admin-label">URL Profil TikTok</label>
                                    <div style={{ position: 'relative' }}>
                                        <input
                                            type="url"
                                            value={formData.tiktok_url || ''}
                                            onChange={(e) => handleChange('tiktok_url', e.target.value)}
                                            placeholder="https://www.tiktok.com/@hmtkbg"
                                            className="admin-input"
                                            style={{ paddingLeft: '40px' }}
                                        />
                                        <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#00f2fe' }}>
                                            <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5v3a8 8 0 0 1-5-3v5.5a4 4 0 0 1-4-4 4 4 0 0 1 4-4Z"></path>
                                        </svg>
                                    </div>
                                </div>

                                <div className="admin-form-group">
                                    <label className="admin-label">Username TikTok (Label)</label>
                                    <input
                                        type="text"
                                        value={formData.tiktok_username || ''}
                                        onChange={(e) => handleChange('tiktok_username', e.target.value)}
                                        placeholder="@hmtkbg"
                                        className="admin-input"
                                    />
                                </div>
                            </div>

                            {/* YouTube */}
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
                                <div className="admin-form-group">
                                    <label className="admin-label">URL Channel YouTube</label>
                                    <div style={{ position: 'relative' }}>
                                        <input
                                            type="url"
                                            value={formData.youtube_url || ''}
                                            onChange={(e) => handleChange('youtube_url', e.target.value)}
                                            placeholder="https://www.youtube.com/@hmtkbgpoliteknikpu6903"
                                            className="admin-input"
                                            style={{ paddingLeft: '40px' }}
                                        />
                                        <Youtube size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#ff0000' }} />
                                    </div>
                                </div>

                                <div className="admin-form-group">
                                    <label className="admin-label">Nama Channel YouTube (Label)</label>
                                    <input
                                        type="text"
                                        value={formData.youtube_channel || ''}
                                        onChange={(e) => handleChange('youtube_channel', e.target.value)}
                                        placeholder="HMTKBG Politeknik PU"
                                        className="admin-input"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* ═══ TAB 3: IDENTITAS & BRANDING ═══ */}
                {activeTab === 'identitas' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        <div className="admin-form-card" style={{
                            background: 'var(--admin-surface)',
                            border: '1px solid var(--admin-border)',
                            borderRadius: 'var(--admin-radius)',
                            padding: '24px',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '16px',
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', borderBottom: '1px solid var(--admin-border)', paddingBottom: '12px' }}>
                                <div style={{
                                    width: '36px', height: '36px', borderRadius: '10px',
                                    background: 'rgba(230, 126, 34, 0.15)', color: '#e67e22',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                                }}>
                                    <Building2 size={18} />
                                </div>
                                <div>
                                    <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 600, color: '#fff' }}>Identitas Organisasi</h3>
                                    <p style={{ margin: 0, fontSize: '0.78rem', color: 'var(--admin-text-muted)' }}>
                                        Nama, tagline, dan deskripsi resmi yang ditampilkan pada header dan footer.
                                    </p>
                                </div>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
                                <div className="admin-form-group">
                                    <label className="admin-label">Nama Website / Organisasi</label>
                                    <input
                                        type="text"
                                        value={formData.site_name || ''}
                                        onChange={(e) => handleChange('site_name', e.target.value)}
                                        placeholder="HMTKBG Politeknik PU"
                                        className="admin-input"
                                    />
                                </div>

                                <div className="admin-form-group">
                                    <label className="admin-label">Tagline Singkat</label>
                                    <input
                                        type="text"
                                        value={formData.site_tagline || ''}
                                        onChange={(e) => handleChange('site_tagline', e.target.value)}
                                        placeholder="Himpunan Mahasiswa Teknologi Konstruksi Bangunan Gedung"
                                        className="admin-input"
                                    />
                                </div>
                            </div>

                            <div className="admin-form-group">
                                <label className="admin-label">Deskripsi Singkat Himpunan</label>
                                <textarea
                                    value={formData.site_description || ''}
                                    onChange={(e) => handleChange('site_description', e.target.value)}
                                    rows={3}
                                    placeholder="Deskripsi singkat mengenai visi dan kegiatan himpunan..."
                                    className="admin-input"
                                    style={{ resize: 'vertical' }}
                                />
                            </div>
                        </div>
                    </div>
                )}

                {/* ─── Bottom Actions ───────────────────────────────────────────── */}
                <div style={{
                    marginTop: '20px',
                    display: 'flex',
                    justifyContent: 'flex-end',
                    gap: '12px',
                    alignItems: 'center',
                }}>
                    <button
                        type="button"
                        onClick={handleReset}
                        disabled={!hasChanges || mutation.isPending}
                        className="admin-btn admin-btn-secondary"
                        style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
                    >
                        <RotateCcw size={14} /> Batalkan Perubahan
                    </button>
                    <button
                        type="submit"
                        disabled={mutation.isPending}
                        className="admin-btn admin-btn-primary"
                        style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: '160px', justifyContent: 'center' }}
                    >
                        {mutation.isPending ? (
                            <div className="admin-spinner" style={{ width: 14, height: 14 }} />
                        ) : (
                            <Save size={16} />
                        )}
                        <span>{mutation.isPending ? 'Menyimpan...' : 'Simpan Semua'}</span>
                    </button>
                </div>
            </form>
        </div>
    );
}
