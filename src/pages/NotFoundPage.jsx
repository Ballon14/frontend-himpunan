import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function NotFoundPage() {
    useEffect(() => {
        document.title = '404 — Halaman Tidak Ditemukan';
    }, []);

    return (
        <motion.div
            className="not-found"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            <h1 className="text-gradient">404</h1>
            <p>Oops! Halaman yang kamu cari tidak ditemukan.</p>
            <Link to="/" className="btn btn-primary">
                ← Kembali ke Beranda
            </Link>
        </motion.div>
    );
}
