import { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { notifySuccess, notifyError } from '../../utils/toast';
import { Mail, Lock, LogIn } from 'lucide-react';
import { motion } from 'framer-motion';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const { login, isAuthenticated } = useAuth();
    const navigate = useNavigate();

    if (isAuthenticated) {
        return <Navigate to="/admin/dashboard" replace />;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await login(email, password);
            notifySuccess('Login berhasil!');
            navigate('/admin/dashboard', { replace: true });
        } catch (err) {
            notifyError(err.response?.data?.message || 'Login gagal.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="admin-login-page">
            <motion.div 
                className="admin-login-card"
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
            >
                <div className="admin-login-header">
                    <div className="admin-login-logo-container">
                        <img src="/logo.jpg" alt="Logo HMTKBG" className="admin-login-logo-img" />
                    </div>
                    <h1>HMTKBG Admin</h1>
                    <p>Masuk untuk mengelola website</p>
                </div>

                <form onSubmit={handleSubmit} className="admin-login-form">
                    <div className="admin-form-group">
                        <label>
                            <Mail size={16} className="admin-input-icon" />
                            <input
                                type="email"
                                placeholder="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                autoFocus
                            />
                        </label>
                    </div>

                    <div className="admin-form-group">
                        <label>
                            <Lock size={16} className="admin-input-icon" />
                            <input
                                type="password"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </label>
                    </div>

                    <motion.button 
                        type="submit" 
                        className="admin-login-btn" 
                        disabled={loading}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        {loading ? (
                            <span className="admin-btn-loading">Memproses...</span>
                        ) : (
                            <>
                                <LogIn size={16} /> Masuk
                            </>
                        )}
                    </motion.button>
                </form>
            </motion.div>
        </div>
    );
}
