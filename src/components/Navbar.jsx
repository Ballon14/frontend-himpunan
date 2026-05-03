import { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const links = [
    { to: '/', label: 'Beranda' },
    { to: '/tentang', label: 'Tentang' },
    { to: '/anggota', label: 'Anggota' },
    { to: '/berita', label: 'Berita' },
    { to: '/program-kerja', label: 'Program Kerja' },
    { to: '/galeri', label: 'Galeri' },
    { to: '/komunitas', label: 'Komunitas' },
    { to: '/kontak', label: 'Kontak' },
];

const mobileNavVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.25, ease: 'easeOut', staggerChildren: 0.04, delayChildren: 0.05 },
    },
    exit: { opacity: 0, y: -20, transition: { duration: 0.2, ease: 'easeIn' } },
};

const mobileLinkVariants = {
    hidden: { opacity: 0, x: -16 },
    visible: { opacity: 1, x: 0 },
};

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const location = useLocation();

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', onScroll);
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    // Close mobile nav on route change
    useEffect(() => {
        setMobileOpen(false);
    }, [location.pathname]);

    return (
        <>
            <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
                <div className="container">
                    <Link to="/" className="navbar-brand">
                        <img src="/logo.jpg" alt="Logo HMTKBG" style={{ height: '40px', width: 'auto', borderRadius: '50%' }} />
                        HMTKBG
                    </Link>

                    <div className="nav-links">
                        {links.map((link) => (
                            <NavLink
                                key={link.to}
                                to={link.to}
                                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                                end={link.to === '/'}
                            >
                                {link.label}
                            </NavLink>
                        ))}
                    </div>

                    <div className="nav-actions">
                        <button
                            className="mobile-toggle"
                            onClick={() => setMobileOpen(!mobileOpen)}
                            aria-label="Toggle menu"
                        >
                            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>
            </nav>

            {/* Mobile Navigation — Animated */}
            <AnimatePresence>
                {mobileOpen && (
                    <motion.div
                        className="mobile-nav open"
                        variants={mobileNavVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                    >
                        {links.map((link) => (
                            <motion.div key={link.to} variants={mobileLinkVariants}>
                                <NavLink
                                    to={link.to}
                                    className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                                    onClick={() => setMobileOpen(false)}
                                    end={link.to === '/'}
                                >
                                    {link.label}
                                </NavLink>
                            </motion.div>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
