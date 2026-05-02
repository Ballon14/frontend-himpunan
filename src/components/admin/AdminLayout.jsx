import { useState } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
    LayoutGrid, Users, FileText, Briefcase,
    Image, Mail, Download, LogOut, Menu, X, ChevronLeft,
    Calendar, ShoppingBag
} from 'lucide-react';

const navItems = [
    { to: '/admin/dashboard', icon: LayoutGrid, label: 'Dashboard' },
    { to: '/admin/anggota', icon: Users, label: 'Anggota' },
    { to: '/admin/berita', icon: FileText, label: 'Berita' },
    { to: '/admin/program-kerja', icon: Briefcase, label: 'Program Kerja' },
    { to: '/admin/galeri', icon: Image, label: 'Galeri' },
    { to: '/admin/kegiatan', icon: Calendar, label: 'Kegiatan' },
    { to: '/admin/merchandise', icon: ShoppingBag, label: 'Merchandise' },
    { to: '/admin/pesan', icon: Mail, label: 'Pesan' },
    { to: '/admin/export', icon: Download, label: 'Export Data' },
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
                        <X size={20} />
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
                            <item.icon className="admin-nav-icon" size={18} />
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
                        <LogOut size={18} />
                        <span>Logout</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <div className="admin-main">
                <header className="admin-topbar">
                    <div className="admin-topbar-left">
                        <button className="admin-menu-btn" onClick={() => setSidebarOpen(true)}>
                            <Menu size={20} />
                        </button>
                        <h1 className="admin-page-title">{getPageTitle()}</h1>
                    </div>
                    <div className="admin-topbar-right">
                        <NavLink to="/" className="admin-back-link">
                            <ChevronLeft size={18} />
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
