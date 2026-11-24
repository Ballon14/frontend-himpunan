import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { updateProfile, changePassword } from '../../api/admin';
import { notifySuccess, notifyError } from '../../utils/toast';
import {
    User, Mail, Lock, ShieldCheck, Save, KeyRound,
    Eye, EyeOff, CheckCircle2, AlertCircle, Clock, ShieldAlert, BadgeCheck
} from 'lucide-react';

export default function ProfileManagePage() {
    const { user, updateUser } = useAuth();

    // Profile state
    const [name, setName] = useState(user?.name || '');
    const [email, setEmail] = useState(user?.email || '');
    const [loadingProfile, setLoadingProfile] = useState(false);

    // Password state
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loadingPassword, setLoadingPassword] = useState(false);

    const isLengthValid = newPassword.length >= 6;
    const isMatchValid = newPassword && newPassword === confirmPassword;

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        if (!name.trim() || !email.trim()) {
            notifyError('Nama dan email wajib diisi.');
            return;
        }

        setLoadingProfile(true);
        try {
            const res = await updateProfile({ name: name.trim(), email: email.trim() });
            const { user: updatedUser, token: newToken } = res.data.data;
            updateUser(updatedUser, newToken);
            notifySuccess('Profil administrator berhasil diperbarui!');
        } catch (err) {
            console.error('Update profile error:', err);
            notifyError(err.response?.data?.message || 'Gagal memperbarui profil.');
        } finally {
            setLoadingProfile(false);
        }
    };

    const handleChangePassword = async (e) => {
        e.preventDefault();
        if (!currentPassword) {
            notifyError('Masukkan password saat ini.');
            return;
        }
        if (!isLengthValid) {
            notifyError('Password baru harus minimal 6 karakter.');
            return;
        }
        if (!isMatchValid) {
            notifyError('Konfirmasi password tidak cocok.');
            return;
        }

        setLoadingPassword(true);
        try {
            await changePassword({
                current_password: currentPassword,
                new_password: newPassword,
                confirm_password: confirmPassword,
            });
            notifySuccess('Kata sandi berhasil diubah!');
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
        } catch (err) {
            console.error('Change password error:', err);
            notifyError(err.response?.data?.message || 'Gagal mengubah password.');
        } finally {
            setLoadingPassword(false);
        }
    };

    return (
        <div className="admin-page" style={{ maxWidth: '1100px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* ─── Profile Hero Banner ────────────────────────────── */}
            <div style={{
                background: 'linear-gradient(135deg, rgba(192, 57, 43, 0.25) 0%, rgba(26, 29, 36, 0.95) 100%)',
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
                {/* Background decorative glow */}
                <div style={{
                    position: 'absolute',
                    top: '-60px',
                    right: '-60px',
                    width: '200px',
                    height: '200px',
                    borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(192, 57, 43, 0.35) 0%, transparent 70%)',
                    pointerEvents: 'none',
                }} />

                <div style={{
                    width: '84px',
                    height: '84px',
                    borderRadius: '20px',
                    background: 'linear-gradient(135deg, var(--admin-primary) 0%, #e67e22 100%)',
                    color: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '34px',
                    fontWeight: 700,
                    boxShadow: '0 8px 24px rgba(192, 57, 43, 0.35)',
                    flexShrink: 0,
                    textTransform: 'uppercase'
                }}>
                    {user?.name?.charAt(0) || 'A'}
                </div>

                <div style={{ flex: 1, minWidth: '240px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', marginBottom: '6px' }}>
                        <h2 style={{ fontSize: '1.4rem', fontWeight: 700, margin: 0, color: 'var(--admin-text)' }}>
                            {user?.name || 'Administrator'}
                        </h2>
                        <span style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            background: 'rgba(39, 174, 96, 0.15)',
                            color: 'var(--admin-success)',
                            border: '1px solid rgba(39, 174, 96, 0.3)',
                            padding: '3px 10px',
                            borderRadius: '20px',
                            fontSize: '0.75rem',
                            fontWeight: 600
                        }}>
                            <BadgeCheck size={13} />
                            Aktif
                        </span>
                    </div>
                    <p style={{ margin: '0 0 10px', color: 'var(--admin-text-muted)', fontSize: '0.88rem' }}>
                        {user?.email || 'admin@hmtkbg.com'}
                    </p>
                    <div style={{ display: 'flex', gap: '16px', fontSize: '0.8rem', color: 'var(--admin-text-muted)', flexWrap: 'wrap' }}>
                        <span>Role: <strong style={{ color: 'var(--admin-text)' }}>Superadministrator</strong></span>
                        <span>•</span>
                        <span>Sesi: <strong style={{ color: 'var(--admin-text)' }}>Stateless JWT (24 Jam)</strong></span>
                    </div>
                </div>
            </div>

            {/* ─── 2-Column Cards Grid ────────────────────────────── */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '24px' }}>
                {/* ─── Card 1: Informasi Profil ────────────────────── */}
                <div style={{
                    background: 'var(--admin-surface)',
                    border: '1px solid var(--admin-border)',
                    borderRadius: 'var(--admin-radius)',
                    padding: '24px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '20px',
                    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2)'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', borderBottom: '1px solid var(--admin-border)', paddingBottom: '16px' }}>
                        <div style={{
                            width: '42px',
                            height: '42px',
                            borderRadius: '10px',
                            background: 'var(--admin-primary-soft)',
                            color: 'var(--admin-primary)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0
                        }}>
                            <User size={20} />
                        </div>
                        <div>
                            <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 600, color: 'var(--admin-text)' }}>Informasi Profil</h3>
                            <span style={{ fontSize: '0.8rem', color: 'var(--admin-text-muted)' }}>Perbarui nama dan alamat email akun Anda</span>
                        </div>
                    </div>

                    <form onSubmit={handleUpdateProfile} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                        <div className="admin-form-group">
                            <label htmlFor="admin-name" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <User size={14} />
                                <span>Nama Lengkap</span>
                            </label>
                            <input
                                id="admin-name"
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Masukkan nama administrator"
                                required
                            />
                        </div>

                        <div className="admin-form-group">
                            <label htmlFor="admin-email" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <Mail size={14} />
                                <span>Alamat Email</span>
                            </label>
                            <input
                                id="admin-email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="email@contoh.com"
                                required
                            />
                        </div>

                        <div className="admin-form-group">
                            <label htmlFor="admin-role" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <ShieldCheck size={14} />
                                <span>Peran (Role)</span>
                            </label>
                            <input
                                id="admin-role"
                                type="text"
                                value="Superadministrator"
                                disabled
                                style={{ background: 'rgba(255, 255, 255, 0.04)', color: 'var(--admin-text-muted)', cursor: 'not-allowed' }}
                            />
                        </div>

                        <button
                            type="submit"
                            className="admin-btn admin-btn-primary"
                            disabled={loadingProfile}
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '8px',
                                padding: '12px 20px',
                                marginTop: '6px'
                            }}
                        >
                            <Save size={16} />
                            <span>{loadingProfile ? 'Menyimpan...' : 'Simpan Perubahan'}</span>
                        </button>
                    </form>
                </div>

                {/* ─── Card 2: Keamanan & Kata Sandi ─────────────────── */}
                <div style={{
                    background: 'var(--admin-surface)',
                    border: '1px solid var(--admin-border)',
                    borderRadius: 'var(--admin-radius)',
                    padding: '24px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '20px',
                    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2)'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', borderBottom: '1px solid var(--admin-border)', paddingBottom: '16px' }}>
                        <div style={{
                            width: '42px',
                            height: '42px',
                            borderRadius: '10px',
                            background: 'rgba(230, 126, 34, 0.14)',
                            color: '#e67e22',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0
                        }}>
                            <KeyRound size={20} />
                        </div>
                        <div>
                            <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 600, color: 'var(--admin-text)' }}>Ganti Kata Sandi</h3>
                            <span style={{ fontSize: '0.8rem', color: 'var(--admin-text-muted)' }}>Gunakan kata sandi kuat minimal 6 karakter</span>
                        </div>
                    </div>

                    <form onSubmit={handleChangePassword} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                        {/* Current Password */}
                        <div className="admin-form-group">
                            <label htmlFor="current-password" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <Lock size={14} />
                                <span>Kata Sandi Saat Ini</span>
                            </label>
                            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                                <input
                                    id="current-password"
                                    type={showCurrentPassword ? 'text' : 'password'}
                                    value={currentPassword}
                                    onChange={(e) => setCurrentPassword(e.target.value)}
                                    placeholder="••••••••"
                                    style={{ paddingRight: '42px' }}
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                    style={{
                                        position: 'absolute',
                                        right: '12px',
                                        background: 'none',
                                        border: 'none',
                                        color: 'var(--admin-text-muted)',
                                        cursor: 'pointer',
                                        padding: '4px',
                                        display: 'flex',
                                        alignItems: 'center'
                                    }}
                                    tabIndex={-1}
                                    title={showCurrentPassword ? 'Sembunyikan' : 'Tampilkan'}
                                >
                                    {showCurrentPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                        </div>

                        {/* New Password */}
                        <div className="admin-form-group">
                            <label htmlFor="new-password" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <KeyRound size={14} />
                                <span>Kata Sandi Baru</span>
                            </label>
                            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                                <input
                                    id="new-password"
                                    type={showNewPassword ? 'text' : 'password'}
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    placeholder="Minimal 6 karakter"
                                    style={{ paddingRight: '42px' }}
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowNewPassword(!showNewPassword)}
                                    style={{
                                        position: 'absolute',
                                        right: '12px',
                                        background: 'none',
                                        border: 'none',
                                        color: 'var(--admin-text-muted)',
                                        cursor: 'pointer',
                                        padding: '4px',
                                        display: 'flex',
                                        alignItems: 'center'
                                    }}
                                    tabIndex={-1}
                                    title={showNewPassword ? 'Sembunyikan' : 'Tampilkan'}
                                >
                                    {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                        </div>

                        {/* Confirm Password */}
                        <div className="admin-form-group">
                            <label htmlFor="confirm-password" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <CheckCircle2 size={14} />
                                <span>Konfirmasi Kata Sandi Baru</span>
                            </label>
                            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                                <input
                                    id="confirm-password"
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder="Ulangi kata sandi baru"
                                    style={{ paddingRight: '42px' }}
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    style={{
                                        position: 'absolute',
                                        right: '12px',
                                        background: 'none',
                                        border: 'none',
                                        color: 'var(--admin-text-muted)',
                                        cursor: 'pointer',
                                        padding: '4px',
                                        display: 'flex',
                                        alignItems: 'center'
                                    }}
                                    tabIndex={-1}
                                    title={showConfirmPassword ? 'Sembunyikan' : 'Tampilkan'}
                                >
                                    {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                        </div>

                        {/* Password Requirements Checklist */}
                        {newPassword.length > 0 && (
                            <div style={{
                                background: 'rgba(255, 255, 255, 0.03)',
                                border: '1px solid var(--admin-border)',
                                borderRadius: 'var(--admin-radius-sm)',
                                padding: '10px 14px',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '6px',
                                fontSize: '0.8rem'
                            }}>
                                <span style={{ color: isLengthValid ? 'var(--admin-success)' : 'var(--admin-text-muted)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    <CheckCircle2 size={13} style={{ color: isLengthValid ? 'var(--admin-success)' : 'inherit' }} />
                                    Minimal 6 karakter ({newPassword.length}/6)
                                </span>
                                <span style={{ color: isMatchValid ? 'var(--admin-success)' : 'var(--admin-text-muted)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    <CheckCircle2 size={13} style={{ color: isMatchValid ? 'var(--admin-success)' : 'inherit' }} />
                                    Konfirmasi kata sandi cocok
                                </span>
                            </div>
                        )}

                        <button
                            type="submit"
                            className="admin-btn admin-btn-primary"
                            disabled={loadingPassword || !isLengthValid || !isMatchValid}
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '8px',
                                padding: '12px 20px',
                                marginTop: '6px',
                                background: '#e67e22',
                                borderColor: '#e67e22'
                            }}
                        >
                            <Lock size={16} />
                            <span>{loadingPassword ? 'Memproses...' : 'Perbarui Kata Sandi'}</span>
                        </button>
                    </form>
                </div>
            </div>

            {/* ─── Card 3: Security & Audit Advice ────────────────── */}
            <div style={{
                background: 'rgba(52, 152, 219, 0.05)',
                border: '1px solid rgba(52, 152, 219, 0.15)',
                borderRadius: 'var(--admin-radius)',
                padding: '16px 20px',
                display: 'flex',
                alignItems: 'center',
                gap: '14px',
                fontSize: '0.85rem',
                color: 'var(--admin-text-muted)',
                lineHeight: 1.5
            }}>
                <ShieldCheck size={22} style={{ color: 'var(--admin-info)', flexShrink: 0 }} />
                <div>
                    <strong style={{ color: 'var(--admin-text)' }}>Tips Keamanan Administrator:</strong> Setiap aktivitas login, perubahan profil, dan pergantian kata sandi dicatat dalam <span style={{ color: 'var(--admin-text)' }}>Log Sistem (Audit Trail)</span>. Jangan membagikan kredensial login kepada pihak lain.
                </div>
            </div>
        </div>
    );
}
