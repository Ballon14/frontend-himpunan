import { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Search, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const links = [
    { to: '/', label: 'Beranda' },
    { to: '/tentang', label: 'Tentang' },
    { to: '/anggota', label: 'Anggota' },
    { to: '/berita', label: 'Berita' },
    { to: '/program-kerja', label: 'Program Kerja' },
    { to: '/galeri', label: 'Galeri' },
    { to: '/prestasi', label: 'Prestasi' },
    { to: '/komunitas', label: 'Komunitas' },
    { to: '/kontak', label: 'Kontak' },
];

const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 },
};

const panelVariants = {
    hidden: { x: '100%' },
    visible: {
        x: 0,
        transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] },
    },
    exit: {
        x: '100%',
        transition: { duration: 0.25, ease: [0.22, 1, 0.36, 1] },
    },
};

const linkListVariants = {
    hidden: {},
    visible: {
        transition: { staggerChildren: 0.04, delayChildren: 0.12 },
    },
    exit: {
        transition: { staggerChildren: 0.02, staggerDirection: -1 },
    },
};

const linkItemVariants = {
    hidden: { opacity: 0, x: 24 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.25, ease: 'easeOut' } },
    exit: { opacity: 0, x: 24, transition: { duration: 0.15 } },
};

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [showSearch, setShowSearch] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const location = useLocation();
    const navigate = useNavigate();
    const searchInputRef = useRef(null);

    const handleSearchSubmit = () => {
        const q = searchQuery.trim();
        if (q) {
            setShowSearch(false);
            setSearchQuery('');
            navigate(`/berita?search=${encodeURIComponent(q)}`);
        }
    };

    useEffect(() => {
        if (showSearch && searchInputRef.current) {
            searchInputRef.current.focus();
        }
    }, [showSearch]);

    useEffect(() => {
        const onKeyDown = (e) => {
            if (e.key === 'Escape') {
                if (showSearch) { setShowSearch(false); setSearchQuery(''); }
                if (mobileOpen) setMobileOpen(false);
            }
        };
        window.addEventListener('keydown', onKeyDown);
        return () => window.removeEventListener('keydown', onKeyDown);
    }, [showSearch, mobileOpen]);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', onScroll);
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    // Lock body scroll when mobile nav or search is open
    useEffect(() => {
        if (mobileOpen || showSearch) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => { document.body.style.overflow = ''; };
    }, [mobileOpen, showSearch]);

    // Close mobile nav on route change
    useEffect(() => {
        setMobileOpen(false);
    }, [location.pathname]);

    return (
        <>
            <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
                <div className="container">
                    <Link to="/" className="navbar-brand">
                        <motion.img
                            src="/logo.jpg"
                            alt="Logo HMTKBG"
                            style={{ height: '40px', width: 'auto', borderRadius: '50%' }}
                            whileHover={{ rotate: 10, scale: 1.1 }}
                            transition={{ type: 'spring', stiffness: 300, damping: 15 }}
                        />
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
                            className="nav-action-btn"
                            onClick={() => setShowSearch(true)}
                            aria-label="Cari"
                        >
                            <Search size={20} />
                        </button>
                        <button
                            className={`nav-action-btn mobile-toggle ${mobileOpen ? 'active' : ''}`}
                            onClick={() => setMobileOpen(!mobileOpen)}
                            aria-label={mobileOpen ? 'Tutup menu' : 'Buka menu'}
                        >
                            <motion.div
                                animate={mobileOpen ? { rotate: 90 } : { rotate: 0 }}
                                transition={{ duration: 0.2 }}
                                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                            >
                                {mobileOpen ? <X size={22} /> : <Menu size={22} />}
                            </motion.div>
                        </button>
                    </div>
                </div>
            </nav>

            {/* Mobile Navigation — Slide-in Panel */}
            <AnimatePresence>
                {mobileOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            className="mobile-nav-backdrop"
                            variants={overlayVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            transition={{ duration: 0.25 }}
                            onClick={() => setMobileOpen(false)}
                        />

                        {/* Panel */}
                        <motion.aside
                            className="mobile-nav-panel"
                            variants={panelVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                        >
                            {/* Nav Links */}
                            <motion.nav
                                className="mobile-nav-links"
                                variants={linkListVariants}
                                initial="hidden"
                                animate="visible"
                                exit="exit"
                            >
                                {links.map((link) => (
                                    <motion.div key={link.to} variants={linkItemVariants}>
                                        <NavLink
                                            to={link.to}
                                            className={({ isActive }) => `mobile-nav-link ${isActive ? 'active' : ''}`}
                                            onClick={() => setMobileOpen(false)}
                                            end={link.to === '/'}
                                        >
                                            <span>{link.label}</span>
                                            <ChevronRight size={16} />
                                        </NavLink>
                                    </motion.div>
                                ))}
                            </motion.nav>

                            {/* Panel Footer */}
                            <div className="mobile-nav-footer">
                                <button
                                    className="mobile-nav-search-btn"
                                    onClick={() => { setMobileOpen(false); setShowSearch(true); }}
                                >
                                    <Search size={18} />
                                    <span>Cari di website...</span>
                                </button>
                            </div>
                        </motion.aside>
                    </>
                )}
            </AnimatePresence>

            {/* Search Overlay */}
            <AnimatePresence>
                {showSearch && (
                    <motion.div
                        className="search-overlay"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        onClick={() => { setShowSearch(false); setSearchQuery(''); }}
                    >
                        <motion.div
                            className="search-overlay-inner"
                            initial={{ opacity: 0, y: -20, scale: 0.96 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -20, scale: 0.96 }}
                            transition={{ duration: 0.2 }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="search-overlay-input-wrap">
                                <Search size={20} className="search-overlay-icon" />
                                <input
                                    ref={searchInputRef}
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    onKeyDown={(e) => { if (e.key === 'Enter') handleSearchSubmit(); }}
                                    placeholder="Cari berita, artikel..."
                                    className="search-overlay-input"
                                />
                                <button
                                    onClick={handleSearchSubmit}
                                    className="search-overlay-submit"
                                    aria-label="Cari"
                                >
                                    Cari
                                </button>
                                <button
                                    onClick={() => { setShowSearch(false); setSearchQuery(''); }}
                                    className="search-overlay-close"
                                    aria-label="Tutup"
                                >
                                    <X size={18} />
                                </button>
                            </div>
                            <p className="search-overlay-hint">Tekan Enter untuk mencari, Esc untuk menutup</p>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
