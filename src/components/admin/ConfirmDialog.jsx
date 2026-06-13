import { useState } from 'react';
import { AlertTriangle, Loader2, Trash2 } from 'lucide-react';

export default function ConfirmDialog({ isOpen, onClose, onConfirm, title, message }) {
    const [isLoading, setIsLoading] = useState(false);

    if (!isOpen) return null;

    const handleConfirm = async () => {
        setIsLoading(true);
        try {
            await onConfirm();
            onClose();
        } catch (err) {
            console.error('ConfirmDialog action failed:', err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div
            onClick={!isLoading ? onClose : undefined}
            style={{
                position: 'fixed', inset: 0, zIndex: 2000,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: 'rgba(0, 0, 0, 0.7)',
                backdropFilter: 'blur(4px)',
                padding: '20px',
                animation: 'fadeIn 0.2s ease',
            }}
        >
            <div
                onClick={e => e.stopPropagation()}
                style={{
                    width: '100%', maxWidth: 420,
                    background: 'linear-gradient(180deg, #1e2128 0%, #181b22 100%)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: 16,
                    boxShadow: '0 24px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.04)',
                    overflow: 'hidden',
                    animation: 'scaleIn 0.25s cubic-bezier(0.22, 1, 0.36, 1)',
                }}
            >
                {/* Top accent line */}
                <div style={{
                    height: 3,
                    background: 'linear-gradient(90deg, #c0392b, #e74c3c, #c0392b)',
                }} />

                <div style={{ padding: '2rem 2rem 1.75rem' }}>
                    {/* Icon */}
                    <div style={{
                        width: 64, height: 64, borderRadius: '50%',
                        background: 'rgba(192, 57, 43, 0.12)',
                        border: '2px solid rgba(192, 57, 43, 0.2)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        margin: '0 auto 1.25rem',
                        boxShadow: '0 0 24px rgba(192, 57, 43, 0.15)',
                    }}>
                        <AlertTriangle size={30} color="#e74c3c" strokeWidth={2} />
                    </div>

                    {/* Title */}
                    <h3 style={{
                        textAlign: 'center',
                        fontSize: '1.125rem',
                        fontWeight: 700,
                        color: '#f0f0f0',
                        marginBottom: '0.5rem',
                        fontFamily: 'var(--admin-font-heading, inherit)',
                        letterSpacing: '-0.01em',
                    }}>
                        {title || 'Konfirmasi'}
                    </h3>

                    {/* Message */}
                    <p style={{
                        textAlign: 'center',
                        color: '#8b92a5',
                        fontSize: '0.875rem',
                        lineHeight: 1.6,
                        marginBottom: '1.75rem',
                        maxWidth: 320,
                        marginLeft: 'auto',
                        marginRight: 'auto',
                    }}>
                        {message}
                    </p>

                    {/* Buttons */}
                    <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
                        <button
                            onClick={onClose}
                            disabled={isLoading}
                            style={{
                                flex: 1, padding: '0.7rem 1.25rem',
                                background: 'rgba(255, 255, 255, 0.05)',
                                border: '1px solid rgba(255, 255, 255, 0.1)',
                                borderRadius: 10,
                                color: '#c8ccd4', fontSize: '0.875rem', fontWeight: 500,
                                cursor: isLoading ? 'not-allowed' : 'pointer',
                                transition: 'all 0.2s',
                                opacity: isLoading ? 0.5 : 1,
                            }}
                            onMouseEnter={e => { if (!isLoading) e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; }}
                            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; }}
                        >
                            Batal
                        </button>
                        <button
                            onClick={handleConfirm}
                            disabled={isLoading}
                            style={{
                                flex: 1, padding: '0.7rem 1.25rem',
                                background: 'linear-gradient(135deg, #c0392b, #a93226)',
                                border: '1px solid rgba(192, 57, 43, 0.4)',
                                borderRadius: 10,
                                color: '#fff', fontSize: '0.875rem', fontWeight: 600,
                                cursor: isLoading ? 'not-allowed' : 'pointer',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                gap: '0.5rem',
                                transition: 'all 0.2s',
                                boxShadow: '0 4px 16px rgba(192, 57, 43, 0.3)',
                                opacity: isLoading ? 0.7 : 1,
                            }}
                            onMouseEnter={e => { if (!isLoading) { e.currentTarget.style.background = 'linear-gradient(135deg, #e74c3c, #c0392b)'; e.currentTarget.style.boxShadow = '0 6px 24px rgba(192, 57, 43, 0.45)'; } }}
                            onMouseLeave={e => { e.currentTarget.style.background = 'linear-gradient(135deg, #c0392b, #a93226)'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(192, 57, 43, 0.3)'; }}
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 size={16} className="animate-spin" />
                                    Memproses...
                                </>
                            ) : (
                                <>
                                    <Trash2 size={15} />
                                    Ya, Lanjutkan
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Keyframes */}
            <style>{`
                @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
                @keyframes scaleIn { from { opacity: 0; transform: scale(0.92) translateY(8px); } to { opacity: 1; transform: scale(1) translateY(0); } }
            `}</style>
        </div>
    );
}
