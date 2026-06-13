import { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Search } from 'lucide-react';
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
            if (e.key === 'Escape' && showSearch) {
                setShowSearch(false);
                setSearchQuery('');
            }
        };
        window.addEventListener('keydown', onKeyDown);
        return () => window.removeEventListener('keydown', onKeyDown);
    }, [showSearch]);

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
                            className="mobile-toggle"
                            onClick={() => setShowSearch(true)}
                            aria-label="Search"
                            style={{ marginRight: '0.5rem', background: 'none', border: 'none', cursor: 'pointer', color: 'inherit', display: 'flex', alignItems: 'center' }}
                        >
                            <Search size={22} />
                        </button>
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

            {/* Search Overlay */}
            <AnimatePresence>
                {showSearch && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        onClick={() => { setShowSearch(false); setSearchQuery(''); }}
                        style={{
                            position: 'fixed',
                            inset: 0,
                            zIndex: 9999,
                            backgroundColor: 'rgba(0, 0, 0, 0.75)',
                            display: 'flex',
                            alignItems: 'flex-start',
                            justifyContent: 'center',
                            paddingTop: '20vh',
                        }}
                    >
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.2 }}
                            onClick={(e) => e.stopPropagation()}
                            style={{
                                width: '90%',
                                maxWidth: '600px',
                                display: 'flex',
                                gap: '0.5rem',
                                alignItems: 'center',
                            }}
                        >
                            <input
                                ref={searchInputRef}
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onKeyDown={(e) => { if (e.key === 'Enter') handleSearchSubmit(); }}
                                placeholder="Cari berita..."
                                style={{
                                    flex: 1,
                                    padding: '0.875rem 1.25rem',
                                    fontSize: '1.125rem',
                                    borderRadius: 'var(--radius-md, 8px)',
                                    border: '2px solid rgba(255,255,255,0.2)',
                                    backgroundColor: 'rgba(255,255,255,0.1)',
                                    color: '#fff',
                                    outline: 'none',
                                    backdropFilter: 'blur(10px)',
                                }}
                            />
                            <button
                                onClick={handleSearchSubmit}
                                style={{
                                    padding: '0.875rem 1.25rem',
                                    borderRadius: 'var(--radius-md, 8px)',
                                    border: 'none',
                                    backgroundColor: 'var(--color-primary, #2563eb)',
                                    color: '#fff',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    fontSize: '1rem',
                                    fontWeight: 600,
                                }}
                            >
                                <Search size={20} />
                            </button>
                            <button
                                onClick={() => { setShowSearch(false); setSearchQuery(''); }}
                                style={{
                                    padding: '0.875rem',
                                    borderRadius: 'var(--radius-md, 8px)',
                                    border: '2px solid rgba(255,255,255,0.2)',
                                    backgroundColor: 'transparent',
                                    color: '#fff',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                }}
                            >
                                <X size={20} />
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
