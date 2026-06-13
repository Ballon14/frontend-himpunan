import { CheckCircle2, XCircle, Info, Loader2, X } from 'lucide-react';
import toast from 'react-hot-toast';

/* ── Type configs ───────────────────────────────────────────────────────── */

const TYPE_CONFIG = {
    success: {
        gradient: 'linear-gradient(135deg, #0a2e1a 0%, #0f3d23 50%, #0a2e1a 100%)',
        accent: '#22c55e',
        glow: 'rgba(34, 197, 94, 0.25)',
        iconBg: 'linear-gradient(135deg, #16a34a, #15803d)',
        Icon: CheckCircle2,
        label: 'Berhasil',
    },
    error: {
        gradient: 'linear-gradient(135deg, #2a0f12 0%, #3b1318 50%, #2a0f12 100%)',
        accent: '#ef4444',
        glow: 'rgba(239, 68, 68, 0.25)',
        iconBg: 'linear-gradient(135deg, #dc2626, #b91c1c)',
        Icon: XCircle,
        label: 'Gagal',
    },
    info: {
        gradient: 'linear-gradient(135deg, #0a1628 0%, #0f2240 50%, #0a1628 100%)',
        accent: '#3b82f6',
        glow: 'rgba(59, 130, 246, 0.25)',
        iconBg: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
        Icon: Info,
        label: 'Info',
    },
    loading: {
        gradient: 'linear-gradient(135deg, #1a1030 0%, #241545 50%, #1a1030 100%)',
        accent: '#a78bfa',
        glow: 'rgba(167, 139, 250, 0.25)',
        iconBg: 'linear-gradient(135deg, #7c3aed, #6d28d9)',
        Icon: Loader2,
        label: 'Memuat',
    },
};

/* ── Toast shell ────────────────────────────────────────────────────────── */

function ToastShell({ type, message, t }) {
    const cfg = TYPE_CONFIG[type] || TYPE_CONFIG.info;
    const { gradient, accent, glow, iconBg, Icon, label } = cfg;

    return (
        <div
            style={{
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                gap: '0.875rem',
                padding: '1rem 1rem 1rem 1.25rem',
                background: gradient,
                border: `1px solid ${accent}30`,
                borderRadius: 14,
                boxShadow: `0 4px 32px rgba(0,0,0,0.5), 0 0 48px ${glow}, inset 0 1px 0 rgba(255,255,255,0.04)`,
                color: '#eef0f4',
                fontSize: '0.875rem',
                lineHeight: 1.5,
                minWidth: 320,
                maxWidth: 440,
                opacity: t.visible ? 1 : 0,
                transform: t.visible ? 'translateY(0) scale(1)' : 'translateY(-20px) scale(0.9)',
                transition: 'all 0.4s cubic-bezier(0.22, 1, 0.36, 1)',
                overflow: 'hidden',
            }}
        >
            {/* Accent glow stripe at the top */}
            <div style={{
                position: 'absolute', top: 0, left: 0, right: 0, height: 2,
                background: `linear-gradient(90deg, transparent, ${accent}, transparent)`,
            }} />

            {/* Icon */}
            <div style={{
                width: 38, height: 38, borderRadius: '50%', flexShrink: 0,
                background: iconBg,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: `0 0 16px ${glow}, inset 0 1px 0 rgba(255,255,255,0.15)`,
            }}>
                <Icon size={18} color="#fff" strokeWidth={2.5}
                    className={type === 'loading' ? 'animate-spin' : ''}
                />
            </div>

            {/* Text */}
            <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{
                    fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase',
                    letterSpacing: '0.08em', color: accent, marginBottom: 2,
                }}>
                    {label}
                </div>
                <div style={{ fontWeight: 500, color: '#e4e6ed' }}>{message}</div>
            </div>

            {/* Dismiss */}
            <button
                onClick={() => toast.dismiss(t.id)}
                style={{
                    width: 26, height: 26, borderRadius: 8, flexShrink: 0,
                    background: 'rgba(255,255,255,0.06)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: 'pointer', color: '#8b92a5', padding: 0,
                    transition: 'all 0.15s',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.12)'; e.currentTarget.style.color = '#fff'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.color = '#8b92a5'; }}
            >
                <X size={13} />
            </button>
        </div>
    );
}

/* ── Public API ─────────────────────────────────────────────────────────── */

export function notifySuccess(message, id) {
    const opts = id ? { id } : {};
    return toast.custom((t) => <ToastShell type="success" message={message} t={t} />, {
        duration: 3500, ...opts,
    });
}

export function notifyError(message, id) {
    const opts = id ? { id } : {};
    return toast.custom((t) => <ToastShell type="error" message={message} t={t} />, {
        duration: 5000, ...opts,
    });
}

export function notifyLoading(message, id) {
    const opts = id ? { id } : {};
    return toast.custom((t) => <ToastShell type="loading" message={message} t={t} />, {
        duration: Infinity, ...opts,
    });
}

export function notifyInfo(message, id) {
    const opts = id ? { id } : {};
    return toast.custom((t) => <ToastShell type="info" message={message} t={t} />, {
        duration: 3500, ...opts,
    });
}
