import { Component } from 'react';

/**
 * ErrorBoundary — catches unhandled React rendering errors.
 * Prevents the entire page from going blank on JS errors.
 */
export default class ErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error('ErrorBoundary caught an error:', error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minHeight: '60vh',
                    padding: '2rem',
                    textAlign: 'center',
                    color: 'var(--text-primary, #e4e6ed)',
                    fontFamily: "'Inter', sans-serif",
                }}>
                    <div style={{
                        fontSize: '4rem',
                        marginBottom: '1rem',
                    }}>⚠️</div>
                    <h2 style={{
                        fontSize: '1.5rem',
                        fontWeight: 700,
                        marginBottom: '0.5rem',
                        color: 'var(--text-primary, #e4e6ed)',
                    }}>
                        Terjadi Kesalahan
                    </h2>
                    <p style={{
                        fontSize: '1rem',
                        color: 'var(--text-secondary, #9ca3af)',
                        marginBottom: '1.5rem',
                        maxWidth: '400px',
                    }}>
                        Maaf, terjadi masalah saat menampilkan halaman ini. Silakan coba muat ulang.
                    </p>
                    <button
                        onClick={() => window.location.reload()}
                        style={{
                            padding: '0.75rem 2rem',
                            borderRadius: '8px',
                            border: 'none',
                            background: 'var(--accent, #6366f1)',
                            color: '#fff',
                            fontWeight: 600,
                            cursor: 'pointer',
                            fontSize: '0.95rem',
                            transition: 'opacity 0.2s',
                        }}
                        onMouseOver={(e) => e.target.style.opacity = '0.85'}
                        onMouseOut={(e) => e.target.style.opacity = '1'}
                    >
                        Muat Ulang Halaman
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
}
