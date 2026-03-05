import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import PageTransition from '../components/PageTransition';
import SEO from '../components/SEO';

export default function NotFoundPage() {
    useEffect(() => {
        // Optional logic
    }, []);

    return (
        <PageTransition>
            <SEO title="404 - Halaman Tidak Ditemukan" />
            <div className="not-found">
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: 'spring', damping: 20, stiffness: 200 }}
                    style={{ textAlign: 'center' }}
                >
                    <h1 className="text-gradient">404</h1>
                    <p style={{ fontSize: 'var(--font-size-xl)', marginBottom: '2rem' }}>
                        Oops! Halaman yang kamu cari tidak ditemukan.
                    </p>
                    <Link to="/">
                        <motion.button
                            className="btn btn-primary"
                            whileHover={{ scale: 1.05, boxShadow: '0 10px 20px rgba(var(--color-primary-rgb), 0.3)' }}
                            whileTap={{ scale: 0.95 }}
                        >
                            ← Kembali ke Beranda
                        </motion.button>
                    </Link>
                </motion.div>
            </div>
        </PageTransition>
    );
}
