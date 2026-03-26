import { useState } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
    FiGrid, FiUsers, FiFileText, FiBriefcase,
    FiImage, FiMail, FiDownload, FiLogOut, FiMenu, FiX, FiChevronLeft,
    FiCalendar, FiShoppingBag
} from 'react-icons/fi';

const navItems = [
    { to: '/admin/dashboard', icon: FiGrid, label: 'Dashboard' },
    { to: '/admin/anggota', icon: FiUsers, label: 'Anggota' },
    { to: '/admin/berita', icon: FiFileText, label: 'Berita' },
    { to: '/admin/program-kerja', icon: FiBriefcase, label: 'Program Kerja' },
    { to: '/admin/galeri', icon: FiImage, label: 'Galeri' },
    { to: '/admin/kegiatan', icon: FiCalendar, label: 'Kegiatan' },
    { to: '/admin/merchandise', icon: FiShoppingBag, label: 'Merchandise' },
    { to: '/admin/pesan', icon: FiMail, label: 'Pesan' },
    { to: '/admin/export', icon: FiDownload, label: 'Export Data' },
];

export default function AdminLayout({ children }) {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/admin/login');
    };

    const getPageTitle = () => {
        const item = navItems.find((n) => location.pathname.startsWith(n.to));
        return item ? item.label : 'Admin';
    };

    return (
        <div className="admin-layout">
            {/* Sidebar Overlay */}
            {sidebarOpen && <div className="admin-sidebar-overlay" onClick={() => setSidebarOpen(false)} />}

            {/* Sidebar */}
            <aside className={`admin-sidebar ${sidebarOpen ? 'open' : ''}`}>
                <div className="admin-sidebar-header">
                    <div className="admin-logo">
                        <span className="admin-logo-icon">H</span>
                        <span className="admin-logo-text">HMTKBG</span>
                    </div>
                    <button className="admin-sidebar-close" onClick={() => setSidebarOpen(false)}>
                        <FiX />
                    </button>
                </div>

                <nav className="admin-nav">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.to}
                            to={item.to}
                            className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}
                            onClick={() => setSidebarOpen(false)}
                        >
                            <item.icon className="admin-nav-icon" />
                            <span>{item.label}</span>
                        </NavLink>
                    ))}
                </nav>

                <div className="admin-sidebar-footer">
                    <div className="admin-user-info">
                        <div className="admin-user-avatar">{user?.name?.charAt(0) || 'A'}</div>
                        <div className="admin-user-details">
                            <span className="admin-user-name">{user?.name || 'Admin'}</span>
                            <span className="admin-user-email">{user?.email || ''}</span>
                        </div>
                    </div>
                    <button className="admin-logout-btn" onClick={handleLogout}>
                        <FiLogOut />
                        <span>Logout</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <div className="admin-main">
                <header className="admin-topbar">
                    <div className="admin-topbar-left">
                        <button className="admin-menu-btn" onClick={() => setSidebarOpen(true)}>
                            <FiMenu />
                        </button>
                        <h1 className="admin-page-title">{getPageTitle()}</h1>
                    </div>
                    <div className="admin-topbar-right">
                        <NavLink to="/" className="admin-back-link">
                            <FiChevronLeft />
                            <span>Ke Website</span>
                        </NavLink>
                    </div>
                </header>

                <div className="admin-content">
                    {children}
                </div>
            </div>
        </div>
    );
}
